<?php

/**
 * @name        API
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2014 by Philipp Maurer, Tobias Reich
 */

@ini_set('max_execution_time', '200');
@ini_set('post_max_size', '200M');
@ini_set('upload_max_size', '200M');
@ini_set('upload_max_filesize', '20M');
@ini_set('max_file_uploads', '100');

if (!empty($_POST['function'])||!empty($_GET['function'])) {

	session_start();
	define('LYCHEE', true);

	require('modules/db.php');
	require('modules/session.php');
	require('modules/settings.php');
	require('modules/upload.php');
	require('modules/album.php');
	require('modules/photo.php');
	require('modules/misc.php');

	if (file_exists('config.php')) require('config.php');
	else {

		/**
		 * Installation Mode
		 * Limited access to configure Lychee. Only available when the config.php file is missing.
		 */

		switch ($_POST['function']) {

			case 'createConfig':	if (isset($_POST['dbHost'])&&isset($_POST['dbUser'])&&isset($_POST['dbPassword'])&&isset($_POST['dbName']))
										echo createConfig($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName']);
									break;

			default:				echo 'Warning: No configuration!';
									break;

		}

		exit();

	}

	// Connect to DB
	$database = dbConnect();

	// Get Settings
	$settings = getSettings();

	// Security
	if (isset($_POST['albumID'])&&($_POST['albumID']==''||$_POST['albumID']<0||$_POST['albumID']>10000)) exit('Error: Wrong parameter type for albumID!');
	if (isset($_POST['photoID'])&&$_POST['photoID']=='') exit('Error: Wrong parameter type for photoID!');
	foreach(array_keys($_POST) as $key) $_POST[$key] = mysqli_real_escape_string($database, urldecode($_POST[$key]));
	foreach(array_keys($_GET) as $key) $_GET[$key] = mysqli_real_escape_string($database, urldecode($_GET[$key]));

	if (isset($_SESSION['login'])&&$_SESSION['login']==true) {

		/**
		 * Admin Mode
		 * Full access to Lychee. Only with correct password/session.
		 */

		switch ($_POST['function']) {

			// Album Functions

			case 'getAlbums':		echo json_encode(getAlbums(false));
									break;

			case 'getAlbum':		if (isset($_POST['albumID']))
										echo json_encode(getAlbum($_POST['albumID']));
									break;

			case 'addAlbum':		if (isset($_POST['title']))
										echo addAlbum($_POST['title']);
									break;

			case 'setAlbumTitle':	if (isset($_POST['albumID'])&&isset($_POST['title']))
										echo setAlbumTitle($_POST['albumID'], $_POST['title']);
									break;

			case 'setAlbumDescription':	if (isset($_POST['albumID'])&&isset($_POST['description']))
											echo setAlbumDescription($_POST['albumID'], $_POST['description']);
										break;

			case 'setAlbumPublic': 	if (isset($_POST['albumID']))
										if (!isset($_POST['password'])) $_POST['password'] = '';
										echo setAlbumPublic($_POST['albumID'], $_POST['password']);
									break;

			case 'setAlbumPassword':if (isset($_POST['albumID'])&&isset($_POST['password']))
										echo setAlbumPassword($_POST['albumID'], $_POST['password']);
									break;

			case 'deleteAlbum':		if (isset($_POST['albumID']))
										echo deleteAlbum($_POST['albumID']);
									break;

			// Photo Functions

			case 'getPhoto':		if (isset($_POST['photoID'])&&isset($_POST['albumID']))
										echo json_encode(getPhoto($_POST['photoID'], $_POST['albumID']));
									break;

			case 'deletePhoto':		if (isset($_POST['photoID']))
										echo deletePhoto($_POST['photoID']);
									break;

			case 'setAlbum':		if (isset($_POST['photoID'])&&isset($_POST['albumID']))
										echo setAlbum($_POST['photoID'], $_POST['albumID']);
									break;

			case 'setPhotoTitle':	if (isset($_POST['photoID'])&&isset($_POST['title']))
										echo setPhotoTitle($_POST['photoID'], $_POST['title']);
									break;

			case 'setPhotoStar':	if (isset($_POST['photoID']))
										echo setPhotoStar($_POST['photoID']);
									break;

			case 'setPhotoPublic':	if (isset($_POST['photoID'])&&isset($_POST['url']))
										echo setPhotoPublic($_POST['photoID'], $_POST['url']);
									break;

			case 'setPhotoDescription':	if (isset($_POST['photoID'])&&isset($_POST['description']))
											echo setPhotoDescription($_POST['photoID'], $_POST['description']);
										break;

			// Add Functions

			case 'upload':			if (isset($_FILES)&&isset($_POST['albumID']))
										echo upload($_FILES, $_POST['albumID']);
									break;

			case 'importUrl':		if (isset($_POST['url'])&&isset($_POST['albumID']))
										echo importUrl($_POST['url'], $_POST['albumID']);
									break;

			case 'importServer':	if (isset($_POST['albumID']))
										echo importServer($_POST['albumID']);
									break;

			// Search Function

			case 'search':			if (isset($_POST['term']))
										echo json_encode(search($_POST['term']));
									break;

			// Session Function

			case 'init':			echo json_encode(init('admin'));
									break;

			case 'login':			if (isset($_POST['user'])&&isset($_POST['password']))
										echo login($_POST['user'], $_POST['password']);
									break;

			case 'logout':			logout();
									break;

			// Settings

			case 'setLogin':		if (isset($_POST['username'])&&isset($_POST['password']))
										if (!isset($_POST['oldPassword'])) $_POST['oldPassword'] = '';
										echo setLogin($_POST['oldPassword'], $_POST['username'], $_POST['password']);
									break;

			case 'setSorting':		if (isset($_POST['type'])&&isset($_POST['order']))
										echo setSorting($_POST['type'], $_POST['order']);
									break;

			// Miscellaneous

			case 'update':			echo update();

			default:				if (isset($_GET['function'])&&$_GET['function']=='getAlbumArchive'&&isset($_GET['albumID']))

										// Album Download
										getAlbumArchive($_GET['albumID']);

									else if (isset($_GET['function'])&&$_GET['function']=='getPhotoArchive'&&isset($_GET['photoID']))

										// Photo Download
										getPhotoArchive($_GET['photoID']);

									else if (isset($_GET['function'])&&$_GET['function']=='update')

										// Update Lychee
										echo update();

									else

										// Function unknown
										exit('Error: Function not found! Please check the spelling of the called function.');

									break;

		}

	} else {

		/**
		 * Public Mode
		 * Access to view all public folders and photos in Lychee.
		 */

		switch ($_POST['function']) {

			// Album Functions

			case 'getAlbums':		echo json_encode(getAlbums(true));
									break;

			case 'getAlbum':		if (isset($_POST['albumID'])&&isset($_POST['password'])) {
										if (isAlbumPublic($_POST['albumID'])) {
											// Album Public
											if (checkAlbumPassword($_POST['albumID'], $_POST['password']))
												echo json_encode(getAlbum($_POST['albumID']));
											else
												echo 'Warning: Wrong password!';
										} else {
											// Album Private
											echo 'Warning: Album private!';
										}
									}
									break;

			case 'checkAlbumAccess':if (isset($_POST['albumID'])&&isset($_POST['password'])) {
										if (isAlbumPublic($_POST['albumID'])) {
											// Album Public
											if (checkAlbumPassword($_POST['albumID'], $_POST['password']))
												echo true;
											else
												echo false;
										} else {
											// Album Private
											echo false;
										}
									}
									break;

			// Photo Functions

			case 'getPhoto':		if (isset($_POST['photoID'])&&isset($_POST['albumID'])&&isset($_POST['password'])) {
										if (isPhotoPublic($_POST['photoID'], $_POST['password']))
											echo json_encode(getPhoto($_POST['photoID'], $_POST['albumID']));
										else
											echo 'Warning: Wrong password!';
									}
									break;

			// Session Functions

			case 'init':			echo json_encode(init('public'));
									break;

			case 'login':			if (isset($_POST['user'])&&isset($_POST['password']))
										echo login($_POST['user'], $_POST['password']);
									break;

			// Miscellaneous

			default:				if (isset($_GET['function'])&&$_GET['function']=='getAlbumArchive'&&isset($_GET['albumID'])&&isset($_GET['password'])) {

										// Album Download
										if (isAlbumPublic($_GET['albumID'])) {
											// Album Public
											if (checkAlbumPassword($_GET['albumID'], $_GET['password']))
												getAlbumArchive($_GET['albumID']);
											else
												exit('Warning: Wrong password!');
										} else {
											// Album Private
											exit('Warning: Album private or not downloadable!');
										}

									} else if (isset($_GET['function'])&&$_GET['function']=='getPhotoArchive'&&isset($_GET['photoID'])&&isset($_GET['password'])) {

										// Photo Download
										if (isPhotoPublic($_GET['photoID'], $_GET['password']))
											// Photo Public
											getPhotoArchive($_GET['photoID']);
										else
											// Photo Private
											exit('Warning: Photo private or not downloadable!');

									} else {

										// Function unknown
										exit('Error: Function not found! Please check the spelling of the called function.');

									}
									break;

		}

	}

} else {

	exit('Error: No permission!');

}

?>