<?php

/**
 * @name		Guest Access (Public Mode)
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');
if (!defined('LYCHEE_ACCESS_GUEST')) exit('Error: You are not allowed to access this area!');

switch ($_POST['function']) {

	// Album Functions

	case 'getAlbums':		$album = new Album($database, $plugins, $settings, null);
							echo json_encode($album->getAll(true));
							break;

	case 'getAlbum':		if (!isset($_POST['albumID'], $_POST['password'])) exit();
							$album = new Album($database, $plugins, $settings, $_POST['albumID']);
							if ($album->getPublic()) {
								// Album Public
								if ($album->checkPassword($_POST['password'])) echo json_encode($album->get());
								else echo 'Warning: Wrong password!';
							} else {
								// Album Private
								echo 'Warning: Album private!';
							}
							break;

	case 'checkAlbumAccess':if (!isset($_POST['albumID'], $_POST['password'])) exit();
							$album = new Album($database, $plugins, $settings, $_POST['albumID']);
							if ($album->getPublic()) {
								// Album Public
								if ($album->checkPassword($_POST['password'])) echo true;
								else echo false;
							} else {
								// Album Private
								echo false;
							}
							break;

	// Photo Functions

	case 'getPhoto':		if (!isset($_POST['photoID'], $_POST['albumID'], $_POST['password'])) exit();
							$photo = new Photo($database, $plugins, $_POST['photoID']);
							if ($photo->getPublic($_POST['password']))
								echo json_encode($photo->get($_POST['albumID']));
							else
								echo 'Warning: Wrong password!';
							break;

	// Session Functions

	case 'init':			$session = new Session($plugins, $settings);
							echo json_encode($session->init($database, $dbName, true, $_POST['version']));
							break;

	case 'login':			if (!isset($_POST['user'], $_POST['password'])) exit();
							$session = new Session($plugins, $settings);
							echo $session->login($_POST['user'], $_POST['password']);
							break;

	// Miscellaneous

	default:				switch ($_GET['function']) {

								case 'getAlbumArchive':		if (!isset($_GET['albumID'], $_GET['password'])) exit();
															$album = new Album($database, $plugins, $settings, $_GET['albumID']);

															// Album Download
															if ($album->getPublic()) {
																// Album Public
																if ($album->checkPassword($_GET['password'])) $album->getArchive();
																else exit('Warning: Wrong password!');
															} else {
																// Album Private
																exit('Warning: Album private or not downloadable!');
															}

															break;

								case 'getPhotoArchive':		if (!isset($_GET['photoID'], $_GET['password'])) exit();
															$photo = new Photo($database, $plugins, $_GET['photoID']);

															// Photo Download
															if ($photo->getPublic($_GET['password']))
																// Photo Public
																$photo->getArchive();
															else
																// Photo Private
																exit('Warning: Photo private or not downloadable!');

															break;

								default:					exit('Error: Function not found! Please check the spelling of the called function.');
															break;

							}

							break;

}

?>