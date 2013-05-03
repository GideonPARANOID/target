// converting hexidecimal values into RGB ones
// reference: http://www.javascripter.net/faq/hextorgb.htm
function hex_to_red(hex) {
	return parseInt((cut_hex(hex)).substring(0, 2), 16);
}

function hex_to_green(hex) {
	return parseInt((cut_hex(hex)).substring(2, 4), 16);
}

function hex_to_blue(hex) {
	return parseInt((cut_hex(hex)).substring(4, 6), 16);
}

function cut_hex(hex) {
	return (hex.charAt(0) == '#') ? hex.substring(1, 7) : hex;
}

function hex_to_array(hex, transparency) {
	return [hex_to_red(hex), hex_to_green(hex), hex_to_blue(hex), transparency];
}


// returns a string of the time & date
function get_date() {
	var currentdate = new Date();
	return currentdate.getHours()
		 + ':' + currentdate.getMinutes()
		 + ':' + currentdate.getSeconds()
		 + ' '+ currentdate.getDay()
		 + '/'+currentdate.getMonth()
		 + '/' + currentdate.getFullYear();
}


// defining the function shuffle for arrays
// reference: http://stackoverflow.com/a/6274398/1323970
Array.prototype.shuffle = function() {
	for (var i = this.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}

	return this;
}

//	defining the function clear for arrays
//	references: me!
Array.prototype.clear = function() {
	this.length = 0;
	return this;
}

// cloning an array
// reference: http://davidwalsh.name/javascript-clone-array
Array.prototype.clone = function() {
	return this.slice(0);
};







// loading another javascript file
// reference: http://stackoverflow.com/a/950146/1323970
function load_javascript(url, location){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);

	script.onload = console.log(location + ' javascript loaded ' + url);
}








// line intersection of two lines in certain range, takes start & end points of the two lines, here be complicated maths
function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
	var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

	if (isNaN(x) || isNaN(y)) {
		return false;
	} else {
		if (x1 >= x2) {
			if (!(x2 <= x && x <= x1)) {
				return false;
			}
		} else {
			if (!(x1 <= x && x <= x2)) {
				return false;
			}
		}
		if (y1 >= y2) {
			if (!(y2 <= y && y <= y1)) {
				return false;
			}
		} else {
			if (!(y1 <= y && y <= y2)) {
				return false;
			}
		}
		if (x3 >= x4) {
			if (!(x4 <= x && x<= x3)) {
				return false;
			}
		} else {
			if (!(x3 <= x && x <= x4)) {
				return false;
			}
		}
		if (y3 >= y4) {
			if (!(y4 <= y && y <= y3)) {
				return false;
			}
		} else {
			if (!(y3 <= y && y <= y4)) {
				return false;
			}
		}
	}
	return true;
}
