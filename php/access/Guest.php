<?php

###
# @name			Guest Access (Public Mode)
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');
if (!defined('LYCHEE_ACCESS_GUEST')) exit('Error: You are not allowed to access this area!');

class Guest extends Access {

	public function check($fn) {

		switch ($fn) {

			# Album functions
			case 'Album::getAll':		$this->getAlbums(); break;
			case 'Album::get':			$this->getAlbum(); break;
			case 'Album::getPublic':	$this->checkAlbumAccess(); break;

			# Photo functions
			case 'Photo::get':			$this->getPhoto(); break;

			# Session functions
			case 'Session::init':		$this->init(); break;
			case 'Session::login':		$this->login(); break;
			case 'Session::logout':		$this->logout(); break;

			# $_GET functions
			case 'Album::getArchive':	$this->getAlbumArchive(); break;
			case 'Photo::getArchive':	$this->getPhotoArchive(); break;

			# Error
			default:					exit('Error: Function not found! Please check the spelling of the called function.');
										return false; break;

		}

		return true;

	}

	# Album functions

	private function getAlbums() {

		$album = new Album($this->database, $this->plugins, $this->settings, null);
		echo json_encode($album->getAll(true));

	}

	private function getAlbum() {

		Module::dependencies(isset($_POST['albumID'], $_POST['password']));
		$album = new Album($this->database, $this->plugins, $this->settings, $_POST['albumID']);

		if ($album->getPublic()) {

			# Album public
			if ($album->checkPassword($_POST['password'])) echo json_encode($album->get());
			else echo 'Warning: Wrong password!';

		} else {

			# Album private
			echo 'Warning: Album private!';

		}

	}

	private function checkAlbumAccess() {

		Module::dependencies(isset($_POST['albumID'], $_POST['password']));
		$album = new Album($this->database, $this->plugins, $this->settings, $_POST['albumID']);

		if ($album->getPublic()) {

			# Album public
			if ($album->checkPassword($_POST['password'])) echo true;
			else echo false;

		} else {

			# Album private
			echo false;

		}

	}

	# Photo functions

	private function getPhoto() {

		Module::dependencies(isset($_POST['photoID'], $_POST['albumID'], $_POST['password']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoID']);

		if ($photo->getPublic($_POST['password'])) echo json_encode($photo->get($_POST['albumID']));
		else echo 'Warning: Wrong password!';

	}

	# Session functions

	private function init() {

		global $dbName;

		$session = new Session($this->plugins, $this->settings);
		echo json_encode($session->init($this->database, $dbName, true, $_POST['version']));

	}

	private function login() {

		Module::dependencies(isset($_POST['user'], $_POST['password']));
		$session = new Session($this->plugins, $this->settings);
		echo $session->login($_POST['user'], $_POST['password']);

	}

	private function logout() {

		$session = new Session($this->plugins, $this->settings);
		echo $session->logout();

	}

	# $_GET functions

	private function getAlbumArchive() {

		Module::dependencies(isset($_GET['albumID'], $_GET['password']));
		$album = new Album($this->database, $this->plugins, $this->settings, $_GET['albumID']);

		if ($album->getPublic()&&$album->getDownloadable()) {

			# Album Public
			if ($album->checkPassword($_GET['password'])) $album->getArchive();
			else exit('Warning: Wrong password!');

		} else {

			# Album Private
			exit('Warning: Album private or not downloadable!');

		}

	}

	private function getPhotoArchive() {

		Module::dependencies(isset($_GET['photoID'], $_GET['password']));
		$photo = new Photo($this->database, $this->plugins, null, $_GET['photoID']);

		# Photo Download
		if ($photo->getPublic($_GET['password'])) {

			# Photo Public
			$photo->getArchive();

		} else {

			# Photo Private
			exit('Warning: Photo private or not downloadable!');

		}

	}

}

?>