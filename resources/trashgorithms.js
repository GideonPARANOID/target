
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
