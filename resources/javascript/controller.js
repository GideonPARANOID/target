/*
 * @author	gideon mw jones (@gideonparanoid)
 * @version	who knows
 */

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


/*
 * sets mouse object end coordinates
 */
function control_mouse_position_update(e) {
	mouse.end.x = (e.pageX - canvas.offsetLeft < 0) ? canvas.width / 2 - (e.pageX - canvas.offsetLeft) : (e.pageX - canvas.offsetLeft) - canvas.width / 2;
	mouse.end.y = (e.pageY - canvas.offsetTop < 0)	 ? canvas.height / 2 - (e.pageY - canvas.offsetTop) : (e.pageY - canvas.offsetTop) - canvas.height / 2;
}


/*
 * for getting the start of the line drawn by a player & maintaining the end point at mouse for temp line drawing (mouse !up)
 */
function control_game_mouse_down(e) {
	if (e.which == 1) {
		control_mouse_position_update(e);
		mouse.start.x = mouse.end.x;
		mouse.start.y = mouse.end.y;
		mouse.down = true;
	}
}


/*
 * drawing the line the user is currently drawing - if the mouse is still down
 */
function control_game_defense_current() {
	if (mouse.down) view_draw_defense_current(mouse.start.x, mouse.start.y, mouse.end.x, mouse.end.y);
}


/*
 * adds another set of coordinates to the array of lines
 */
function control_game_mouse_up(e) {
	if (e.which == 1) {
		model_defense_add(mouse.start.x, mouse.start.y, mouse.end.x, mouse.end.y);
		mouse.down = false;
	}
}










/*
 * setting the game's controls
 */
function control_game_set() {
	clearInterval(control_menu_handle);
	Mousetrap.reset();
	
	Mousetrap.bind('esc', control_game_pause);
	Mousetrap.bind('p', control_game_pause);
	
	canvas.onmousemove = control_mouse_position_update;
	canvas.onmousedown = control_game_mouse_down;
	canvas.onmouseup   = control_game_mouse_up;
}


/*
 * pausing the game
 */
function control_game_pause() {
	clearInterval(control_menu_handle);
	
	model_pause();
	
	control_menu('PAUSE', {
		selected : 0,
		options : [{
			title : 'UNPAUSE',
			functionality : function() {
				control_game_set();
				model_pause();
			}
		}, {
			title : 'MAIN MENU',
			functionality : function() {
				control_menu_main();
				model_finalise();
			}
		}]
	}, null, null);
}








function control_menu_achievements() {

}

function control_menu_high_scores() {

}


function control_menu_main() {
	control_menu('TARGET', {
		selected : 1,
		options : [{
			title : 'ACHIEVEMENTS',
			functionality : control_menu_achievements
		}, {
			title : 'PLAY',
			functionality : function() {
				model_initialise();
				control_game_set();
			}
		}, {
			title : 'HIGH SCORES',
			functionality : control_menu_high_scores
		}]},
		null,
		null);
}



var control_menu_handle;

/*
 * creates a menu screen based on the parameters, maximum of three menu options
 * resets controls and sets new ones, automatically does arrow keys & enter if menu items exist
 *
 * @param	title				the title of the menu
 * @param	menu_options			object describing menu options	{selected : index, options : [{title : string, functionality: function}]}
 * @param	keyboard_controls	object describing menu controls	[{key : string, description: string, functionality : function}]
 * @param	mouse_controls		object describing menu controls	{mousedown : function, mouseup : function, mousemove : function}
 */
function control_menu(title, menu_options, keyboard_controls, mouse_controls) {

	// resetting
	refresh_loop();
	Mousetrap.reset();

	// setting or nullifying mouse controls
	if (mouse_controls != null) {
		canvas.onmousedown = (mouse_controls.onmousedown == undefined)	? null : mouse_controls.mousedown;
		canvas.onmouseup	= 	(mouse_controls.onmouseup == undefined)	? null : mouse_controls.onmouseup;
		canvas.onmousemove = (mouse_controls.onmousemove == undefined)	? null : mouse_controls.onmousemove;
	}
	// setting keyboard controls
	if (keyboard_controls != null) {
		for (var i = 0; i < keyboard_controls.length; i++) {
			Mousetrap.bind(keyboard_controls[i].key, keyboard_controls[i].functionality);
		}
	}

	// automatically setting menu keyboard controls if there are menu options
	if (menu_options != null) {
		// only sets left/right navigation is there is more than one option
		if (menu_options.options.length > 1) {
			Mousetrap.bind('left', function() {
				menu_options.selected = (menu_options.selected < 1) ? menu_options.options.length - 1 : menu_options.selected - 1;
				refresh_loop();
			});

			Mousetrap.bind('right', function() {
				menu_options.selected = (menu_options.selected > 1) ? 0 : menu_options.selected + 1;
				refresh_loop();
			});
		}

		Mousetrap.bind('enter', function() {			
			menu_options.options[menu_options.selected].functionality();
		});
		refresh_loop();
	}

	/*
	 * refreshes the menu loop, passing in any changed variables again
	 */
	function refresh_loop() {
		clearInterval(control_menu_handle);
		
		control_menu_handle = setInterval(function() {
			view_draw_gui(title, menu_options, keyboard_controls);
		}, 30);
	}
}