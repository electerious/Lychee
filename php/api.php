<?php

###
# @name			API
# @copyright	2015 by Tobias Reich
###

# Define the called function
if (isset($_POST['function']))		$fn = $_POST['function'];
else if (isset($_GET['function']))	$fn = $_GET['function'];
else								$fn = null;

# Check if a function has been specified
if (!empty($fn)) {

	# Start the session and set the default timezone
	session_start();
	date_default_timezone_set('UTC');

	# Load required files
	require(__DIR__ . '/define.php');
	require(__DIR__ . '/autoload.php');
	require(__DIR__ . '/modules/misc.php');

	# Validate parameters
	if (isset($_POST['albumIDs'])&&preg_match('/^[0-9\,]{1,}$/', $_POST['albumIDs'])!==1)	exit('Error: Wrong parameter type for albumIDs!');
	if (isset($_POST['photoIDs'])&&preg_match('/^[0-9\,]{1,}$/', $_POST['photoIDs'])!==1)	exit('Error: Wrong parameter type for photoIDs!');
	if (isset($_POST['albumID'])&&preg_match('/^[0-9sfr]{1,}$/', $_POST['albumID'])!==1)	exit('Error: Wrong parameter type for albumID!');
	if (isset($_POST['photoID'])&&preg_match('/^[0-9]{14}$/', $_POST['photoID'])!==1)		exit('Error: Wrong parameter type for photoID!');

	# Check if a configuration exists
	if (Config::exists()===false) {

		###
		# Installation Access
		# Limited access to configure Lychee. Only available when the config.php file is missing.
		###

		$installation = new Installation();
		$installation->check($fn);

		exit();

	}

	# Check if user is logged
	if ((isset($_SESSION['login'])&&$_SESSION['login']===true)&&
		(isset($_SESSION['identifier'])&&$_SESSION['identifier']===Settings::get()['identifier'])) {

		###
		# Admin Access
		# Full access to Lychee. Only with correct password/session.
		###

		$admin = new Admin();
		$admin->check($fn);

	} else {

		###
		# Guest Access
		# Access to view all public folders and photos in Lychee.
		###

		$guest = new Guest();
		$guest->check($fn);

	}

} else {

	exit('Error: No API function specified!');

}

?>