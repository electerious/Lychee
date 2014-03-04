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

	case 'init':			echo json_encode(init('public', $_POST['version']));
							break;

	case 'login':			if (isset($_POST['user'])&&isset($_POST['password']))
								echo login($_POST['user'], $_POST['password']);
							break;

	// Miscellaneous

	default:				switch ($_GET['function']) {

								case 'getFeed':				if (isset($_GET['albumID'])&&isset($_GET['password'])) {

																// Album Feed
																if (isAlbumPublic($_GET['albumID'])) {
																	// Album Public
																	if (checkAlbumPassword($_GET['albumID'], $_GET['password']))
																		echo getFeed($_GET['albumID']);
																	else
																		exit('Warning: Wrong password!');
																} else {
																	// Album Private
																	exit('Warning: Album private!');
																}

															}
															break;

								case 'getAlbumArchive':		if (isset($_GET['albumID'])&&isset($_GET['password'])) {

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

															}
															break;

								case 'getPhotoArchive':		if (isset($_GET['photoID'])&&isset($_GET['password'])) {

																// Photo Download
																if (isPhotoPublic($_GET['photoID'], $_GET['password']))
																	// Photo Public
																	getPhotoArchive($_GET['photoID']);
																else
																	// Photo Private
																	exit('Warning: Photo private or not downloadable!');

															}
															break;

								default:					exit('Error: Function not found! Please check the spelling of the called function.');
															break;

							}

							break;

}

?>