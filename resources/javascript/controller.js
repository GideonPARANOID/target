var mouse = {
	start: {
		x: 0,
		y: 0
	},
	end: {
		x: 0,
		y: 0
	},
	down : false
};


//	Starting the game, keyboard & mouse control settings
function control_game_initialise() {
	control_game();

	/*
	Mousetrap.unbind('esc');
	Mousetrap.unbind('left');
	Mousetrap.unbind('right');
	Mousetrap.unbind('enter');
	Mousetrap.unbind('d');
	Mousetrap.unbind('h');

	canvas.onmousemove = control_mouse_position_update;
	canvas.onmousedown = control_game_mouse_down;
	canvas.onmouseup   = control_game_mouse_up;

	Mousetrap.bind('esc', control_game_pause);
	Mousetrap.bind('p', control_game_pause);
	Mousetrap.bind('enter', control_game_pause);
	*/
}


// sets mouse object end coordinates, looks more complex than it actually is because the centre of the canvas is the origin
function control_mouse_position_update(e) {
	mouse.end.x = (e.pageX - canvas.offsetLeft < 0)	? canvas.width / 2 - (e.pageX - canvas.offsetLeft) : (e.pageX - canvas.offsetLeft) - canvas.width / 2;
	mouse.end.y = (e.pageY - canvas.offsetTop < 0)	? canvas.height / 2 - (e.pageY - canvas.offsetTop) : (e.pageY - canvas.offsetTop) - canvas.height / 2;
}


//	For getting the start of the line drawn by a player & maintaining the end point at mouse for temp line drawing (mouse !up)
function control_game_mouse_down(e) {
	if (e.which == 1) {
		control_mouse_position_update(e);
		mouse.start.x = mouse.end.x;
		mouse.start.y = mouse.end.y;
		mouse.down = true;
	}
}


//	Drawing the line the user is currently drawing - if the mouse is still down
function control_game_defense_current() {
	if (mouse.down) view_draw_defense_current(mouse.start.x, mouse.start.y, mouse.end.x, mouse.end.y);
}


//	Adds another set of coordinates to the array of lines
function control_game_mouse_up(e) {
	if (e.which == 1) {
		model_defense_add();
		mouse.down = false;
	}
}








//	Setting controls & drawing for pages such as high scores, help & achievements
function control_gui_page(page) {
	var page_handle = setInterval(function() {
		if 		(page == 'HIGH SCORES')  view_draw_gui_high_scores(achievements_high_scores_get());
		else if (page == 'ACHIEVEMENTS') view_draw_gui_achievements(achievements_get());
		else if (page == 'HELP')		 view_draw_gui_help();
	}, 30);

	Mousetrap.bind('d', function() {
		if (page == 'HIGH SCORES')  achievements_high_scores_clear();
		if (page == 'ACHIEVEMENTS') achievements_clear();
	});

	Mousetrap.unbind('h');
	Mousetrap.unbind('left');
	Mousetrap.unbind('right');
	Mousetrap.unbind('enter');
	Mousetrap.bind('esc', function() {
		clearInterval(page_handle);
		control_gui_menu_main();
	});

	canvas.onmousedown = function(e) {
		Mousetrap.trigger('esc');
	}
}



//	Game over screen drawing, achievement checking & control setting
function control_gui_game_over(level, score) {
	var game_over_handle = setInterval(function() {
		view_draw_gui_game_over(level, score, achievements_high_scores_check(score));
	}, 30);

	view_audio_music_pause();
	view_audio_effects_play(2);

	Mousetrap.unbind('left');
	Mousetrap.unbind('right');
	Mousetrap.unbind('esc');
	Mousetrap.unbind('p');
	Mousetrap.bind('enter', function() {
		clearInterval(game_over_handle);
		control_gui_menu_main();
	});

	canvas.onmousedown = function() {
		clearInterval(game_over_handle);
		canvas.onmousedown = null;
		control_gui_menu_main();
	};
}









//	Game pausing & control setting
function control_game_pause(e) {
	if (game) {
		game = false;

		control_menu('PAUSE', [{
			key: 'esc',
			description: 'RETURN TO MENU',
			functionality: function() {
				clearInterval(control_menu_handle);
				control_gui_menu_main();
			}
		}, {
			key: 'p',
			description: 'UNPAUSE',
			functionality: function() {
				game = true;
				clearInterval(control_menu_handle);
			}
		}], null);

	} else {
		clearInterval(control_menu_handle);
		game = true;
	}
}



// control setting for the game
function control_game() {
	clearInterval(control_menu_handle);

	Mousetrap.reset();
	Mousetrap.bind('p', control_game_pause);
	Mousetrap.bind('esc', control_game_pause);
	Mousetrap.bind('m', view_audio_toggle_mute);

	canvas.onmousemove = control_mouse_position_update;
	canvas.onmousedown = control_game_mouse_down;
	canvas.onmouseup   = control_game_mouse_up;
}







function control_menu_main() {


	console.log('menu');
}









var control_menu_handle;

/*
 * draws a menu screen based on the parameters, maximum of three menu options
 * resets controls and sets new ones, automatically does arrow keys & enter for menus
 * rather flexible
 *
 * @param	title				the title of the menu
 * @param	menu_options		object describing menu options	{selected : index, options : [{title : string, functionality: function}]}
 * @param	keyboard_controls	object describing menu controls	[{key : string, description: string, functionality : function}]
 * @param	mouse_controls		object describing menu controls	{mousedown : function, mouseup : function, mousemove : function}
 */
function control_menu(title, menu_options, keyboard_controls, mouse_controls) {

	// resetting
	clearInterval(control_menu_handle);
	Mousetrap.reset();

	// setting or nullifying mouse controls
	if (mouse_controls != null) {
		canvas.onmousedown =	(mouse_controls.onmousedown != undefined) 	? mouse_controls.mousedown : null;
		canvas.onmouseup = 		(mouse_controls.onmouseup != undefined) 	? mouse_controls.onmouseup : null;
		canvas.onmousemove =	(mouse_controls.onmousemove != undefined) 	? mouse_controls.onmousemove : null;
	}
	// control setting
	if (keyboard_controls != null) {
		for (var i = 0; i < keyboard_controls.length; i++) {
			Mousetrap.bind(keyboard_controls[i].key, keyboard_controls[i].functionality);
		}
	}

	// automatically setting menu keyboard controls if there are menu options
	if (menu_options != null) {
		Mousetrap.bind('left', function() {
			menu_options.selected = (menu_options.selected < 1) ? menu_options.options.length - 1 : menu_options.selected - 1;
		});

		Mousetrap.bind('right', function() {
			menu_options.selected = (menu_options.selected < 1) ? 0 : menu_options.selected + 1;
		});

		Mousetrap.bind('enter', menu_options.options[menu_options.selected].functionality);
	}



	// draw loop setting
	control_menu_handle = setInterval(function() {
		view_draw_gui(title, menu_options, keyboard_controls);
	}, 30);
}
