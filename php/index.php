<?php

/**
 * @author    Tobias Reich
 * @copyright 2016 by Tobias Reich
 */

namespace Lychee;

use Lychee\Modules\Config;
use Lychee\Modules\Response;
use Lychee\Modules\Settings;
use Lychee\Modules\Validator;

use Lychee\Access\Installation;
use Lychee\Access\Admin;
use Lychee\Access\Guest;

require(__DIR__ . '/define.php');
require(__DIR__ . '/autoload.php');

require(__DIR__ . '/helpers/fastImageCopyResampled.php');
require(__DIR__ . '/helpers/generateID.php');
require(__DIR__ . '/helpers/getExtension.php');
require(__DIR__ . '/helpers/getGraphHeader.php');
require(__DIR__ . '/helpers/getHashedString.php');
require(__DIR__ . '/helpers/hasPermissions.php');
require(__DIR__ . '/helpers/search.php');

// Define the called function
if (isset($_POST['function']))     $fn = $_POST['function'];
else if (isset($_GET['function'])) $fn = $_GET['function'];
else                               $fn = null;

// Check if a function has been specified
if (!empty($fn)) {

	// Start the session and set the default timezone
	session_start();
	date_default_timezone_set('UTC');

	// Validate parameters
	if (isset($_POST['albumIDs'])&&Validator::isAlbumIDs($_POST['albumIDs'])===false) Response::error('Wrong parameter type for albumIDs!');
	if (isset($_POST['photoIDs'])&&Validator::isPhotoIDs($_POST['photoIDs'])===false) Response::error('Wrong parameter type for photoIDs!');
	if (isset($_POST['albumID'])&&Validator::isAlbumID($_POST['albumID'])==false)     Response::error('Wrong parameter type for albumID!');
	if (isset($_POST['photoID'])&&Validator::isPhotoID($_POST['photoID'])==false)     Response::error('Wrong parameter type for photoID!');

	// Check if a configuration exists
	if (Config::exists()===false) {

		/**
		 * Installation Access
		 * Limited access to configure Lychee. Only available when the config.php file is missing.
		 */

		Installation::init($fn);
		exit();

	}

	// Check if user is logged
	if ((isset($_SESSION['login'])&&$_SESSION['login']===true)&&
		(isset($_SESSION['identifier'])&&$_SESSION['identifier']===Settings::get()['identifier'])) {

		/**
		 * Admin Access
		 * Full access to Lychee. Only with correct password/session.
		 */

		Admin::init($fn);
		exit();

	} else {

		/**
		 * Guest Access
		 * Access to view all public folders and photos in Lychee.
		 */

		Guest::init($fn);
		exit();

	}

} else {

	Response::error('No API function specified!');

}

?>