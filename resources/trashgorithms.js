
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






//	The start screen & control setting
function control_gui_initialise() {
	var start_handle = setInterval(view_draw_gui_start, 30);

	Mousetrap.reset();

	Mousetrap.bind('m', view_audio_toggle_mute);

	canvas.onmousedown = function(e) {
		canvas.onmousedown = null;
		clearInterval(start_handle);
		control_gui_menu_main();
	};
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
