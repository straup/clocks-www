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
    d.setAttribute("data-location", loc);   

    var cls = new Array()
    cls.push("clock");

    var stats = clocks_stats(loc, details);

    cls.push("clock-" + stats['tod']);

    if (! stats['today']){
	var foo = (stats['tomorrow']) ? "clock-tomorrow" : "clock-yesterday";
	cls.push(foo);
    }

    d.setAttribute("class", cls.join(" "));

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

function clocks_stats(loc, details){

    var dt = new Date();

    var here_offset = dt.getTimezoneOffset() / 60;
    var there_offset = parseInt(details['offset']);

    var here = clocks_get_dt(0 - here_offset);
    var there = clocks_get_dt(there_offset);

    var today = null;
    var tomorrow = null;
    var yesterday = null;

    if (clocks_dt_to_ymd(here) == clocks_dt_to_ymd(there)){
	today = true;
    }

    else if (there.getTime() > here.getTime()){
	tomorrow = true;
    }

    else {
	yesterday = true;
    }

    var hrs = there.getUTCHours();
    var tod = (hrs < 12) ? 'am' : 'pm';

    var stats = {
	'today': today,
	'tomorrow': tomorrow,
	'yesterday': yesterday,
	'tod' : tod
    };

    console.log(stats);
    return stats;
}

function clocks_dt_to_ymd(dt){
    var iso = dt.toISOString();
    var ymd = iso.split("T")[0];
    return ymd;
}

// offset is in hours

function clocks_get_dt(offset){

    var utc = new Date();
    offset = ((offset * 60) * 60 * 1000);

    var dt = new Date();
    dt.setTime(utc.getTime() + offset);

    return dt;
}

function clocks_is_yesterday(loc, details){

}

function clocks_is_tomorrow(loc, details){

}
