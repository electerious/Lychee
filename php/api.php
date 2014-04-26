<?php

###
# @name		API
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

@ini_set('max_execution_time', '200');
@ini_set('post_max_size', '200M');
@ini_set('upload_max_size', '200M');
@ini_set('upload_max_filesize', '20M');
@ini_set('max_file_uploads', '100');

if (!empty($_POST['function'])||!empty($_GET['function'])) {

	session_start();
	date_default_timezone_set('UTC');

	# Define globals
	require(__DIR__ . '/define.php');

	# Load autoload
	require(__DIR__ . '/autoload.php');

	# Load modules
	require(__DIR__ . '/modules/misc.php');

	if (file_exists(LYCHEE_CONFIG_FILE)) require(LYCHEE_CONFIG_FILE);
	else {

		/**
		 * Installation Access
		 * Limited access to configure Lychee. Only available when the config.php file is missing.
		 */

		define('LYCHEE_ACCESS_INSTALLATION', true);
		require(__DIR__ . '/access/installation.php');
		exit();

	}

	# Connect to database
	$database = Database::connect($dbHost, $dbUser, $dbPassword, $dbName);

	# Load settings
	$settings = new Settings($database);
	$settings = $settings->get();

	# Init plugins
	$plugins = explode(';', $settings['plugins']);
	$plugins = new Plugins($plugins, $database, $settings);

	# Escape
	foreach(array_keys($_POST) as $key)	$_POST[$key] = mysqli_real_escape_string($database, urldecode($_POST[$key]));
	foreach(array_keys($_GET) as $key)	$_GET[$key] = mysqli_real_escape_string($database, urldecode($_GET[$key]));

	# Validate parameters
	if (isset($_POST['albumIDs'])&&preg_match('/^[0-9\,]{1,}$/', $_POST['albumIDs'])!==1)	exit('Error: Wrong parameter type for albumIDs!');
	if (isset($_POST['photoIDs'])&&preg_match('/^[0-9\,]{1,}$/', $_POST['photoIDs'])!==1)	exit('Error: Wrong parameter type for photoIDs!');
	if (isset($_POST['albumID'])&&preg_match('/^[0-9sf]{1,}$/', $_POST['albumID'])!==1)		exit('Error: Wrong parameter type for albumID!');
	if (isset($_POST['photoID'])&&preg_match('/^[0-9]{14}$/', $_POST['photoID'])!==1)		exit('Error: Wrong parameter type for photoID!');

	# Fallback for switch statement
	if (!isset($_POST['function']))	$_POST['function'] = '';
	if (!isset($_GET['function']))	$_GET['function'] = '';

	if (isset($_SESSION['login'])&&$_SESSION['login']==true) {

		/**
		 * Admin Access
		 * Full access to Lychee. Only with correct password/session.
		 */

		define('LYCHEE_ACCESS_ADMIN', true);
		require(__DIR__ . '/access/admin.php');

	} else {

		/**
		 * Guest Access
		 * Access to view all public folders and photos in Lychee.
		 */

		define('LYCHEE_ACCESS_GUEST', true);
		require(__DIR__ . '/access/guest.php');

	}

} else {

	exit('Error: Called function not found!');

}

?>