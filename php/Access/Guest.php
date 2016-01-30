<?php

namespace Lychee\Access;

use Lychee\Modules\Album;
use Lychee\Modules\Photo;
use Lychee\Modules\Session;
use Lychee\Modules\Validator;

final class Guest extends Access {

	public static function init($fn) {

		switch ($fn) {

			# Album functions
			case 'Album::getAll':		self::getAlbumsAction(); break;
			case 'Album::get':			self::getAlbumAction(); break;
			case 'Album::getPublic':	self::checkAlbumAccessAction(); break;

			# Photo functions
			case 'Photo::get':			self::getPhotoAction(); break;

			# Session functions
			case 'Session::init':		self::initAction(); break;
			case 'Session::login':		self::loginAction(); break;
			case 'Session::logout':		self::logoutAction(); break;

			# $_GET functions
			case 'Album::getArchive':	self::getAlbumArchiveAction(); break;
			case 'Photo::getArchive':	self::getPhotoArchiveAction(); break;

			# Error
			default:					self::fnNotFound(); break;

		}

		return true;

	}

	# Album functions

	private static function getAlbumsAction() {

		$album = new Album(null);
		echo json_encode($album->getAll(true));

	}

	private static function getAlbumAction() {

		Validator::required(isset($_POST['albumID'], $_POST['password']), __METHOD__);

		$album = new Album($_POST['albumID']);

		if ($album->getPublic()) {

			# Album public
			if ($album->checkPassword($_POST['password']))	echo json_encode($album->get());
			else											echo 'Warning: Wrong password!';

		} else {

			# Album private
			echo 'Warning: Album private!';

		}

	}

	private static function checkAlbumAccessAction() {

		Validator::required(isset($_POST['albumID'], $_POST['password']), __METHOD__);

		$album = new Album($_POST['albumID']);

		if ($album->getPublic()) {

			# Album public
			if ($album->checkPassword($_POST['password']))	echo true;
			else											echo false;

		} else {

			# Album private
			echo false;

		}

	}

	# Photo functions

	private static function getPhotoAction() {

		Validator::required(isset($_POST['photoID'], $_POST['albumID'], $_POST['password']), __METHOD__);

		$photo = new Photo($_POST['photoID']);

		$pgP = $photo->getPublic($_POST['password']);

		if ($pgP===2)		echo json_encode($photo->get($_POST['albumID']));
		else if ($pgP===1)	echo 'Warning: Wrong password!';
		else if ($pgP===0)	echo 'Warning: Photo private!';

	}

	# Session functions

	private static function initAction() {

		$session = new Session();
		echo json_encode($session->init(true));

	}

	private static function loginAction() {

		Validator::required(isset($_POST['user'], $_POST['password']), __METHOD__);

		$session = new Session();
		echo $session->login($_POST['user'], $_POST['password']);

	}

	private static function logoutAction() {

		$session = new Session();
		echo $session->logout();

	}

	# $_GET functions

	private static function getAlbumArchiveAction() {

		Validator::required(isset($_GET['albumID'], $_GET['password']), __METHOD__);

		$album = new Album($_GET['albumID']);

		if ($album->getPublic()&&$album->getDownloadable()) {

			# Album Public
			if ($album->checkPassword($_GET['password']))	$album->getArchive();
			else											exit('Warning: Wrong password!');

		} else {

			# Album Private
			exit('Warning: Album private or not downloadable!');

		}

	}

	private static function getPhotoArchiveAction() {

		Validator::required(isset($_GET['photoID'], $_GET['password']), __METHOD__);

		$photo = new Photo($_GET['photoID']);

		$pgP = $photo->getPublic($_GET['password']);

		# Photo Download
		if ($pgP===2) {

			# Photo Public
			$photo->getArchive();

		} else {

			# Photo Private
			exit('Warning: Photo private or password incorrect!');

		}

	}

}

?>
