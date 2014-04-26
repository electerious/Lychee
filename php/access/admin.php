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

	case 'getAlbum':			Module::dependencies(isset($_POST['albumID']));
								$album = new Album($database, $plugins, $settings, $_POST['albumID']);
								echo json_encode($album->get());
								break;

	case 'addAlbum':			Module::dependencies(isset($_POST['title']));
								$album = new Album($database, $plugins, $settings, null);
								echo $album->add($_POST['title']);
								break;

	case 'setAlbumTitle':		Module::dependencies(isset($_POST['albumIDs'], $_POST['title']));
								$album = new Album($database, $plugins, $settings, $_POST['albumIDs']);
								echo $album->setTitle($_POST['title']);
								break;

	case 'setAlbumDescription':	Module::dependencies(isset($_POST['albumID'], $_POST['description']));
								$album = new Album($database, $plugins, $settings, $_POST['albumID']);
								echo $album->setDescription($_POST['description']);
								break;

	case 'setAlbumPublic': 		Module::dependencies(isset($_POST['albumID'], $_POST['password']));
								$album = new Album($database, $plugins, $settings, $_POST['albumID']);
								echo $album->setPublic($_POST['password']);
								break;

	case 'setAlbumPassword':	Module::dependencies(isset($_POST['albumID'], $_POST['password']));
								$album = new Album($database, $plugins, $settings, $_POST['albumID']);
								echo $album->setPassword($_POST['password']);
								break;

	case 'deleteAlbum':			Module::dependencies(isset($_POST['albumIDs']));
								$album = new Album($database, $plugins, $settings, $_POST['albumIDs']);
								echo $album->delete($_POST['albumIDs']);
								break;

	// Photo Functions

	case 'getPhoto':			Module::dependencies(isset($_POST['photoID'], $_POST['albumID']));
								$photo = new Photo($database, $plugins, null, $_POST['photoID']);
								echo json_encode($photo->get($_POST['albumID']));
								break;

	case 'setPhotoTitle':		Module::dependencies(isset($_POST['photoIDs'], $_POST['title']));
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->setTitle($_POST['title']);
								break;

	case 'setPhotoDescription':	Module::dependencies(isset($_POST['photoID'], $_POST['description']));
								$photo = new Photo($database, $plugins, null, $_POST['photoID']);
								echo $photo->setDescription($_POST['description']);
								break;

	case 'setPhotoStar':		Module::dependencies(isset($_POST['photoIDs']));
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->setStar();
								break;

	case 'setPhotoPublic':		Module::dependencies(isset($_POST['photoID']));
								$photo = new Photo($database, $plugins, null, $_POST['photoID']);
								echo $photo->setPublic();
								break;

	case 'setPhotoAlbum':		Module::dependencies(isset($_POST['photoIDs'], $_POST['albumID']));
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->setAlbum($_POST['albumID']);
								break;

	case 'setPhotoTags':		Module::dependencies(isset($_POST['photoIDs'], $_POST['tags']));
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->setTags($_POST['tags']);
								break;

	case 'deletePhoto':			Module::dependencies(isset($_POST['photoIDs']));
								$photo = new Photo($database, $plugins, null, $_POST['photoIDs']);
								echo $photo->delete();
								break;

	// Add Functions

	case 'upload':			Module::dependencies(isset($_FILES, $_POST['albumID']));
							$photo = new Photo($database, $plugins, $settings, null);
							echo $photo->add($_FILES, $_POST['albumID']);
							break;

	case 'importUrl':		Module::dependencies(isset($_POST['url'], $_POST['albumID']));
							echo Import::url($_POST['url'], $_POST['albumID']);
							break;

	case 'importServer':	Module::dependencies(isset($_POST['albumID']));
							echo Import::server($_POST['albumID'], null);
							break;

	// Search Function

	case 'search':			Module::dependencies(isset($_POST['term']));
							echo json_encode(search($database, $settings, $_POST['term']));
							break;

	// Session Function

	case 'init':			Module::dependencies(isset($_POST['version']));
							$session = new Session($plugins, $settings);
							echo json_encode($session->init($database, $dbName, false, $_POST['version']));
							break;

	case 'login':			Module::dependencies(isset($_POST['user'], $_POST['password']));
							$session = new Session($plugins, $settings);
							echo $session->login($_POST['user'], $_POST['password']);
							break;

	case 'logout':			$session = new Session($plugins, $settings);
							echo $session->logout();
							break;

	// Settings Function

	case 'setLogin':		Module::dependencies(isset($_POST['username'], $_POST['password']));
							if (!isset($_POST['oldPassword'])) $_POST['oldPassword'] = '';
							$settings = new Settings($database);
							echo $settings->setLogin($_POST['oldPassword'], $_POST['username'], $_POST['password']);
							break;

	case 'setSorting':		Module::dependencies(isset($_POST['type'], $_POST['order']));
							$settings = new Settings($database);
							echo $settings->setSorting($_POST['type'], $_POST['order']);
							break;

	case 'setDropboxKey':	Module::dependencies(isset($_POST['key']));
							$settings = new Settings($database);
							echo $settings->setDropboxKey($_POST['key']);
							break;

	// Miscellaneous

	default:				switch ($_GET['function']) {

								case 'getAlbumArchive':		Module::dependencies(isset($_GET['albumID']));
															$album = new Album($database, $plugins, $settings, $_GET['albumID']);
															$album->getArchive();
															break;

								case 'getPhotoArchive':		Module::dependencies(isset($_GET['photoID']));
															$photo = new Photo($database, $plugins, null, $_GET['photoID']);
															$photo->getArchive();
															break;

								default:					exit('Error: Function not found! Please check the spelling of the called function.');
															break;

							}

							break;

}

?>