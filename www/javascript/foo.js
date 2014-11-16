function foo_init(){

    foo_load_clocks(foo_draw_clocks);

    var a = document.getElementById("add");
    a.addEventListener("click", foo_create_clock, false);

}

function foo_load_clocks(cb){

    localforage.getItem('clocks', function(rsp){
	    cb(rsp);
	});
}

function foo_remove_clock(label){

    var cb = function(clocks){
	del(clocks[label]);

	foo_save_clocks(clocks);
    };

    foo_load_clocks(cb);
}

function foo_save_clocks(clocks){

    localforage.setItem('clocks', clocks, function(rsp){
	    foo_draw_clocks(rsp);
	})
}

function foo_create_clock(e){

    var loc = prompt('Location:');
    
    if (! loc){
	return false;
    }

    var offset = prompt('Offset (from UTC): ');

    if (! offset){
	return false;
    }

    var details = { 'offset': offset };
    foo_add_clock(loc, details);
}

function foo_add_clock(loc, details){

    var cb = function(clocks){

	if (! clocks){
	    clocks = {};
	}

	clocks[loc] = details;
	foo_save_clocks(clocks);
    };

    foo_load_clocks(cb);
}

function foo_draw_clocks(clocks){

    for (loc in clocks){
	var details = clocks[loc];
	foo_draw_clock(loc, details);
    }
}

function foo_draw_clock(loc, details){

    var id = foo_clock_id(loc, details);
    
    var s = document.createElement("svg");
    s.setAttribute("id", id);

    var d = document.createElement("div");
    d.setAttribute("data-location", loc);

    var c = document.getElementById("clocks");
    
    d.appendChild(s);
    c.appendChild(d);

    foo_start_clock(loc, details);
}

function foo_start_clock(loc, details){

    var dt = new Date();
    var offset = dt.getTimezoneOffset() / 60;

    var id = foo_clock_id(loc, details);
    
    var cl = new Clock(id, (offset - details['offset']));
    cl.startClock();
    cl.hideSecondHand();
}

function foo_clock_id(loc, details){

    var id = loc;
    id = id.toLowerCase();    
    id = id.replace(" ", "-");

    id = "clock-" + id;
    return id;
}