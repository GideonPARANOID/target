<html>
	<head>
        <link type='text/css' rel='stylesheet' href='resources/main.css'>
        <link rel='icon' type='image/ico' href='resources/icon.ico'>

		<script type='text/javascript' src='//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js'></script>
		<script type='text/javascript' src='http://cdn.craig.is/js/mousetrap/mousetrap.min.js?a0717'></script>

		<script type='text/javascript' src='resources/javascript/model.js'></script>
		<script type='text/javascript' src='resources/javascript/view.js'></script>
		<script type='text/javascript' src='resources/javascript/controller.js'></script>
		<script type='text/javascript' src='resources/javascript/utilities.js'></script>
		<script type='text/javascript' src='resources/javascript/achievements.js'></script>

		<script type='text/javascript' src='resources/javascript/color2color.min.js'></script>

		<title>
			GAME | TARGET
		</title>
	</head>
	<body>
		<header>
			TARGET
		</header>
		<nav>
			<ul>
				<li><a href='game.html'>GAME</a></li>
				<li><a href='index.html'>ABOUT</a></li>
				<li><a href='writeup.pdf'>WRITEUP</a></li>
			</ul>
		</nav>
		<section id='game'>
			<audio preload='auto' src='resources/audio/happiness-by-sycamore-drive.ogg' ></audio>
			<audio preload='auto' src='resources/audio/computer-truck-by-euritmix-sux-my-dix.ogg' ></audio>
			<audio preload='auto' src='resources/audio/moves-by-sycamore-drive.ogg' ></audio>
			<audio preload='auto' src='resources/audio/shiny-spaceship-by-8-bit-ninjas.ogg' ></audio>
			<audio preload='auto' src='resources/audio/level-up.ogg' ></audio>
			<audio preload='auto' src='resources/audio/threat-destroy.ogg' ></audio>
			<audio preload='auto' src='resources/audio/game-over.ogg' ></audio>
			<audio preload='auto' src='resources/audio/life-lost.ogg' ></audio>

			<canvas id='main' tabindex='1' width='1200' height='600'></canvas>

			<script type='text/javascript'>

				// global variables
				var canvas;
				var context;
				var trig;
				var debug = true;


				//	Initialisation
				window.onload = function() {
					canvas = document.getElementById('main');
					context = canvas.getContext('2d');
					context.translate(canvas.width / 2, canvas.height / 2); // everything is drawn from the center
					trig = (((canvas.width / 2) ^ 2) + ((canvas.height / 2) ^ 2)) ^ .5;

					model_levels_initialise();

					control_menu('TARGET', null, {
						selected : 0,
						options  : [{
							title : 'PRESS ANY BUTTON TO START',
							functionality : control_menu_main
						}]},
					null, {
						onmousedown : control_menu_main
					});
				}


			</script>
		</section>
		<footer>
			<a href='http://gideonjon.es'>GIDEONJON.ES</a> 2013
		</footer>
	</body>
</html>
