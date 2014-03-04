<!DOCTYPE HTML>
<html>
	<head>

		<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
		<title></title>

		<meta name="author" content="Tobias Reich, Philipp Maurer">
		<meta name="keywords" content="">
		<meta name="description" content="">

		<link type="text/css" rel="stylesheet" href="assets/build/main.css">

		<link rel="shortcut icon" href="favicon.ico">

		<meta name="apple-mobile-web-app-status-bar-style" content="black" >
		<meta name="viewport" content="user-scalable=no, initial-scale=1">
		<meta name="apple-mobile-web-app-capable" content="yes">

		<?php

			if(isset($_GET['p'])) {

				define("LYCHEE", true);

				require("data/config.php");
				require("php/modules/db.php");
				require("php/modules/misc.php");

				$database = dbConnect();

				echo openGraphHeader($_GET['p']);

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
	<script type="text/javascript" src="assets/js/_frameworks.js"></script>
	<script type="text/javascript" src="assets/js/build.js"></script>
	<script type="text/javascript" src="assets/js/view/main.js"></script>

	</body>
</html>