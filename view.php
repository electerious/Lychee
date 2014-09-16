<!DOCTYPE HTML>
<html>
	<head>

		<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
		<title>Lychee</title>

		<meta name="author" content="Tobias Reich">
		<meta name="keywords" content="">
		<meta name="description" content="">

		<!-- CSS -->
		<link type="text/css" rel="stylesheet" href="assets/min/main.css">

		<link rel="shortcut icon" href="favicon.ico">
		<link rel="apple-touch-icon" href="assets/img/apple-touch-icon-iphone.png" sizes="120x120">
		<link rel="apple-touch-icon" href="assets/img/apple-touch-icon-ipad.png" sizes="152x152">

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

		<!-- Buttons -->
		<div class="tools" id="button_direct" title="Direct Link"><a class="icon-link"></a></div>
		<div class="tools" id="button_info" title="Show Info"><a class="icon-info-sign"></a></div>

		<a id="title" class="view"></a>

	</header>

	<!-- ImageView -->
	<div id="imageview" class="view"></div>

	<!-- Infobox -->
	<div id="infobox"></div>

	<!-- JS -->
	<script type="text/javascript" src="assets/min/view.js"></script>

	</body>
</html>