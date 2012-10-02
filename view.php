<?php require_once("php/functions.php"); ?>
<!DOCTYPE HTML>
<html>
	<head>

		<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
		<title></title>

		<meta name="author" content="Tobias Reich, Philipp Maurer">
		<meta name="keywords" content="">
		<meta name="description" content="">

		<link type="text/css" rel="stylesheet" href="css/animations.css">
		<link type="text/css" rel="stylesheet" href="css/font-awesome.css">
		<link type="text/css" rel="stylesheet" href="css/style.css">
		<link rel="shortcut icon" href="img/favicon.png">

		<meta name="apple-mobile-web-app-status-bar-style" content="black" >
		<meta name="viewport" content="width=device-width, user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		
		<?php if(isset($_GET['p'])) echo facebookHeader($_GET['p']); ?>
                
	</head>
	<body>

	<!-- Loading -->
	<div id="loading"></div>
	
	<!-- Header -->
	<header>

		<!-- Buttons -->
		<div class="tools" id="button_download" title="Download Photo"><a class="icon-download"></a></div>
		<div class="tools" id="button_info" title="Show Info"><a class="icon-info-sign"></a></div>

		<a id="title"></a>

	</header>
	
	<!-- ImageView -->
	<div id="image_view"></div>
	
	<!-- Infobox -->
	<div id="infobox"></div>

	<!-- JS -->
	<script type="text/javascript" src="js/frameworks.js"></script>
	<script type="text/javascript" src="js/build.js"></script>
	<script type="text/javascript" src="js/view.js"></script>


	</body>
</html>