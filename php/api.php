<?php

/**
 * @name        api.php
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 */

if (floatval(phpversion())<5.2) die('Please upgrade to PHP 5.2 or higher!');

if (!empty($_POST['function'])||!empty($_GET['function'])) {

	session_start();
	define('LYCHEE', true);

	require('config.php');
	require('functions.php');

	// Security
	if (isset($_POST['albumID'])&&($_POST['albumID']==''||$_POST['albumID']<0)) exit('Wrong parameter type for albumID!');
	if (isset($_POST['photoID'])&&$_POST['photoID']=='') exit('Wrong parameter type for photoID!');

	//Connect to DB
	$database = dbConnect();

	if (isset($_SESSION['login'])&&$_SESSION['login']==true) {

		/**
		 * Admin Mode
		 * Full access to Lychee. Only with correct password.
		 */

		// Album Functions
		if ($_POST['function']=='getAlbums') echo json_encode(getAlbums(false));
		if ($_POST['function']=='getSmartInfo') echo json_encode(getSmartInfo());
		if ($_POST['function']=='getAlbum'&&isset($_POST['albumID'])) echo json_encode(getAlbum($_POST['albumID']));
		if ($_POST['function']=='addAlbum'&&isset($_POST['title'])) echo addAlbum($_POST['title']);
		if ($_POST['function']=='setAlbumTitle'&&isset($_POST['albumID'])&&isset($_POST['title'])) echo setAlbumTitle($_POST['albumID'], $_POST['title']);
		if ($_POST['function']=='setAlbumPublic'&&isset($_POST['albumID'])) echo setAlbumPublic($_POST['albumID']);
		if ($_POST['function']=='setAlbumPassword'&&isset($_POST['albumID'])&&isset($_POST['password'])) echo setAlbumPassword($_POST['albumID'], $_POST['password']);
		if ($_POST['function']=='deleteAlbum'&&isset($_POST['albumID'])&&isset($_POST['delAll'])) echo deleteAlbum($_POST['albumID'], $_POST['delAll']);
		if (isset($_GET['function'])&&$_GET['function']=='getAlbumArchive'&&isset($_GET['albumID'])) getAlbumArchive($_GET['albumID']);

		// Photo Functions
		if ($_POST['function']=='getPhoto'&&isset($_POST['photoID'])&&isset($_POST['albumID'])) echo json_encode(getPhoto($_POST['photoID'], $_POST['albumID']));
		if ($_POST['function']=='deletePhoto'&&isset($_POST['photoID'])) echo deletePhoto($_POST['photoID']);
		if ($_POST['function']=='setAlbum'&&isset($_POST['photoID'])&&isset($_POST['albumID'])) echo setAlbum($_POST['photoID'], $_POST['albumID']);
		if ($_POST['function']=='setPhotoTitle'&&isset($_POST['photoID'])&&isset($_POST['title'])) echo setPhotoTitle($_POST['photoID'], $_POST['title']);
		if ($_POST['function']=='setPhotoStar'&&isset($_POST['photoID'])) echo setPhotoStar($_POST['photoID']);
		if ($_POST['function']=='setPhotoPublic'&&isset($_POST['photoID'])&&isset($_POST['url'])) echo setPhotoPublic($_POST['photoID'], $_POST['url']);
		if ($_POST['function']=='setPhotoDescription'&&isset($_POST['photoID'])&&isset($_POST['description'])) echo setPhotoDescription($_POST['photoID'], $_POST['description']);

        // Add Function
		if ($_POST['function']=='upload'&&isset($_FILES)&&isset($_POST['albumID'])) echo upload($_FILES, $_POST['albumID']);
		if ($_POST['function']=='importUrl'&&isset($_POST['url'])&&isset($_POST['albumID'])) echo importUrl($_POST['url'], $_POST['albumID']);

		// Search Function
		if ($_POST['function']=='search'&&isset($_POST['term'])) echo json_encode(search($_POST['term']));

		// Session Functions
		if ($_POST['function']=='init') echo json_encode(init('admin'));
		if ($_POST['function']=='login') echo login($_POST['user'], $_POST['password']);
		if ($_POST['function']=='logout') logout();

	} else {

		/**
		 * Public Mode
		 * Access to view all public folders and photos in Lychee.
		 */

		// Album Functions
		if ($_POST['function']=='getAlbums') echo json_encode(getAlbums(true));
		if ($_POST['function']=='getAlbum'&&isset($_POST['albumID'])&&isset($_POST['password'])) {
			if (isAlbumPublic($_POST['albumID'])) {
				// Album Public
				if (checkAlbumPassword($_POST['albumID'], $_POST['password'])) echo json_encode(getAlbum($_POST['albumID']));
				else echo json_encode('HTTP/1.1 403 Wrong password!');
			} else {
				// Album Private
				echo json_encode('HTTP/1.1 403 Album private!');
			}
		}
		if ($_POST['function']=='checkAlbumAccess'&&isset($_POST['albumID'])&&isset($_POST['password'])) {
			if (isAlbumPublic($_POST['albumID'])) {
				// Album Public
				if (checkAlbumPassword($_POST['albumID'], $_POST['password'])) echo true;
				else echo false;
			} else {
				// Album Private
				echo false;
			}
		}

		// Photo Functions
		if ($_POST['function']=='getPhoto'&&isset($_POST['photoID'])&&isset($_POST['albumID'])&&isset($_POST['password'])) {
			if (isPhotoPublic($_POST['photoID'], $_POST['password'])) echo json_encode(getPhoto($_POST['photoID'], $_POST['albumID']));
			else echo json_encode('HTTP/1.1 403 Wrong password!');
		}

		// Session Functions
		if ($_POST['function']=='init') echo json_encode(init('public'));
		if ($_POST['function']=='login') echo login($_POST['user'], $_POST['password']);

	}

} else {

	header('HTTP/1.1 401 Unauthorized');
	die('Error: No permission!');

}

?>