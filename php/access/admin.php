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

	case 'getAlbum':			if (isset($_POST['albumID']))
									echo json_encode(getAlbum($_POST['albumID']));
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

	case 'getPhoto':			if (isset($_POST['photoID'], $_POST['albumID']))
									echo json_encode(getPhoto($_POST['photoID'], $_POST['albumID']));
								break;

	case 'deletePhoto':			if (isset($_POST['photoIDs']))
									echo deletePhoto($_POST['photoIDs']);
								break;

	case 'setPhotoAlbum':		if (isset($_POST['photoIDs'], $_POST['albumID']))
									echo setPhotoAlbum($_POST['photoIDs'], $_POST['albumID']);
								break;

	case 'setPhotoTitle':		if (isset($_POST['photoIDs'], $_POST['title']))
									echo setPhotoTitle($_POST['photoIDs'], $_POST['title']);
								break;

	case 'setPhotoStar':		if (isset($_POST['photoIDs']))
									echo setPhotoStar($_POST['photoIDs']);
								break;

	case 'setPhotoPublic':		if (isset($_POST['photoID'], $_POST['url']))
									echo setPhotoPublic($_POST['photoID'], $_POST['url']);
								break;

	case 'setPhotoDescription':	if (isset($_POST['photoID'], $_POST['description']))
									echo setPhotoDescription($_POST['photoID'], $_POST['description']);
								break;

	case 'setPhotoTags':		if (isset($_POST['photoIDs'], $_POST['tags']))
									echo setPhotoTags($_POST['photoIDs'], $_POST['tags']);
								break;

	// Add Functions

	case 'upload':			if (isset($_FILES, $_POST['albumID']))
								echo upload($_FILES, $_POST['albumID']);
							break;

	case 'importUrl':		if (isset($_POST['url'], $_POST['albumID']))
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

	case 'init':			echo json_encode(init('admin', $_POST['version']));
							break;

	case 'login':			if (isset($_POST['user'], $_POST['password']))
								echo login($_POST['user'], $_POST['password']);
							break;

	case 'logout':			logout();
							break;

	// Settings

	case 'setLogin':		if (isset($_POST['username'], $_POST['password']))
								if (!isset($_POST['oldPassword'])) $_POST['oldPassword'] = '';
								echo setLogin($_POST['oldPassword'], $_POST['username'], $_POST['password']);
							break;

	case 'setSorting':		if (isset($_POST['type'], $_POST['order']))
								echo setSorting($_POST['type'], $_POST['order']);
							break;

	case 'setDropboxKey':	if (isset($_POST['key']))
								echo setDropboxKey($_POST['key']);
							break;

	// Miscellaneous

	default:				switch ($_GET['function']) {

								case 'getFeed':				if (isset($_GET['albumID']))
																echo getFeed($_GET['albumID']);
															break;

								case 'getAlbumArchive':		if (!isset($_GET['albumID'])) exit();
															$album = new Album($database, $plugins, $settings, $_GET['albumID']);
															$album->getArchive();
															break;

								case 'getPhotoArchive':		if (isset($_GET['photoID']))
																getPhotoArchive($_GET['photoID']);
															break;

								case 'update':				echo update();
															break;

								default:					exit('Error: Function not found! Please check the spelling of the called function.');
															break;

							}

							break;

}

?>