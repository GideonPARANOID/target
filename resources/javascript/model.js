var lives;
var score;
var level;
var player;

var loop_handle, level_threat_handle;


//	Setting up the model, used for replaying the game too
function model_initialise() {
	if (debug) if (debug) console.log('game start');

	lives = 5;
	score = 0;
	level = 1;
	player = 'Gideon';

	game = true;

	model_levels_initialise();
	control_game_initialise();
	view_draw_initialise();
	view_audio_initialise();
	//achievements_initialise(level, player);

	view_audio_music_play(Math.ceil(Math.random() * 3));

	//	Clearing just in case
	threats.clear();
	defenses.clear();
	clearInterval(loop_handle);
	clearInterval(level_threat_handle);

	loop_handle = setInterval(model_loop, 30);
	level_threat_handle = setInterval(model_threat_add, 3000);
}



//	The main game loop
function model_loop() {
	if (game) {
		//	Clearing & redrawing
		view_draw_canvas();
		model_collision_detection();
		control_game_defense_current();
		view_draw_defenses();
		view_draw_threats();
		view_draw_target();
		view_draw_gui_hud(level, lives, score);

		//	Score iteration (relative to level) & level up comparison
		if ((score++) == level_data[level].score) model_level_up();
	}
}


//	Adding a new incoming line
function model_threat_add() {
	if (game) {
		threats.push({
			speed	 : Math.ceil(level * 2 * Math.random()),
			distance : (((canvas.width * .5) ^ 2) + ((canvas.height * .5) ^ 2)) ^ .5,
			angle	 : Math.PI * 2* Math.random()
		});
	}
}


//	Adding a defending line (drawn by the user)
function model_defense_add() {
	defenses.push({
		start : {
			x : mouse.start.x,
			y : mouse.start.y
		},
		end : {
			x : mouse.end.x,
			y : mouse.end.y
		}
	});

	//	Limiting the amount of lines drawn by the player
	if (defenses.length > (Math.floor(level * 1.5) + 3)) defenses.shift();
}


//	Collision detection, returns an object containing indices of colliding threats & defenses
function model_collision_detection() {
	for (var i = 0; i < threats.length; i++) {
		//	Target collision detection
		if ((threats[i].distance -= threats[i].speed) < level_data[level].style.target.size) {

			threats.splice(i, 1);
			model_life_lost();
			context.restore();
			if (debug) if (debug) console.log('collision target');
		}

		//	Defense collision detection
		for (var j = 0; j < defenses.length; j++) {
			if (line_intersect(Math.cos(threats[i].angle) * threats[i].distance,
							   Math.sin(threats[i].angle) * threats[i].distance,
							   Math.cos(threats[i].angle) * (threats[i].distance - threats[i].speed),
							   Math.sin(threats[i].angle) * (threats[i].distance - threats[i].speed),
							   defenses[j].start.x,
							   defenses[j].start.y,
							   defenses[j].end.x,
							   defenses[j].end.y)) {

				threats.splice(i, 1);
				defenses.splice(j, 1);

				view_audio_effects_play(1);

				if (debug) if (debug) console.log('collision defense');
			}
		}
	}
}


//	Levelling up, manages achievements associated with it, as well as sound effects & drawing
function model_level_up() {
	//	As the API requests' content changes rarely, shuffles to maintain randomness of level colours
	level++;

	view_audio_effects_play(0);

	view_level_shift(30);

	//achievements_check(level, lives, score);

	//	Increasing the rate of threat adding
	clearInterval(level_threat_handle);
	level_threat_handle = setInterval(model_threat_add, 3000 - (level * 200));

	if (debug) if (debug) console.log('game level up, next level score ' + level_data[level].score);
}


//	Losing a life, sound effects & acheievement defaulting
function model_life_lost() {
	if (debug) if (debug) console.log('game life lost');

	view_audio_effects_play(3);

	//achievements_default('SURVIVOR', level);

	if(--lives <= 0) model_finalise();
}


//	Game over refreshing
function model_finalise() {
	if (debug) if (debug) console.log('game over');

	game = false;

	clearInterval(loop_handle);
	clearInterval(level_threat_handle);

	//achievements_unlock('HIGH SCORES', score);

	control_gui_game_over(level, score);
}







//	Creating levels from JSON using colourlovers' API for styles
function model_levels_initialise() {
	var url;
	
	if (local) 	url = 'resources/data.json';
	else 		url = 'http://www.colourlovers.com/api/palettes?format=json&numResults=100&jsonCallback=?';

	$.getJSON(url, function(data) {
		for (var i = 0; i < 50; i++) { 	// maximum of fifty levels

			// skips current if not enough colours in the palette
			if (data.colors.length < 5) {
				i--;
				continue;
			}

			level_data[i] = {
				complete : (i * 500),	// points needed to complete the level
				speed    : (i * .5),	// maximum speed of threats

				style : {
					target : {
						size   : size,
						ring_1 : hex_to_array(data[i].colors[0], 1),
						ring_2 : hex_to_array(data[i].colors[1], 1),
					},
					lines : {
						defenses : hex_to_array(data[i].colors[2], 1),
						threats	 : hex_to_array(data[i].colors[3], 1),
					},
					gui : {
						background : hex_to_array(data[i].colors[4], 1),
						text	   : hex_to_array(data[i].colors[2], 1),
					}
				}
			};

		}

	});
}









