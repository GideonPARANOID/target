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
var target = {
	ring_1: 0,
	ring_2: 0,
	pulse : 0,
	up	  : true
};

var audio = {
	tracks        : [],
	tracks_current: 0,
	effects 	  : [],		//	Level up, threat destroy, game over, life lost
	mute		  : false
};

//	Constructing the tracks & effects arrays in the audio object from the html elements
function view_audio_initialise() {
	for (var i = 0; i < 4; i++) audio.tracks.push(document.getElementsByTagName('audio')[i]);
	for (var i = 4; i < 8; i++) audio.effects.push(document.getElementsByTagName('audio')[i]);
}


//	Plays an index from tracks array in the audio object, if no index specified, falls back to the last played
function view_audio_music_play(index) {
	if (index != null) audio.tracks_current = index;

	if (debug) if (debug) if (debug) if (debug) console.log('audio track ' + audio.tracks_current);

	audio.tracks[audio.tracks_current].play();
}


//	Pauses the current track
function view_audio_music_pause() {
	audio.tracks[audio.tracks_current].pause();
}


//	Plays a sound effect
function view_audio_effects_play(index) {
	audio.effects[index].play();
}


function view_audio_toggle_mute() {
	if (debug) if (debug) if (debug) if (debug) console.log('audio mute toggled');

	if (audio.mute) {
		audio.tracks[audio.tracks_current].volume = 1;
		audio.mute = false;
	} else {
		audio.tracks[audio.tracks_current].volume = 0;
		audio.mute = true;
	}
}







//	Drawing setup
function view_draw_initialise() {
	context.strokeStyle = view_get_shifted_rgba(level_data[level].style.gui.text, level_shift.gui.text);
	context.lineWidth = 5;
}


//	Canvas clearing & setting of background colour appropriate to the level
function view_draw_canvas() {
	if (level_data.length == 0) canvas.style.background = 'rgba(0, 0, 0, 1.0)';
	else						canvas.style.background = view_get_shifted_rgba(level_data[level].style.gui.background, level_shift.gui.background);

	context.beginPath();
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();
	context.closePath();
}


//	Drawing the centre target player thing
function view_draw_target() {
	if (audio.tracks[audio.tracks_current].currentTime == audio.tracks[audio.tracks_current].duration) view_audio_music_play(audio.tracks_current);

	//	Pulsing
	if (target.up) {
		if (target.pulse != 20)	target.pulse++;
		else 					target.up = false;
	} else {
		if (target.pulse != 0)	target.pulse--;
		else					target.up = true;
	}

	var size = level_data[level].style.target.size + Math.ceil(level_shift.target.size * level_shift.timer) + target.pulse;

	context.strokeStyle = view_get_shifted_rgba(level_data[level].style.target.ring_1, level_shift.target.ring_1);
	context.beginPath();
	context.arc(0, 0, size, target.ring_1 += Math.PI / 30, target.ring_1 + Math.PI);
	context.stroke();
	context.closePath();

	context.strokeStyle = view_get_shifted_rgba(level_data[level].style.target.ring_2, level_shift.target.ring_2);
	context.beginPath();

	//	Too small rings can cause invalid parameter issues
	if (size < 20)	context.arc(0, 0, size + 10, target.ring_2 -= Math.PI / 30, target.ring_2 + Math.PI);
	else			context.arc(0, 0, size - 10, target.ring_2 -= Math.PI / 30, target.ring_2 + Math.PI);

	context.stroke();
	context.closePath();
}


//	Incoming lines
function view_draw_threats(i) {
	context.strokeStyle = view_get_shifted_rgba(level_data[level].style.lines.threats, level_shift.lines.threats);

	//	Maximum distance from the center, for line length, pythagoras
	var trig = (((canvas.width / 2) ^ 2) + ((canvas.height / 2) ^ 2)) ^ .5;

	for (var i = 0; i < threats.length; i++) {
		context.beginPath();
		context.moveTo(Math.cos(threats[i].angle) * trig, 				 Math.sin(threats[i].angle) * trig);
		context.lineTo(Math.cos(threats[i].angle) * threats[i].distance, Math.sin(threats[i].angle) * threats[i].distance);
		context.stroke();
		context.closePath();
	}
}


//	Drawing the current line if mouse is down
function view_draw_defense_current(start_x, start_y, end_x, end_y) {
	context.moveTo(start_x, start_y);
	context.lineTo(end_x, end_y);
	context.stroke();
}


//	Lines the player draws
function view_draw_defenses() {
	context.strokeStyle = view_get_shifted_rgba(level_data[level].style.lines.defenses, level_shift.lines.defenses);

	for (var i = 0; i < defenses.length; i++) {
		context.beginPath();
		context.moveTo(defenses[i].start.x, defenses[i].start.y);
		context.lineTo(defenses[i].end.x, 	defenses[i].end.y);
		context.stroke();
		context.closePath();
	}
}


//	Works out the difference between the current & last level's colours & returns an object of that value / 30
function view_level_shift(duration) {
	//	Constructing an object of the difference between colours, four for four channels - RGBA
	for (var i = 0; i < 4; i++) {
		level_shift.target.size[i] 	  = (level_data[level - 1].style.target.size[i]    - level_data[level].style.target.size[i])	/ duration;
		level_shift.target.ring_1[i]  = (level_data[level - 1].style.target.ring_1[i]  - level_data[level].style.target.ring_1[i])	/ duration;
		level_shift.target.ring_2[i]  = (level_data[level - 1].style.target.ring_2[i]  - level_data[level].style.target.ring_2[i])	/ duration;
		level_shift.lines.defenses[i] = (level_data[level - 1].style.lines.defenses[i] - level_data[level].style.lines.defenses[i])	/ duration;
		level_shift.lines.threats[i]  = (level_data[level - 1].style.lines.threats[i]  - level_data[level].style.lines.threats[i])	/ duration;
		level_shift.gui.background[i] = (level_data[level - 1].style.gui.background[i] - level_data[level].style.gui.background[i])	/ duration;
		level_shift.gui.text[i]	   	  = (level_data[level - 1].style.gui.text[i] 	   - level_data[level].style.gui.text[i])	 	/ duration;
	}

	level_shift.timer = duration;

	if (debug) {
		if (debug) if (debug) if (debug) console.log('level shift calculation: current/previous/shift: ');
		if (debug) if (debug) if (debug) console.log(level_data[level].style);
		if (debug) if (debug) if (debug) console.log(level_data[level - 1].style);
		if (debug) if (debug) if (debug) console.log(level_shift);
	}
}


//	Converts the level data colour value arrays into an RGBA string for context colour setting
function view_get_shifted_rgba(data_component, shift_component) {
	return 'rgba(' + Math.ceil(data_component[0] + (shift_component[0] * level_shift.timer))
	 	 + ', ' + Math.ceil(data_component[1] + (shift_component[1] * level_shift.timer))
		 + ', ' + Math.ceil(data_component[2] + (shift_component[2] * level_shift.timer))
		 + ', ' + Math.ceil(data_component[3] + (shift_component[3] * level_shift.timer))
		 + ')';
}














//	GUI pulsing & title shifting
var gui = {
	pulse  : 255,
	up	   : true,
	shift_1: -500,
	shift_2: 500
};


function view_draw_gui_start() {
	view_draw_gui_header('TARGET', true);

	//	Selected item pulsing
	(gui.up) ? ((gui.pulse != 255) ? gui.pulse += 15 : gui.up = false) : ((gui.pulse != 000) ? gui.pulse -= 15 : gui.up = true);

	context.fillStyle = 'rgba(' + gui.pulse +', 000, 000, 1.0)';
	context.fillText('CLICK TO START', 0, 100);
}


//	The menu, sets the mouse listening appropriately
function view_draw_gui_menu(selection) {
	if (selection == null) selection = 1;

	view_draw_gui_header('TARGET', true);

	//	Selected item pulsing set by selection if statements
	(gui.up) ? ((gui.pulse != 255) ? gui.pulse += 15 : gui.up = false) : ((gui.pulse != 000) ? gui.pulse -= 15 : gui.up = true);

	if (selection == 0)	context.fillStyle = 'rgba(' + gui.pulse + ', 000, 000, .75)';

	context.textAlign = 'left';
	context.font = '25px wipeout';
	context.fillText('ACHIEVEMENTS', -400, 100);

	if (selection == 0) context.fillStyle = 'rgba(255, 255, 255, 1.0)';
	if (selection == 1) context.fillStyle = 'rgba(' + gui.pulse + ', 000, 000, .75)';

	context.textAlign = 'center';
	context.font = '25px wipeout';
	context.fillText('START', 0, 100);

	if (selection == 1) context.fillStyle = 'rgba(255, 255, 255, 1.0)';
	if (selection == 2) context.fillStyle = 'rgba(' + gui.pulse + ', 000, 000, .75)';

	context.textAlign = 'right';
	context.font = '25px wipeout';
	context.fillText('HIGH SCORES', 400, 100);

	view_draw_gui_footer('H: HELP', 'ESC: MENU','M: MUTE MUSIC', 'ENTER: SELECT');
}


//	Draws the screen displaying achievements
function view_draw_gui_achievements(achievements) {
	view_draw_gui_header('ACHIEVEMENTS', false);

	context.textBaseline = 'top';

	context.textAlign = 'left';
	for (var i = 0, j = (-canvas.height * .5) + (canvas.height * .1); i < achievements.length; i++, j += 30) context.fillText(achievements[i].description, -canvas.width * .35, j);

	context.textAlign = 'right';
	for (var i = 0, j = (-canvas.height * .5) + (canvas.height * .1); i < achievements.length; i++, j += 30) context.fillText(achievements[i].data, canvas.width * .35, j);

	view_draw_gui_footer('', 'ESC: MENU', '', 'D: RESET ACHIEVEMENTS');
}


//	Draws the screen displaying high scores
function view_draw_gui_high_scores(high_scores) {
	view_draw_gui_header('HIGH SCORES', false);

	context.textBaseline = 'top';

	if (high_scores.scores != null) {
		for (var i = 0, j = (-canvas.height * .5) + (canvas.height * .1); i < high_scores.scores.length; i++, j += 30) {
			context.textAlign = 'left';
			context.fillText(high_scores.scores[i].score, -canvas.width * .35, j);
			context.textAlign = 'right';
			context.fillText(high_scores.scores[i].date, canvas.width * .35, j);
		}
	} else {
		context.fillText('NO HIGH SCORES', 0, 0);
	}

	view_draw_gui_footer('', 'ESC: MENU', '', 'D: RESET HIGH SCORES');
}


//	Draws the game over screen
function view_draw_gui_game_over(level, score, high_score) {
	view_draw_gui_header('GAME OVER', true);

	(gui.up) ? ((gui.pulse != 255) ? gui.pulse += 15 : gui.up = false) : ((gui.pulse != 000) ? gui.pulse -= 15 : gui.up = true);

	if (high_score) context.fillText('HIGH SCORE! ' + score, 0, 50);
	else			context.fillText(score, 0, 50);

	context.fillStyle = 'rgba(' + gui.pulse + ', 000, 000, .75)';
	context.fillText('RETURN TO MENU', 0, 100);
}


//	Draws the help screen
function view_draw_gui_help() {
	view_draw_gui_header('HELP', true);

	context.textAlign = 'center';

	context.fillText('THE OBJECTIVE OF THE GAME IS TO PREVENT', 0, 50);
	context.fillText('LINES FROM REACHING THE CENTRE "TARGET"', 0, 80);
	context.fillText(' BY CLICKING  AND DRAGGING WITH THE MOUSE', 0, 110);
	context.fillText('TO DRAW YOUR OWN INES TO BLOCK THEM ', 0, 140);

	view_draw_gui_footer('', 'ESC: MENU', '', '');
}



//	Draws information at the bottom of the screen and level up text
function view_draw_hud(level, lives, score) {
	view_draw_footer('LEVEL: ' + level, 'LIVES: ' + lives, 'DEFENSES: ' + defenses.length + '/' + (Math.floor(level * 1.5) + 3), 'SCORE: ' + score);

	if ((level > 1) && (level_shift.timer > 0)){
		level_shift.timer--;

		context.fillStyle = view_get_shifted_rgba(level_data[level].style.gui.text, level_shift.gui.text);
		context.textAlign = 'center';
		context.textBaseline = 'bottom';

		context.fillText('LEVEL UP!', 0, (canvas.height * .5) - 40);
	}
}


//	Draws the level up screen
function view_draw_gui_pause() {
	view_draw_gui_title('PAUSE', true);

	(gui.up) ? ((gui.pulse != 255) ? gui.pulse += 15 : gui.up = false) : ((gui.pulse != 000) ? gui.pulse -= 15 : gui.up = true);
	context.fillStyle = 'rgba(' + gui.pulse + ', 000, 000, .75)';

	context.fillText('CONTINUE', 0, 100);

	view_draw_gui_footer('', 'ESC: MENU', '', 'ENTER: SELECT');
}







// draws the header of a gui screen - moving background text of title, title_display is whether the title is boldly displayed or not
function view_draw_title(title, title_display) {
	if (++gui.shift_1 > +canvas.width * .8) gui.shift_1 = -canvas.width;
	if (--gui.shift_2 < -canvas.width * .8) gui.shift_2 = canvas.width;

	view_draw_canvas();

	context.fillStyle = 'rgba(000, 000, 000, 1.0)';
	context.fillRect(-canvas.width * .5, -canvas.height * .4, canvas.width, canvas.height * .8);

	context.fillStyle = 'rgba(255, 255, 255, .75)';
	context.textAlign = 'center';
	context.textBaseline = 'center';
	context.font = '150px wipeout';
	if (title_display) context.fillText(title, 0, 0);

	context.fillStyle = 'rgba(255, 255, 255, 0.25)';
	context.fillText(title, gui.shift_1, 50);
	context.fillText(title, gui.shift_2, -50);

	context.fillStyle = 'rgba(255, 255, 255, .75)';
	context.font = '25px wipeout';
}


// draws the footer of the screen displaying the strings passed
function view_draw_footer(one, two, three, four) {
	context.textAlign = 'center';
	context.textBaseline = 'bottom';
	context.font = '25px wipeout';

	context.fillStyle = 'rgba(000, 000, 000, 1.0)';
	context.fillRect(-canvas.width * .5, canvas.height * .45, canvas.width, canvas.height * .1);
	context.fillStyle = 'rgba(255, 255, 255, 0.75)';

	context.textAlign = 'right';
	context.fillText(one, -canvas.width * .25, canvas.height * .5);
	context.fillText(two, -canvas.width / 16, canvas.height * .5);

	context.textAlign = 'left';
	context.fillText(three, canvas.width * .25, canvas.height * .5);
	context.fillText(four, canvas.width / 16, canvas.height * .5);
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
		context.font = '25px wipeout';
		context.fillText(options[1], 0, 100);

		if (menu_options.selected == 1) context.fillStyle = 'rgba(255, 255, 255, 1.0)';
		if (menu_options.selected == 2) context.fillStyle = 'rgba(' + gui.pulse + ', 0, 0, .75)';

		context.textAlign = 'right';
		context.font = '25px wipeout';
		context.fillText(options[2], 400, 100);
	}
}



























/*
 * draws a menu gui, uses menu object for option name & controls hints
 * @param 	title				string for the page title
 * @param 	menu_options		object describing menu options	{selected : index, options : [{title : string, functionality: function}]}
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

	view_draw_title(title, true);
	view_draw_options(menu_options);
	view_draw_footer(control_hints[0], control_hints[1], control_hints[2], control_hints[3]);
}
