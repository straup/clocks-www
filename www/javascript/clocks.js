function clocks_init(){

    clocks_load_clocks(clocks_draw_clocks);

    var a = document.getElementById("add");

    if (a){
	a.addEventListener("click", clocks_create_clock, false);
    }
}

function clocks_load_clocks(cb){

    localforage.getItem('clocks', function(rsp){
	    cb(rsp);
	});
}

function clocks_remove_clock(loc){

    var cb = function(clocks){
	del(clocks[loc]);

	clocks_save_clocks(clocks);
    };

    clocks_load_clocks(cb);
}

function clocks_save_clocks(clocks){

    localforage.setItem('clocks', clocks, function(rsp){
	    clocks_draw_clocks(rsp);
	})
}

function clocks_create_clock(e){

    var loc = prompt('Location:');
    
    if (! loc){
	return false;
    }

    var offset = prompt('Offset (from UTC): ');

    if (! offset){
	return false;
    }

    var details = { 'offset': offset };
    clocks_add_clock(loc, details);
}

function clocks_add_clock(loc, details){

    var cb = function(clocks){

	if (! clocks){
	    clocks = {};
	}

	clocks[loc] = details;
	clocks_save_clocks(clocks);
    };

    clocks_load_clocks(cb);
}

function clocks_redraw_clocks(clocks){

    // remove all the clocks here
    clocks_draw_clocks(clocks);
}

function clocks_draw_clocks(clocks){

    for (loc in clocks){
	var details = clocks[loc];
	clocks_draw_clock(loc, details);
    }
}

function clocks_draw_clock(loc, details){

    var id = clocks_clock_id(loc, details);

    var ns = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(ns, "svg");
    s.setAttribute("id", id);

    var d = document.createElement("div");
    d.setAttribute("class", "clock");
    d.setAttribute("data-location", loc);   

    var c = document.getElementById("clocks");    
    d.appendChild(s);

    d.addEventListener("click", function(e){
	    var t = e.target;

	    if (t.nodeName != 'DIV'){
		return;
	    }

	    var loc = t.getAttribute("data-location");

	    if (! confirm("Remove this clock?")){
		return;
	    }
	    
	    clocks_remove_clock(loc);
    }, false);

    document.body.appendChild(d);

    clocks_start_clock(loc, details);
}

function clocks_start_clock(loc, details){

    var dt = new Date();
    var offset = dt.getTimezoneOffset() / 60;

    var id = clocks_clock_id(loc, details);
    console.log("new clock " + id);

    var cl = new Clock(id, (offset - details['offset']));
    cl.startClock();
    // cl.hideSecondHand();
}

function clocks_clock_id(loc, details){

    var id = loc;
    id = id.toLowerCase();    
    id = id.replace(" ", "-");

    id = "clock-" + id;
    return id;
}