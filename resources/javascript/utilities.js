//	Converting hexidecimal values into RGB ones
//	Reference: http://www.javascripter.net/faq/hextorgb.htm
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


//	Returns a string of the time & date
function get_date() {
	var currentdate = new Date();
	return currentdate.getHours() 
		 + ':' + currentdate.getMinutes() 
		 + ':' + currentdate.getSeconds();
		 + ' '+ currentdate.getDay()
		 + '/'+currentdate.getMonth() 
		 + '/' + currentdate.getFullYear();
}


//	Defining the function shuffle for arrays
//	Reference: http://stackoverflow.com/a/6274398/1323970
Array.prototype.shuffle = function() {
	for (var i = this.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = this[i];
		this[i] = this[j];
		this[j] = tmp;
	}

	return this;
}

//	Defining the function clear for arrays
//	References: me!
Array.prototype.clear = function() {
	this.length = 0;
	return this;
}

//	Cloning an array
//	Reference: http://davidwalsh.name/javascript-clone-array
Array.prototype.clone = function() {
	return this.slice(0);
};



