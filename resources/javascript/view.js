//	Functions for drawing game components on the canvas, includes gui
//	Also handles music, generally the appearance of the game


// defaulting & structure definition
var level_shift = {
	target : {
		size   : 20,
		ring_1 : [0, 0, 0, 0],
		ring_2 : [0, 0, 0, 0]
	},
	lines : {
		threats	 : [0, 0, 0, 0],
		defenses : [0, 0, 0, 0]
	},
	gui: {
		background : [0, 0, 0, 0],
		text	   : [0, 0, 0, 0]
	},
	timer : 0
}

//	Temp variables for target arcs spinning















/*
 * draws a line between the sets of coordinates passed in
 * @param x1, y1, x2, y2	the start & end coordinates of an end of a lines
 */
function view_draw_defense_current(x1, y1, x2, y2) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
	context.closePath();
}















// gui pulsing and shifting
var gui = {
	pulse  : 255,
	up	   : true,
	shift_1: -500,
	shift_2: 500
};


// arc spinning
var target = {
	ring_1: 0,
	ring_2: 0,
	pulse : 0,
	up	  : true
};


var level_shift_timer = 0;
var level_shift = 0;





/*
 * @param level_current	an object containing the style of the current level
 * @param level_next		an object containing the style of the next level (for shifting purposes)
 * @param threats		an array of incoming lines
 * @param defenses		an array of lines drawn by the user
 * @param level			the current level
 * @param lives			the current lives
 * @param score			the current score
 */
function view_draw_game(level_current, level_next, threats, defenses, level, lives, score) {
	
	context.lineWidth = 5;
	
	if (level != level_shift) 		level_shift = 60;
	else if (level_shift_timer == 0)	level_shift = level;
	else if (level_shift_timer > 0)	level_shift_timer--;
	
	
	// drawing game & gui elements
	view_draw_background(view_level_shift(level_current.gui.background, level_next.gui.background));
	view_draw_threats(view_level_shift(level_current.lines.threats, level_next.lines.threats), threats);
	view_draw_defenses(view_level_shift(level_current.lines.defenses, level_next.lines.defenses), defenses);
	view_draw_target(level_current.target.size,
					 view_level_shift(level_current.target.ring_1, level_next.target.ring_1),
					 view_level_shift(level_current.target.ring_2, level_next.target.ring_2));
	
	view_draw_footer('LEVEL: ' + level,
					'LIVES: ' + lives,
					'SCORE: ' + score,
					'DEFENSES: ' + defenses.length + '/' + (Math.floor(level * 1.5) + 3));
}


/*
 * @param background		hsla background colour
 */
function view_draw_background(background) {
	canvas.style.background = (background != null) ? background : 'hsla(0, 0%, 0%, 1)';
	
	context.beginPath();
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();
	context.closePath();
}


/*
 * @param colour		hsla colour of the threats
 * @param list		an array of threats
 */
function view_draw_threats(colour, list) {
	// maximum distance from the center, for line length, pythagoras
	var trig = (((canvas.width / 2) ^ 2) + ((canvas.height / 2) ^ 2)) ^ .5;

	context.strokeStyle = colour;
	
	for (var i = 0; i < threats.length; i++) {
		context.beginPath();
		context.moveTo(Math.cos(list[i].angle) * trig, Math.sin(list[i].angle) * trig);
		context.lineTo(Math.cos(list[i].angle) * list[i].distance, Math.sin(list[i].angle) * list[i].distance);
		context.stroke();
		context.closePath();
	}
}


/*
 * @param colour		hsla colour of the defenses
 * @param list		an array of defenses
 */
function view_draw_defenses(colour, list) {
	context.strokeStyle = colour;
	
	for (var i = 0; i < list.length; i++) {
		context.beginPath();
		context.moveTo(list[i].start.x, list[i].start.y);
		context.lineTo(list[i].end.x, list[i].end.y);
		context.stroke();
		context.closePath();
	}
}



/*
 * @param	size			the size of the target
 * @param	colour_1		the colour of the inner ring
 * @param	colour_2		the colour of the outer ring
 */
function view_draw_target(size, colour_1, colour_2) {

	if (target.up) {
		if (target.pulse != 20)	target.pulse++;
		else 					target.up = false;
	} else {
		if (target.pulse != 0)	target.pulse--;
		else						target.up = true;
 	}
	
	context.strokeStyle = colour_1;
	context.beginPath();
	context.arc(0, 0, size, target.ring_1 += Math.PI / 30, target.ring_1 + Math.PI);
	context.stroke();
	context.closePath();
	
	context.strokeStyle = colour_2;
	context.beginPath();
	
	// preventing invalid param issues
	if (size < 20) {
		context.arc(0, 0, size + 10, target.ring_2 -= Math.PI / 30, target.ring_2 + Math.PI);
	} else {
		context.arc(0, 0, size - 10, target.ring_2 -= Math.PI / 30, target.ring_2 + Math.PI);
	}
	context.stroke();
	context.closePath();
}




/*
 * @param	data_component	initial hsla array
 * @param	shift_component	a fraction of the difference between current & next level
 * @return					hsla string of initial component + shifted one
 */
function view_level_shift(data_component, shift_component) {
	return 'hsla(' + Math.ceil(data_component[0] + (shift_component[0] * level_shift_timer))
	+ ', ' + Math.ceil(data_component[1] + (shift_component[1] * level_shift_timer))
	+ '%, ' + Math.ceil(data_component[2] + (shift_component[2] * level_shift_timer))
	+ '%, ' + Math.ceil(data_component[3] + (shift_component[3] * level_shift_timer))
	+ ')';
}













/*
 * @param title	string for the large title at the top of the screen
 */
function view_draw_title(title) {
	if (++gui.shift_1 > +canvas.width * .8) gui.shift_1 = -canvas.width;
	if (--gui.shift_2 < -canvas.width * .8) gui.shift_2 = canvas.width;

	view_draw_background();

	context.fillStyle = 'hsla(0, 0%, 0%, 1)';
	context.fillRect(-canvas.width * .5, -canvas.height * .4, canvas.width, canvas.height * .8);

	context.fillStyle = 'hsla(0, 0%, 100%, 1)';
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.font = '150px wipeout';
	context.fillText(title, 0, 0);

	context.fillStyle = 'hsla(0, 0%, 100%, .25)';
	context.fillText(title, gui.shift_1, 50);
	context.fillText(title, gui.shift_2, -50);
}


// draws the footer of the screen displaying the strings passed
/*
 * @param one	string for the furthest left item
 * @param two	string for the closest left item
 * @param three	string for the furthest right item
 * @param four	string for the closest right item
 */
function view_draw_footer(one, two, three, four) {
	context.textAlign = 'center';
	context.textBaseline = 'bottom';
	context.font = '25px wipeout';

	context.fillStyle = 'hsla(0, 0%, 0%, 1)';
	context.fillRect(-canvas.width * .5, canvas.height * .45, canvas.width, canvas.height * .1);
	context.fillStyle = 'hsla(0, 0%, 100%, 1)';

	context.textAlign = 'right';
	context.fillText(one, -canvas.width / 4, canvas.height * .5);
	context.fillText(two, -canvas.width / 16, canvas.height * .5);

	context.textAlign = 'left';
	context.fillText(three, canvas.width / 16, canvas.height * .5);
	context.fillText(four, canvas.width / 4, canvas.height * .5);
}


function view_draw_options(menu_options) {
	if (menu_options != null) {
		var options = ['', '', ''];

		//
		for (var i = 0; i < menu_options.options.length; i++) {
			options[i] = menu_options.options[i].title;
		}

		if (options.length == 1) {
			options[1] = options[0];
			options[0] = '';
		}

		context.fillStyle = 'rgba(255, 255, 255, 1.0)';

		if (menu_options.selected == 0) context.fillStyle = 'rgba(' + gui.pulse + ', 0, 0, .75)';

		context.textAlign = 'left';
		context.font = '25px wipeout';
		context.fillText(options[0], -400, 100);

		if (menu_options.selected == 0) context.fillStyle = 'rgba(255, 255, 255, 1.0)';
		if (menu_options.selected == 1) context.fillStyle = 'rgba(' + gui.pulse + ', 0, 0, .75)';

		context.textAlign = 'center';
		context.fillText(options[1], 0, 100);

		if (menu_options.selected == 1) context.fillStyle = 'rgba(255, 255, 255, 1.0)';
		if (menu_options.selected == 2) context.fillStyle = 'rgba(' + gui.pulse + ', 0, 0, .75)';

		context.textAlign = 'right';
		context.fillText(options[2], 400, 100);
	}
}



























/*
 * draws a menu gui, uses menu object for option name & controls hints
 * @param 	title				string for the page title
 * @param 	menu_options			object describing menu options	{selected : index, options : [{title : string, functionality: function}]}
 * @param 	keyboard_controls	object describing menu controls	[{key : string, description: string, functionality : function}]
 */
function view_draw_gui(title, menu_options, keyboard_controls) {
	var control_hints = ['', '', '', ''];

	// drawing hints in the footer for keyboard controls
	if (keyboard_controls != null) {
		for (var i = 0; i < 4; i++) {
			keyboard_hints[i] = (keyboard_controls[i] == undefined) ? null : keyboard_controls[i].key + ': ' + keyboard_controls[i].description;
		}
	}
	
	// selected option pulsing
	(gui.up) ? ((gui.pulse == 255) ? gui.up = false : gui.pulse += 15) : ((gui.pulse == 0) ? gui.up = true : gui.pulse -= 15);

	view_draw_title(title);
	view_draw_options(menu_options);
	view_draw_footer(control_hints[0], control_hints[1], control_hints[2], control_hints[3]);
}
