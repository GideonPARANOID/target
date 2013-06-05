/*
 * @author	gideon mw jones (@gideonparanoid)
 * @version	who knows
 */

var lives;
var score;
var player;	//	name from twitter sign in mayber or otherwise for server side leaderboards

var level_data = new Array();		// level data
var defenses = new Array();		// lines the player draws
var threats = new Array();		// incoming lines


/*
 * clearing & starting the model loop
 */
function model_initialise() {
	lives = 5;
	score = 0;
	level = 1;
	player = 'Gideon';

	view_draw_initialise();

	// clearing
	threats.clear();
	defenses.clear();
	clearInterval(model_loop.handle);
	
	model_loop.handle = setInterval(model_loop, 30);

	if (debug) console.log('game start');
}



var threat_timer = 1;

/*
 * main game loop
 */
function model_loop() {
	view_draw_game(level_data[level].style, level_data[level + 1].style, threats, defenses, level, lives, score);

	model_collision_detection();
	control_game_defense_current();

	// increasing the score & level up checking
	if (++score == level_data[level].points) model_level_up();
	
	// adding threats at an increasing rate
	if (--threat_timer == 0) {
		model_threat_add();

		threat_timer = 90 - (level * 5);
	}
}


/*
 * adds an incoming line
 */
function model_threat_add() {
	threats.push({
		speed : Math.ceil(level * 1.5 * Math.random()),
		distance : trig,
		angle : Math.PI * 2 * Math.random(),
		life : -1
	});

	console.log('threat added');
}


/*
 * adds
 */
function model_defense_add(x1, y1, x2, y2) {
	defenses.push({
		life : -1,
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

				threats[i].life = 30;
				defenses[j].life = 30;
				
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

	if (debug) console.log('game level up, next level score ' + level_data[level].score);
}


/*
 * decreases the lives, checks if the game is over or not
 */
function model_life_lost() {
	if (debug) console.log('game life lost');

	if(--lives <= 0) model_finalise();
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



/*
 * if the game is running, pauses the game, if the game isn't running, continues
 */
function model_pause() {
	if (model_loop.handle == null)	{
		model_loop.handle = setInterval(model_loop, 30);
		
		if (debug) console.log('game resume');
	} else {
		clearInterval(model_loop.handle);
		model_loop.handle = null;
		
		if (debug) console.log('game pause');
	}
}



/*
 * closes the game
 */
function model_finalise() {
	clearInterval(model_loop.handle);

	control_game_finalise(level, score);
	
	if (debug) console.log('game end');
}