/*
 * @author	gideon mw jones (@gideonparanoid)
 * @version	who knows
 *
 * functions for drawing game components on the canvas, includes gui
 */


// gui pulsing and shifting
var gui = {
	pulse  : 255,
	up	   : true,
	shift_1: -500,
	shift_2: 500
};



function view_draw_initialise() {
	context.lineWidth = 5;
}



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

	// defaulting static variables
	if (view_draw_game.timer == null) view_draw_game.timer = 0;
	if (view_draw_game.shift == null) view_draw_game.shift = 0;

	// detecting level transitions
	if (level != view_draw_game.timer) 	view_draw_game.shift = 30;
	else if (view_draw_game.timer == 0)	view_draw_game.shift = level;
	else if (view_draw_game.timer > 0)	view_draw_game.timer--;
	
	
	// drawing game & gui elements
	view_draw_background(view_level_shift(level_current.gui.background, level_next.gui.background, view_draw_game.timer));
	view_draw_threats(view_level_shift(level_current.lines.threats, level_next.lines.threats, view_draw_game.timer), threats);
	view_draw_defenses(view_level_shift(level_current.lines.defenses, level_next.lines.defenses, view_draw_game.timer), defenses);
	view_draw_target(level_current.target.size,
		view_level_shift(level_current.target.ring_1, level_next.target.ring_1, view_draw_game.timer),
		view_level_shift(level_current.target.ring_2, level_next.target.ring_2, view_draw_game.timer));
	
	view_draw_footer('LEVEL: ' + level,
		'LIVES: ' + lives,
		'SCORE: ' + score,
		'DEFENSES: ' + defenses.length + '/' + (Math.floor(level * 1.5) + 3));
}


/*
 * clears the canvas & paints it the colour specified
 * @param background		hsla background colour, black if null
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
 * draws a list of threat objects on the canvas
 * @param colour		colour of the threats
 * @param list		an array of threats
 */
function view_draw_threats(colour, list) {
	for (var i = 0; i < threats.length; i++) {
		view_draw_line(Math.cos(list[i].angle) * trig,
			Math.sin(list[i].angle) * trig,
			Math.cos(list[i].angle) * list[i].distance,
			Math.sin(list[i].angle) * list[i].distance,
			threats[i].life,
			colour);
	}
}


/*
 * draws a list of defense objects on the canvas
 * @param colour		colour of the defenses
 * @param list		an array of defenses
 */
function view_draw_defenses(colour, list) {
	for (var i = 0; i < list.length; i++) {
		view_draw_line(list[i].start.x,
			list[i].start.y,
			list[i].end.x,
			list[i].end.y,
			defenses[i].life,
			colour);
	}
}


/*
 * @param x1, y1, x2, y2	coordinates describing a line to draw
 * @param life			how long the line has to live, -1 if alive
 * @param colour			the colour for a fully living line
 */
function view_draw_line(x1, y1, x2, y2, life, colour) {

	// if living
	if (life == -1) {
		context.strokeStyle = colour;
		
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.stroke();
		context.closePath();

	// dying
	} else {
		context.strokeStyle = '';
		context.lineWidth = 10 - ((30 - life) / 3);
		
		
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.stroke();
		context.closePath();
	}
	
	context.lineWidth = 10;
}




/*
 * @param	size			the size of the target
 * @param	colour_1		the colour of the inner ring
 * @param	colour_2		the colour of the outer ring
 */
function view_draw_target(size, colour_1, colour_2) {
	// initialising 
	if (view_draw_target.ring_1 == null) {
		view_draw_target.ring_1 = 0;
		view_draw_target.ring_2 = 0;
		view_draw_target.pulse = 0;
		view_draw_target.up = true;		
	}

	if (view_draw_target.up) {
		if (view_draw_target.pulse != 20) {
			view_draw_target.pulse++;
		} else {
			view_draw_target.up = false;
		}
	} else {
		if (view_draw_target.pulse != 0) {
			view_draw_target.pulse--;
		} else {
			view_draw_target.up = true;
		}
	}
	
	context.strokeStyle = colour_1;
	context.beginPath();
	context.arc(0, 0, size,
		view_draw_target.ring_1 += Math.PI / 30,
		view_draw_target.ring_1 + Math.PI);
	context.stroke();
	context.closePath();
	
	context.strokeStyle = colour_2;
	context.beginPath();
	
	// preventing invalid param issues
	if (size < 20) {
		context.arc(0, 0, size + 10,
			view_draw_target.ring_2 -= Math.PI / 30,
			view_draw_target.ring_2 + Math.PI);
	} else {
		context.arc(0, 0, size - 10,
			view_draw_target.ring_2 -= Math.PI / 30,
			view_draw_target.ring_2 + Math.PI);
	}
	context.stroke();
	context.closePath();
}




/*
 * @param	data_component	initial hsla array
 * @param	shift_component	end component
 * @param	timer			number determining what stage it is at
 * @return					hsla string of initial component shifted by the component times the timer
 */
function view_level_shift(data_component, shift_component, timer) {
	var max = 30;
	
	return 'hsla(' + Math.ceil(data_component[0] + ((Math.abs(data_component[0] - shift_component[0]) / max) * timer))
	+ ', ' + Math.ceil(data_component[1] + ((Math.abs(data_component[1] - shift_component[0]) / max) * timer))
	+ '%, ' + Math.ceil(data_component[2] + ((Math.abs(data_component[2] - shift_component[2]) / max) * timer))
	+ '%, ' + Math.ceil(data_component[3] + ((Math.abs(data_component[3] - shift_component[3]) / max) * timer))
	+ ')';
}













/*
 * draws the title at the top of the screen
 * @param title	string for the title
 */
function view_draw_title(title) {
	if (++gui.shift_1 > +canvas.width * .8) gui.shift_1 = -canvas.width;
	if (--gui.shift_2 < -canvas.width * .8) gui.shift_2 = canvas.width;

	context.fillStyle = 'hsla(0, 0%, 100%, 1)';
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.font = '150px wipeout';
	context.fillText(title, 0, 0);

	context.fillStyle = 'hsla(0, 0%, 100%, .25)';
	context.fillText(title, gui.shift_1, 50);
	context.fillText(title, gui.shift_2, -50);
}



function view_draw_text(text) {
	context.fillStyle = 'hsla(0, 0%, 100%, 1)';
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.font = '25px wipeout';
	context.fillText(text, 0, 40);
}





/*
 * draws the menu options, the selected option pulsates 
 * @param menu_options	object describing menu options {selected : index, options : [{title : string, functionality: function}]}
 */
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
 * draws the footer of the screen displaying the strings passed
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






/*
 * draws a menu gui, uses menu object for option name & controls hints
 * @param 	title				string for the page title
 * @param 	menu_options			object describing menu options	{selected : index, options : [{title : string, functionality: function}]}
 * @param 	keyboard_controls	object describing menu controls	[{key : string, description: string, functionality : function}]
 */
function view_draw_gui(title, text, menu_options, keyboard_controls) {
	var control_hints = ['', '', '', ''];

	// drawing hints in the footer for keyboard controls
	if (keyboard_controls != null) {
		for (var i = 0; i < 4; i++) {
			keyboard_hints[i] = (keyboard_controls[i] == undefined) ? null : keyboard_controls[i].key + ': ' + keyboard_controls[i].description;
		}
	}
	
	// selected option pulsing
	(gui.up) ? ((gui.pulse == 255) ? gui.up = false : gui.pulse += 15) : ((gui.pulse == 0) ? gui.up = true : gui.pulse -= 15);

	view_draw_background();
	
	if (title != null)	view_draw_title(title);
	if (text != null)	view_draw_text(text);
	
	if (menu_options != null)	{
		view_draw_options(menu_options);
		view_draw_footer(control_hints[0], control_hints[1], control_hints[2], control_hints[3]);
	}
}
