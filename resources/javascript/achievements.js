/*
 * @author	gideon mw jones (@gideonparanoid)
 * @version	who knows
 */


//	Achievements saved in an associative array - key/value pairs
//	Key 	: string - name of achievement 
//	Value	: object
//	
//	Surviving a level without losing a life
//	Surviving two levels without loing a life
//	Surviving three levels without losing a life
//	Reaching level three
//	Reaching level six
//	Reaching level nine
	
var survivor_lives;	//	Initial lives for survivor achievement
var survivor_count;

//	A list of achievements possible, used for checking.
var achievements_library = ['SURVIVOR BRONZE',
							'SURVIVOR SILVER',
							'SURVIVOR GOLD',
							'SURVIVOR PLATINUM',
							'SURVIVOR ZEN',
							'COMPLETIONIST BRONZE',
							'COMPLETIONIST SILVER',
							'COMPLETIONIST GOLD',
							'COMPLETIONIST PLATINUM',
							'COMPLETIONIST ZEN'];



//	Initialisation for achievements, if no previous high score, creates new object for them in localStorage
function achievements_initialise(level, player) {
	if (debug) if (debug) console.log('achievements initialise');

	survivor_lives = lives;	
	survivor_count = 0;
	
	if (localStorage.getItem('HIGH SCORES') == null) {
		if (debug) if (debug) console.log('achievements no high score');
	
		localStorage.setItem('HIGH SCORES', JSON.stringify({
			player: 'testing, this could be you!',
			scores: []
		}));	
	}
}



//	If achievement is set, returns true, if not, sets a new achievement and returns false
function achievements_unlock(achievement_name, data) {
	if (achievement_name == 'HIGH SCORES') {
		var high_scores = JSON.parse(localStorage.getItem(achievement_name));	
		high_scores.scores.push({ 
			score: data,
			date : get_date()
		});
		
		if (debug) if (debug) console.log('achievements new high score added');
				
		localStorage.setItem(achievement_name, JSON.stringify(high_scores));
		
	} else if ((achievement_name == 'SURVIVOR') || (achievement_name == 'COMPLETIONIST')) {	
		
		switch (data) {
			case 15: localStorage.setItem(achievement_name + ' ZEN', get_date());
			case 12: localStorage.setItem(achievement_name + ' PLATINUM', get_date());
			case 09: localStorage.setItem(achievement_name + ' GOLD', get_date());
			case 06: localStorage.setItem(achievement_name + ' SILVER', get_date());
			case 03: localStorage.setItem(achievement_name + ' BRONZE', get_date());
		}
	} 
	return false;
}


//	Checks if should award an achievement
function achievements_check(level, lives, score) {
	if (lives == survivor_lives) 		 			 survivor_count++;
	if ([3, 6, 9, 12].indexOf(survivor_count) != -1) achievements_unlock('SURVIVOR', survivor_count);
	if ([3, 5, 9, 12].indexOf(level) != -1)			 achievements_unlock('COMPLETIONIST', level);
}


//	Defaults the survivor achievement if a user loses a life
function achievements_default(achievement, data) {
	if (achievement == 'SURVIVOR') {
		survivor_count = 0;
		survivor_lives = data;
	}
} 


//	Removes all of my achievements from localStorage
//	There are nicer functions, not using the library, but clears localStorage for all of users.aber.ac.uk
function achievements_clear() {
	for (var i = 0; i < achievements_library.length; i++) localStorage.removeItem(achievements_library[i]);

	if (debug) if (debug) console.log('achievements cleared');
}


//	Clears high scores
function achievements_high_scores_clear() {
	var high_scores = JSON.parse(localStorage.getItem('HIGH SCORES'));
	
	if (high_scores != null) {
		high_scores.scores.clear();	
		localStorage.setItem('HIGH SCORES', JSON.stringify(high_scores));
		
		if (debug) if (debug) console.log('achievements high scores cleared');
	}
}
	

//	Returns an array of achievements
function achievements_get() {
	var achievements = new Array();

	for (var i = 0; i < achievements_library.length; i++) {	
		if (localStorage.getItem(achievements_library[i]) != null) {
			achievements.push({
				description: achievements_library[i],
				data	   : localStorage.getItem(achievements_library[i])
			});
		}
	}
	
	achievements.sort();
	
	return achievements;
}


//	Returns an object of the high scores parsed from localStorage
function achievements_high_scores_get() {	
	if (localStorage.getItem('HIGH SCORES') != null) {
		var high_scores = JSON.parse(localStorage.getItem('HIGH SCORES'));	
		
		if (debug) console.log(high_scores);
		
		//	Sort function for scores. Highest scores should be descending
		high_scores.scores.sort(function(a, b) {
			if 		(a.score < b.score)  return 1;
			else if (a.score > b.score)  return -1;
			else if (a.score == b.score) return 0;
		});
		
		return high_scores;
				
	} else	{
		return false;	
	}
}


//	Checks the high scores, returns true if parameter is a new high score
function achievements_high_scores_check(score) {
	var high_scores = JSON.parse(localStorage.getItem('HIGH SCORES'));

	high_scores.scores.sort(function(a, b) {
		if 		(a.score < b.score)  return 1;
		else if (a.score > b.score)  return -1;
		else if (a.score == b.score) return 0;
	});
	
	if (high_scores.scores[0].score > score) return false;
	else									 return true;
}
