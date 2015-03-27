<!DOCTYPE HTML>
<?php
require(__DIR__ . '/php/define.php');
require(__DIR__ . '/php/autoload.php');
require(__DIR__ . '/php/modules/misc.php');
require(LYCHEE_CONFIG_FILE);
if (!isset($lang)) $lang = 'en';
?>
<html lang="<?php echo $lang; ?>">
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

	</head>
	<body>

	<!-- Loading -->
	<div id="loading"></div>

	<!-- Header -->
	<header>

		<!-- Buttons -->
		<div id="tools_albums">
			<a class="button left icon-cog" id="button_settings" title="Settings"></a>
			<a class="button left icon-signout" id="button_signin" title="Sign In"></a>
			<a id="hostedwith">Hosted with Lychee</a>
			<a class="button right icon icon-plus button_add" title="Add"></a>
			<a class="button_divider"></a>
			<input id="search" type="text" name="search" placeholder="Search …">
			<a id="clearSearch" class="button right">&times;</a>
		</div>
		<div id="tools_album">
			<a class="button left icon-arrow-left" id="button_back_home" title="Close Album"></a>
			<a class="button right icon icon-plus button_add" title="Add"></a>
			<a class="button_divider"></a>
			<div class="tools" id="button_trash_album" title="Delete Album"><a class="icon-trash"></a></div>
			<div class="tools" id="button_info_album" title="Show Info"><a class="icon-info-sign"></a></div>
			<div class="tools" id="button_archive" title="Download Album"><a class="icon-circle-arrow-down"></a></div>
			<div class="tools" id="button_share_album" title="Share Album"><a class="icon-share"></a></div>
		</div>
		<div id="tools_photo">
			<a class="button left icon-arrow-left" id="button_back" title="Close Photo"></a>
			<div class="tools" id="button_more" title="More"><a class="icon-caret-down"></a></div>
			<a class="button_divider"></a>
			<div class="tools" id="button_trash" title="Delete"><a class="icon-trash"></a></div>
			<div class="tools" id="button_move" title="Move"><a class="icon-folder-open"></a></div>
			<div class="tools" id="button_info" title="Show Info"><a class="icon-info-sign"></a></div>
			<a class="button_divider"></a>
			<div class="tools" id="button_share" title="Share Photo"><a class="icon-share"></a></div>
			<div class="tools" id="button_star" title="Star Photo"><a class="icon-star-empty"></a></div>
		</div>

		<a id="title"></a>

	</header>

	<!-- Content -->
	<div id="content"></div>

	<!-- ImageView -->
	<div id="imageview"></div>

	<!-- Infobox -->
	<div id="infobox"></div>

	<!-- Upload -->
	<div id="upload">
		<input id="upload_files" type="file" name="fileElem[]" multiple accept="image/*">
	</div>

	<!-- JS -->
	<script type="text/javascript">window.locale = '<?php echo $lang; ?>';</script>
	<script type="text/javascript" src="dist/i18n/<?php echo $lang; ?>.js"></script>
	<script async type="text/javascript" src="dist/main.js"></script>

	</body>
</html>
