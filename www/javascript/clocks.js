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
	delete(clocks[loc]);
	clocks_save_clocks(clocks);
    };

    clocks_load_clocks(cb);
}

function clocks_save_clocks(clocks){

    localforage.setItem('clocks', clocks, function(rsp){
	    clocks_redraw_clocks(rsp);
	})
}

function clocks_create_clock(e){

    /*
      clearly we should be using a geocoder to figure out the timezone
      but that's actually a whole lot of UI work so for the moment it
      is considered yak-shaving (20141116/straup)
    */

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

function clocks_purge_clocks(){

    var els = document.getElementsByClassName('clock');

    while (els[0]){
	els[0].parentNode.removeChild(els[0]);
    }

}

function clocks_redraw_clocks(clocks){

    clocks_purge_clocks();
    clocks_draw_clocks(clocks);
}

function clocks_draw_clocks(clocks){
    
    clocks = clocks_sort_clocks(clocks);

    for (loc in clocks){
	var details = clocks[loc];
	clocks_draw_clock(loc, details);
    }
}

function clocks_sort_clocks(clocks){

    var tmp = {};

    for (loc in clocks){

	var offset = parseInt(clocks[loc]['offset']);
	
	if (! tmp[offset]){
	    tmp[offset] = new Array();
	}

	tmp[offset].push(loc);
    }

    function compareNumbers(a, b){
	return a - b;
    }

    var keys = Object.keys(tmp);
    keys.sort(compareNumbers);

    var sorted = {};

    for (var i in keys){
	
	var offset = keys[i];

	for (var j in tmp[offset]){
	    var loc = tmp[offset][j];

	    sorted[loc] = clocks[loc];
	}
    }

    return sorted;
}

function clocks_draw_clock(loc, details){

    var id = clocks_clock_id(loc, details);

    var ns = "http://www.w3.org/2000/svg";
    var s = document.createElementNS(ns, "svg");
    s.setAttribute("id", id);

    var d = document.createElement("div");
    d.setAttribute("class", "clock");
    d.setAttribute("data-location", loc);   

    if (! clocks_is_today(loc, details)){

	var add_class = "clock-tomorrow";

	if (clocks_is_yesterday(loc, details)){
	    add_class = "clock-yesterday";
	}

	var classes = d.getAttribute("class");
	d.setAttribute("class", classes + " " + add_class);
    }

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

    var id = clocks_clock_id(loc, details);

    var dt = new Date();
    var tz_offset = dt.getTimezoneOffset() / 60;

    var loc_offset = parseInt(details['offset']);
    var offset = tz_offset + loc_offset;

    var cl = new Clock(id, offset);
    cl.startClock();
}

function clocks_clock_id(loc, details){

    var id = loc;
    id = id.toLowerCase();    
    id = id.replace(/ /g, "-");

    id = "clock-" + id;
    return id;
}

function clocks_is_today(loc, details){
    return true;
}

function clocks_is_yesterday(loc, details){

}

function clocks_is_tomorrow(loc, details){

}