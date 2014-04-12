<?php

/**
 * @name		Admin Access
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');
if (!defined('LYCHEE_ACCESS_ADMIN')) exit('Error: You are not allowed to access this area!');

switch ($_POST['function']) {

	// Album Functions

	case 'getAlbums':			$album = new Album($database, $plugins, $settings, null);
								echo json_encode($album->getAll(false));
								break;

	case 'getAlbum':			if (!isset($_POST['albumID'])) exit();
								$album = new Album($database, $plugins, $settings, $_POST['albumID']);
								echo json_encode($album->get());
								break;

	case 'addAlbum':			if (!isset($_POST['title'])) exit();
								$album = new Album($database, $plugins, $settings, null);
								echo $album->add($_POST['title']);
								break;

	case 'setAlbumTitle':		if (!isset($_POST['albumIDs'], $_POST['title'])) exit();
								$album = new Album($database, $plugins, $settings, $_POST['albumIDs']);
								echo $album->setTitle($_POST['title']);
								break;

	case 'setAlbumDescription':	if (!isset($_POST['albumID'], $_POST['description'])) exit();
								$album = new Album($database, $plugins, $settings, $_POST['albumID']);
								echo $album->setDescription($_POST['description']);
								break;

	case 'setAlbumPublic': 		if (!isset($_POST['albumID'], $_POST['password'])) exit();
								$album = new Album($database, $plugins, $settings, $_POST['albumID']);
								echo $album->setPublic($_POST['password']);
								break;

	case 'setAlbumPassword':	if (!isset($_POST['albumID'], $_POST['password'])) exit();
								$album = new Album($database, $plugins, $settings, $_POST['albumID']);
								echo $album->setPassword($_POST['password']);
								break;

	case 'deleteAlbum':			if (!isset($_POST['albumIDs'])) exit();
								$album = new Album($database, $plugins, $settings, $_POST['albumIDs']);
								echo $album->delete($_POST['albumIDs']);
								break;

	// Photo Functions

	case 'getPhoto':			if (!isset($_POST['photoID'], $_POST['albumID'])) exit();
								$photo = new Photo($database, $plugins, null, $_POST['photoID']);
								echo json_encode($photo->get($_POST['albumID']));
								break;

	case 'setPhotoTitle':		if (!isset($_POST['photoIDs'], $_POST['title'])) exit();
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->setTitle($_POST['title']);
								break;

	case 'setPhotoDescription':	if (!isset($_POST['photoID'], $_POST['description'])) exit();
								$photo = new Photo($database, $plugins, null, $_POST['photoID']);
								echo $photo->setDescription($_POST['description']);
								break;

	case 'setPhotoStar':		if (!isset($_POST['photoIDs'])) exit();
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->setStar();
								break;

	case 'setPhotoPublic':		if (!isset($_POST['photoID'])) exit();
								$photo = new Photo($database, $plugins, null, $_POST['photoID']);
								echo $photo->setPublic();
								break;

	case 'setPhotoAlbum':		if (!isset($_POST['photoIDs'], $_POST['albumID'])) exit();
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->setAlbum($_POST['albumID']);
								break;

	case 'setPhotoTags':		if (!isset($_POST['photoIDs'], $_POST['tags'])) exit();
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->setTags($_POST['tags']);
								break;

	case 'deletePhoto':			if (!isset($_POST['photoIDs'])) exit();
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->delete();
								break;

	// Add Functions

	case 'upload':			if (!isset($_FILES, $_POST['albumID'])) exit();
							$photo = new Photo($database, $plugins, $settings, null);
							echo $photo->add($_FILES, $_POST['albumID']);
							break;

	case 'importUrl':		if (!isset($_POST['url'], $_POST['albumID'])) exit();
							echo Import::url($_POST['url'], $_POST['albumID']);
							break;

	case 'importServer':	if (!isset($_POST['albumID'])) exit();
							echo Import::server($_POST['albumID'], null);
							break;

	// Search Function

	case 'search':			if (isset($_POST['term']))
								echo json_encode(search($_POST['term']));
							break;

	// Session Function

	case 'init':			if (!isset($_POST['version'])) exit();
							$session = new Session($plugins, $settings);
							echo json_encode($session->init($database, $dbName, false, $_POST['version']));
							break;

	case 'login':			if (!isset($_POST['user'], $_POST['password'])) exit();
							$session = new Session($plugins, $settings);
							echo $session->login($_POST['user'], $_POST['password']);
							break;

	case 'logout':			$session = new Session($plugins, $settings);
							echo $session->logout();
							break;

	// Settings Function

	case 'setLogin':		if (!isset($_POST['username'], $_POST['password'])) exit();
							if (!isset($_POST['oldPassword'])) $_POST['oldPassword'] = '';
							$settings = new Settings($database);
							echo $settings->setLogin($_POST['oldPassword'], $_POST['username'], $_POST['password']);
							break;

	case 'setSorting':		if (!isset($_POST['type'], $_POST['order'])) exit();
							$settings = new Settings($database);
							echo $settings->setSorting($_POST['type'], $_POST['order']);
							break;

	case 'setDropboxKey':	if (!isset($_POST['key'])) exit();
							$settings = new Settings($database);
							echo $settings->setDropboxKey($_POST['key']);
							break;

	// Miscellaneous

	default:				switch ($_GET['function']) {

								case 'getAlbumArchive':		if (!isset($_GET['albumID'])) exit();
															$album = new Album($database, $plugins, $settings, $_GET['albumID']);
															$album->getArchive();
															break;

								case 'getPhotoArchive':		if (!isset($_GET['photoID'])) exit();
															$photo = new Photo($database, $plugins, null, $_GET['photoID']);
															$photo->getArchive();
															break;

								default:					exit('Error: Function not found! Please check the spelling of the called function.');
															break;

							}

							break;

}

?>