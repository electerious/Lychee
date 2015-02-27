<!DOCTYPE HTML>
<html>
	<head>

		<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
		<title>Lychee</title>

		<meta name="author" content="Tobias Reich">
		<meta name="keywords" content="">
		<meta name="description" content="">

		<!-- CSS -->
		<link type="text/css" rel="stylesheet" href="dist/main.css">

		<link rel="shortcut icon" href="favicon.ico">
		<link rel="apple-touch-icon" href="src/images/apple-touch-icon-iphone.png" sizes="120x120">
		<link rel="apple-touch-icon" href="src/images/apple-touch-icon-ipad.png" sizes="152x152">

		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<meta name="apple-mobile-web-app-capable" content="yes">

		<?php

			if (isset($_GET['p'])&&$_GET['p']>0) {

				# Load required files
				require(__DIR__ . '/php/define.php');
				require(__DIR__ . '/php/autoload.php');
				require(__DIR__ . '/php/modules/misc.php');
				require(LYCHEE_CONFIG_FILE);

				# Define the table prefix
				if (!isset($dbTablePrefix)) $dbTablePrefix = '';
				defineTablePrefix($dbTablePrefix);

				$database = Database::connect($dbHost, $dbUser, $dbPassword, $dbName);

				echo getGraphHeader($database, $_GET['p']);

			}

		?>

	</head>
	<body class="view">

	<!-- Header -->
	<header class="view">

		<a class="button button--right" id="button_info" title="About Photo">
			<svg viewBox="0 0 8 8" class="iconic"><use xlink:href="src/images/iconic.svg#info"></use></svg>
		</a>
		<a class="button button--right" id="button_direct" title="Direct Link">
			<svg viewBox="0 0 8 8" class="iconic"><use xlink:href="src/images/iconic.svg#link-intact"></use></svg>
		</a>

		<a id="title" class="view"></a>

	</header>

	<!-- ImageView -->
	<div id="imageview" class="view"></div>

	<!-- Infobox -->
	<div id="infobox">
		<div class='header'>
			<h1>About</h1>
			<a class='close' title='Close About'>
				<svg viewBox="0 0 8 8" class="iconic"><use xlink:href="src/images/iconic.svg#circle-x"></use></svg>
			</a>
		</div>
		<div class='wrapper'>
		</div>
	</div>

	<!-- JS -->
	<script type="text/javascript" src="dist/view.js"></script>

	</body>
</html>