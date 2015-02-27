<?php

###
# @name			API
# @copyright	2015 by Tobias Reich
###

@ini_set('max_execution_time', '200');
@ini_set('post_max_size', '200M');
@ini_set('upload_max_size', '200M');
@ini_set('upload_max_filesize', '20M');
@ini_set('max_file_uploads', '100');

if (!empty($_POST['function'])||!empty($_GET['function'])) {

	session_start();
	date_default_timezone_set('UTC');

	# Load required files
	require(__DIR__ . '/define.php');
	require(__DIR__ . '/autoload.php');
	require(__DIR__ . '/modules/misc.php');

	if (file_exists(LYCHEE_CONFIG_FILE)) require(LYCHEE_CONFIG_FILE);
	else {

		###
		# Installation Access
		# Limited access to configure Lychee. Only available when the config.php file is missing.
		###

		define('LYCHEE_ACCESS_INSTALLATION', true);

		$installation = new Installation(null, null, null);
		$installation->check($_POST['function']);

		exit();

	}

	# Define the table prefix
	if (!isset($dbTablePrefix)) $dbTablePrefix = '';
	defineTablePrefix($dbTablePrefix);

	# Connect to database
	$database = Database::connect($dbHost, $dbUser, $dbPassword, $dbName);

	# Load settings
	$settings = new Settings($database);
	$settings = $settings->get();

	# Init plugins
	$plugins = explode(';', $settings['plugins']);
	$plugins = new Plugins($plugins, $database, $settings);

	# Validate parameters
	if (isset($_POST['albumIDs'])&&preg_match('/^[0-9\,]{1,}$/', $_POST['albumIDs'])!==1)	exit('Error: Wrong parameter type for albumIDs!');
	if (isset($_POST['photoIDs'])&&preg_match('/^[0-9\,]{1,}$/', $_POST['photoIDs'])!==1)	exit('Error: Wrong parameter type for photoIDs!');
	if (isset($_POST['albumID'])&&preg_match('/^[0-9sfr]{1,}$/', $_POST['albumID'])!==1)	exit('Error: Wrong parameter type for albumID!');
	if (isset($_POST['photoID'])&&preg_match('/^[0-9]{14}$/', $_POST['photoID'])!==1)		exit('Error: Wrong parameter type for photoID!');

	# Function for switch statement
	if (isset($_POST['function']))	$fn = $_POST['function'];
	else							$fn = $_GET['function'];

	if (isset($_SESSION['login'])&&$_SESSION['login']==true) {

		###
		# Admin Access
		# Full access to Lychee. Only with correct password/session.
		###

		define('LYCHEE_ACCESS_ADMIN', true);

		$admin = new Admin($database, $plugins, $settings);
		$admin->check($fn);

	} else {

		###
		# Guest Access
		# Access to view all public folders and photos in Lychee.
		###

		define('LYCHEE_ACCESS_GUEST', true);

		$guest = new Guest($database, $plugins, $settings);
		$guest->check($fn);

	}

} else {

	exit('Error: Called function not found!');

}

?>