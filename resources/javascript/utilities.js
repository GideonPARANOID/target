/*
 * @author	gideon mw jones (@gideonparanoid)
 * @version	who knows
 */


/*
 * @param hex	hexidecimal colour value to be converted
 * @return		array of numbers describing a hsla colour [hue, saturation, lightness, transparency]
 */
function hex_to_hsla_array(hex) {
	var temp = color2color(hex, 'hsla');

	temp = temp.replace('hsl(','');
	temp = temp.replace(')','');
	
	var array = temp.split(',');
	
	return [parseInt(array[0]), parseInt(array[1]), parseInt(array[2]), 1];
}



/*
 * @return 	string of time & date in format H:M:S D/M/YYYY
 */ 
function get_date() {
	var currentdate = new Date();
	return currentdate.getHours()
		 + ':' + currentdate.getMinutes()
		 + ':' + currentdate.getSeconds()
		 + ' ' + currentdate.getDay()
		 + '/' + currentdate.getMonth()
		 + '/' + currentdate.getFullYear();
}


/*
 * shuffles an array
 * reference: http://stackoverflow.com/a/6274398/1323970
 */ 
Array.prototype.shuffle = function() {
	for (var i = this.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
}

/*
 * empties an array
 */
Array.prototype.clear = function() {
	this.length = 0;
	return this;
}



/*
 * loading another javascript file
 * reference: http://stackoverflow.com/a/950146/1323970
 */
function load_javascript(url, location){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild(script);
	script.onload = console.log(location + ' javascript loaded ' + url);
}






/*
 * @param x1, y1, x2, y2		set of number coordinates for the second line
 * @param x3, y3, x4, y4		set of number coordinates for the second line
 * @return					boolean whether the two passed lines cross
 */
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
