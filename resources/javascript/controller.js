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
}


//	General mouse position updating, coordinates can be accessed through the mouse object
function control_mouse_position_update(e) {				
	if (e.pageX - canvas.offsetLeft < 0) mouse.end.x = canvas.width / 2 - (e.pageX - canvas.offsetLeft);		
	else								 mouse.end.x = (e.pageX - canvas.offsetLeft) - canvas.width / 2;
	
	if (e.pageY - canvas.offsetTop < 0)	mouse.end.y = canvas.height / 2 - (e.pageY - canvas.offsetTop);
	else								mouse.end.y = (e.pageY - canvas.offsetTop) - canvas.height / 2;
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


var pause_handle;

//	Game pausing & control setting
function control_game_pause(e) {
	if (game) {
		game = false;
		pause_handle = setInterval(view_draw_gui_pause, 30);
		view_audio_music_pause();
		Mousetrap.bind('esc', function(){
			clearInterval(pause_handle);
			control_gui_menu_main();
		});
		Mousetrap.bind('p', function() {
			clearInterval(pause_handle);
			game = true;
			view_audio_music_play();
			Mousetrap.bind('esc', control_game_pause);
			Mousetrap.bind('p', control_game_pause);
		});
	} else {
		clearInterval(pause_handle);
		game = true;
		view_audio_music_play();
		Mousetrap.bind('esc', control_game_pause);
		Mousetrap.bind('p', control_game_pause);
	}	
}





//	The start screen & control setting
function control_gui_initialise() {
	var start_handle = setInterval(view_draw_gui_start, 30);

	Mousetrap.unbind('left');
	Mousetrap.unbind('right');
	Mousetrap.unbind('enter');
	
	Mousetrap.bind('m', view_audio_toggle_mute);
	
	canvas.onmousedown = function(e) {
		canvas.onmousedown = null;
		clearInterval(start_handle);
		control_gui_menu_main(); 
	};
}



//	Control for the main menu
function control_gui_menu_main() {
	var menu_selection = 1; 
	var menu_handle = setInterval(view_draw_gui_menu, 30);

	canvas.onmousemove = function(e) {
		if (!game) {
			control_mouse_position_update(e);
	
			if (mouse.end.x < -canvas.width / 6) {
				menu_selection = 0;
			
				clearInterval(menu_handle);
				menu_handle = setInterval(function() {
					view_draw_gui_menu(menu_selection); 
				}, 30);
		
			} else if ((mouse.end.x < canvas.width / 6) && (mouse.end.x > -canvas.width / 6)) {
				menu_selection = 1;
			
				clearInterval(menu_handle);
				menu_handle = setInterval(function() {
					view_draw_gui_menu(menu_selection); 
				}, 30);
			
			} else if (mouse.end.x > canvas.width / 6) {
				menu_selection = 2;
			
				clearInterval(menu_handle);
				menu_handle = setInterval(function() {
					view_draw_gui_menu(menu_selection); 
				}, 30);
			}
		}
	};
	
	//	Click to start
	canvas.onmousedown = function(e) {
		Mousetrap.trigger('enter');
	};
	
	Mousetrap.unbind('esc');

	//	Keyboard controls for menu, uses anonymous functions to pass param of which one is selected
	Mousetrap.bind('left', function(e) { 
		if (!game) {
			(menu_selection < 1) ? menu_selection = 2 : --menu_selection;
	
			clearInterval(menu_handle);
			menu_handle = setInterval(function() {
				view_draw_gui_menu(menu_selection); 
			}, 30);
		}
	});

	Mousetrap.bind('right', function(e) { 
		if (!game) {
			(menu_selection > 1) ? menu_selection = 0 : ++menu_selection;
	
			clearInterval(menu_handle);
			menu_handle = setInterval(function() {
				view_draw_gui_menu(menu_selection);
			}, 30);
		}
	});

	Mousetrap.bind('enter', function(e) {
		if (!game) {
			clearInterval(menu_handle);
			canvas.onmousemove = null;
			canvas.onmousedown = null;
		
			if 		(menu_selection == 0) control_gui_page('ACHIEVEMENTS');
			else if (menu_selection == 1) model_initialise();
			else if (menu_selection == 2) control_gui_page('HIGH SCORES');
		} 
	});
	
	Mousetrap.bind('h', function() {

		if(!game) {
			control_gui_page('HELP');
	 		canvas.onmousemove = null;
			canvas.onmousedown = null;
		
			clearInterval(menu_handle);
		}
	});
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
