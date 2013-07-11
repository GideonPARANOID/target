/*
 * @author	gideon mw jones (@gideonparanoid)
 * @version	who knows
 */

var audio = {
	tracks        : [],
	tracks_current: 0,
	effects 	  : [],		//	Level up, threat destroy, game over, life lost
	mute		  : false
};

//	Constructing the tracks & effects arrays in the audio object from the html elements
function audio_initialise() {
	for (var i = 0; i < 4; i++) audio.tracks.push(document.getElementsByTagName('audio')[i]);
	for (var i = 4; i < 8; i++) audio.effects.push(document.getElementsByTagName('audio')[i]);
}


//	Plays an index from tracks array in the audio object, if no index specified, falls back to the last played
function audio_music_play(index) {
	if (index != null) audio.tracks_current = index;
	
	if (debug) if (debug) if (debug) if (debug) console.log('audio track ' + audio.tracks_current);
	
	audio.tracks[audio.tracks_current].play();
}


//	Pauses the current track
function audio_music_pause() {
	audio.tracks[audio.tracks_current].pause();
}


//	Plays a sound effect
function audio_effects_play(index) {
	audio.effects[index].play();
}


function audio_toggle_mute() {
	if (debug) if (debug) if (debug) if (debug) console.log('audio mute toggled');
	
	if (audio.mute) {
		audio.tracks[audio.tracks_current].volume = 1;
		audio.mute = false;
	} else {
		audio.tracks[audio.tracks_current].volume = 0;
		audio.mute = true;
	}
}






