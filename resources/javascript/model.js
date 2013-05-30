/*
 * @author	gideon mw jones (@gideonparanoid)
 * @version	who knows
 */

var lives;
var score;
var player;

var game_handle, level_threat_handle;


var level_data = new Array();		//	Level data
var defenses = new Array();		//	Lines the player draws
var threats = new Array();		//	Incoming lines


//	Setting up the model, used for replaying the game too
function model_initialise() {
	if (debug) console.log('game start');

	lives = 5;
	score = 0;
	level = 1;
	player = 'Gideon';

	game = true;

	// clearing
	threats.clear();
	defenses.clear();
	clearInterval(game_handle);
	clearInterval(level_threat_handle);

	game_handle = setInterval(model_loop, 30);
	level_threat_handle = setInterval(model_threat_add, 3000);
}



/*
 * main game loop
 */
function model_loop() {
	if (game) {
		view_draw_game(level_data[level].style, level_data[level + 1].style, threats, defenses, level, lives, score);
		
		model_collision_detection();
		control_game_defense_current();

		//	Score iteration (relative to level) & level up comparison
		if ((score++) == ((level) * 500)) model_level_up();
	}
}


/*
 * adds an incoming line
 */
function model_threat_add() {
	if (game) {
		threats.push({
			speed	 : Math.ceil(level * 2 * Math.random()),
			distance : (((canvas.width * .5) ^ 2) + ((canvas.height * .5) ^ 2)) ^ .5,
			angle	 : Math.PI * 2* Math.random()
		});
	}
}


/*
 * adds
 */
function model_defense_add(x1, y1, x2, y2) {
	defenses.push({
		start : {
			x : x1,
			y : y1
		},
		end : {
			x : x2,
			y : y2
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

			if (debug) console.log('collision target');
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


				if (debug) console.log('collision defense');
			}
		}
	}
}


/*
 * increases the level & increases the difficulty via the rate of incoming lines
 */
function model_level_up() {
	level++;

	// increasing the rate of threat adding
	clearInterval(level_threat_handle);
	level_threat_handle = setInterval(model_threat_add, 3000 - (level * 200));

	if (debug) console.log('game level up, next level score ' + level_data[level].score);
}


/*
 * decreases the lives, checks if the game is over or not
 */
function model_life_lost() {
	if (debug) console.log('game life lost');

	if(--lives <= 0) model_finalise();
}


//	Game over refreshing
function model_finalise() {
	if (debug) console.log('game over');

	game = false;

	clearInterval(game_handle);
	clearInterval(level_threat_handle);

	//achievements_unlock('HIGH SCORES', score);

	control_gui_game_over(level, score);
}







/*
 * creates levels using colourlovers.com (via ajax) for the colours
 * moderated to prevent levels with too similar colours
 */
function model_levels_initialise() {

	$.ajax({
		url : 'http://www.colourlovers.com/api/palettes?format=json&numResults=100&jsonCallback=?',
		dataType : 'jsonp',
		crossDomain : true,
		beforeSend : function() {
			if (debug) console.log('api request sent');
		},
		success : function(data) {

			// creates at most fifty levels, must have five colours
			for (var i = 0; level_data.length < 50; i++) {
				if (data[i].colors.length >= 5) {
					level_data.push({
						// game logic, not filled in until shuffled & moderated
						points : 0,
						speed : 0,
						style : {
							target : {
								size : 20,
								ring_1 : hex_to_hsla_array(data[i].colors[0]),
								ring_2 : hex_to_hsla_array(data[i].colors[1])
							},
							lines : {
								defenses : hex_to_hsla_array(data[i].colors[2]),
								threats : hex_to_hsla_array(data[i].colors[3])
							},
							gui : {
								background : hex_to_hsla_array(data[i].colors[4]),
								text	 : hex_to_hsla_array(data[i].colors[2])
							}
						}
					});
				}
			}
		}
	}).done(function() {
		level_data.shuffle();
		
		if (debug) console.log('levels loaded, pre moderation quantity ' + level_data.length);
		
		// moderation using euclidean distance
		for (var i = 0; i < level_data.length; i++) {
			var background = level_data[i].style.gui.background;
			var threats = level_data[i].style.lines.threats;
			var defenses = level_data[i].style.lines.defenses;

			if ((((background[0] - threats[0]) ^ 2 + (background[1] - threats[1]) ^ 2 + (background[2] - threats[2]) ^ 2) ^ .5 < 10) ||
				(((background[0] - defenses[0]) ^ 2 + (background[1] - defenses[1]) ^ 2 + (background[2] - defenses[2]) ^ 2) ^ .5 < 10)) {
				level_data.splice(i, 1);
			}
		}
		
		if (debug) console.log('levels loaded, post moderation quantity ' + level_data.length);
			
		// adding game logic data
		for (var i = 0; i < level_data.length; i++) {
			level_data[i].points = i * 500;
			level_data[i].speed = i * .5;			
		}		
	});

}


function model_pause() {




}









