<?php

/**
 * @name		API
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

@ini_set('max_execution_time', '200');
@ini_set('post_max_size', '200M');
@ini_set('upload_max_size', '200M');
@ini_set('upload_max_filesize', '20M');
@ini_set('max_file_uploads', '100');

if (!empty($_POST['function'])||!empty($_GET['function'])) {

	session_start();
	define('LYCHEE', true);
	date_default_timezone_set('UTC');

	// Load modules
	require('modules/album.php');
	require('modules/db.php');
	require('modules/misc.php');
	require('modules/photo.php');
	require('modules/session.php');
	require('modules/settings.php');
	require('modules/upload.php');

	if (file_exists('../data/config.php')) require('../data/config.php');
	else {

		/**
		 * Installation Access
		 * Limited access to configure Lychee. Only available when the config.php file is missing.
		 */

		define('LYCHEE_ACCESS_INSTALLATION', true);
		require('access/installation.php');
		exit();

	}

	// Connect and get settings
	$database = dbConnect();
	$settings = getSettings();

	// Escape
	foreach(array_keys($_POST) as $key)	$_POST[$key] = mysqli_real_escape_string($database, urldecode($_POST[$key]));
	foreach(array_keys($_GET) as $key)	$_GET[$key] = mysqli_real_escape_string($database, urldecode($_GET[$key]));

	// Validate parameters
	if (isset($_POST['albumIDs'])&&preg_match('/^[0-9\,]{1,}$/', $_POST['albumIDs'])!==1)	exit('Error: Wrong parameter type for albumIDs!');
	if (isset($_POST['photoIDs'])&&preg_match('/^[0-9\,]{1,}$/', $_POST['photoIDs'])!==1)	exit('Error: Wrong parameter type for photoIDs!');
	if (isset($_POST['albumID'])&&preg_match('/^[0-9sf]{1,}$/', $_POST['albumID'])!==1)		exit('Error: Wrong parameter type for albumID!');
	if (isset($_POST['photoID'])&&preg_match('/^[0-9]{14}$/', $_POST['photoID'])!==1)		exit('Error: Wrong parameter type for photoID!');

	// Fallback for switch statement
	if (!isset($_POST['function']))	$_POST['function'] = '';
	if (!isset($_GET['function']))	$_GET['function'] = '';

	if (isset($_SESSION['login'])&&$_SESSION['login']==true) {

		/**
		 * Admin Access
		 * Full access to Lychee. Only with correct password/session.
		 */

		define('LYCHEE_ACCESS_ADMIN', true);
		require('access/admin.php');

	} else {

		/**
		 * Guest Access
		 * Access to view all public folders and photos in Lychee.
		 */

		define('LYCHEE_ACCESS_GUEST', true);
		require('access/guest.php');

	}

} else {

	exit('Error: No permission!');

}

?>