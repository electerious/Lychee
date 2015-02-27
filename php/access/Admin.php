<?php

###
# @name			Admin Access
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');
if (!defined('LYCHEE_ACCESS_ADMIN')) exit('Error: You are not allowed to access this area!');

class Admin extends Access {

	public function check($fn) {

		switch ($fn) {

			# Album functions
			case 'Album::getAll':			$this->getAlbums(); break;
			case 'Album::get':				$this->getAlbum(); break;
			case 'Album::add':				$this->addAlbum(); break;
			case 'Album::setTitle':			$this->setAlbumTitle(); break;
			case 'Album::setDescription':	$this->setAlbumDescription(); break;
			case 'Album::setPublic':		$this->setAlbumPublic(); break;
			case 'Album::delete':			$this->deleteAlbum(); break;

			# Photo functions
			case 'Photo::get':				$this->getPhoto(); break;
			case 'Photo::setTitle':			$this->setPhotoTitle(); break;
			case 'Photo::setDescription':	$this->setPhotoDescription(); break;
			case 'Photo::setStar':			$this->setPhotoStar(); break;
			case 'Photo::setPublic':		$this->setPhotoPublic(); break;
			case 'Photo::setAlbum':			$this->setPhotoAlbum(); break;
			case 'Photo::setTags':			$this->setPhotoTags(); break;
			case 'Photo::duplicate':		$this->duplicatePhoto(); break;
			case 'Photo::delete':			$this->deletePhoto(); break;

			# Add functions
			case 'Photo::add':				$this->upload(); break;
			case 'Import::url':				$this->importUrl(); break;
			case 'Import::server':			$this->importServer(); break;

			# Search functions
			case 'search':					$this->search(); break;

			# Session functions
			case 'Session::init':			$this->init(); break;
			case 'Session::login':			$this->login(); break;
			case 'Session::logout':			$this->logout(); break;

			# Settings functions
			case 'Settings::setLogin':		$this->setLogin(); break;
			case 'Settings::setSorting':	$this->setSorting(); break;
			case 'Settings::setDropboxKey':	$this->setDropboxKey(); break;

			# $_GET functions
			case 'Album::getArchive':		$this->getAlbumArchive(); break;
			case 'Photo::getArchive':		$this->getPhotoArchive(); break;

			# Error
			default:						exit('Error: Function not found! Please check the spelling of the called function.');
											return false; break;

		}

		return true;

	}

	# Album functions

	private function getAlbums() {

		$album = new Album($this->database, $this->plugins, $this->settings, null);
		echo json_encode($album->getAll(false));

	}

	private function getAlbum() {

		Module::dependencies(isset($_POST['albumID']));
		$album = new Album($this->database, $this->plugins, $this->settings, $_POST['albumID']);
		echo json_encode($album->get());

	}

	private function addAlbum() {

		Module::dependencies(isset($_POST['title']));
		$album = new Album($this->database, $this->plugins, $this->settings, null);
		echo $album->add($_POST['title']);

	}

	private function setAlbumTitle() {

		Module::dependencies(isset($_POST['albumIDs'], $_POST['title']));
		$album = new Album($this->database, $this->plugins, $this->settings, $_POST['albumIDs']);
		echo $album->setTitle($_POST['title']);

	}

	private function setAlbumDescription() {

		Module::dependencies(isset($_POST['albumID'], $_POST['description']));
		$album = new Album($this->database, $this->plugins, $this->settings, $_POST['albumID']);
		echo $album->setDescription($_POST['description']);

	}

	private function setAlbumPublic() {

		Module::dependencies(isset($_POST['albumID'], $_POST['password'], $_POST['visible'], $_POST['downloadable']));
		$album = new Album($this->database, $this->plugins, $this->settings, $_POST['albumID']);
		echo $album->setPublic($_POST['password'], $_POST['visible'], $_POST['downloadable']);

	}

	private function deleteAlbum() {

		Module::dependencies(isset($_POST['albumIDs']));
		$album = new Album($this->database, $this->plugins, $this->settings, $_POST['albumIDs']);
		echo $album->delete();

	}

	# Photo functions

	private function getPhoto() {

		Module::dependencies(isset($_POST['photoID'], $_POST['albumID']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoID']);
		echo json_encode($photo->get($_POST['albumID']));

	}

	private function setPhotoTitle() {

		Module::dependencies(isset($_POST['photoIDs'], $_POST['title']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoIDs']);
		echo $photo->setTitle($_POST['title']);

	}

	private function setPhotoDescription() {

		Module::dependencies(isset($_POST['photoID'], $_POST['description']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoID']);
		echo $photo->setDescription($_POST['description']);

	}

	private function setPhotoStar() {

		Module::dependencies(isset($_POST['photoIDs']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoIDs']);
		echo $photo->setStar();

	}

	private function setPhotoPublic() {

		Module::dependencies(isset($_POST['photoID']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoID']);
		echo $photo->setPublic();

	}

	private function setPhotoAlbum() {

		Module::dependencies(isset($_POST['photoIDs'], $_POST['albumID']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoIDs']);
		echo $photo->setAlbum($_POST['albumID']);

	}

	private function setPhotoTags() {

		Module::dependencies(isset($_POST['photoIDs'], $_POST['tags']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoIDs']);
		echo $photo->setTags($_POST['tags']);

	}

	private function duplicatePhoto() {

		Module::dependencies(isset($_POST['photoIDs']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoIDs']);
		echo $photo->duplicate();

	}

	private function deletePhoto() {

		Module::dependencies(isset($_POST['photoIDs']));
		$photo = new Photo($this->database, $this->plugins, null, $_POST['photoIDs']);
		echo $photo->delete();

	}

	# Add functions

	private function upload() {

		Module::dependencies(isset($_FILES, $_POST['albumID'], $_POST['tags']));
		$photo = new Photo($this->database, $this->plugins, $this->settings, null);
		echo $photo->add($_FILES, $_POST['albumID'], '', $_POST['tags']);

	}

	private function importUrl() {

		Module::dependencies(isset($_POST['url'], $_POST['albumID']));
		echo Import::url($_POST['url'], $_POST['albumID']);

	}

	private function importServer() {

		Module::dependencies(isset($_POST['albumID'], $_POST['path']));
		echo Import::server($_POST['albumID'], $_POST['path']);

	}

	# Search function

	private function search() {

		Module::dependencies(isset($_POST['term']));
		echo json_encode(search($this->database, $this->settings, $_POST['term']));

	}

	# Session functions

	private function init() {

		global $dbName;

		Module::dependencies(isset($_POST['version']));
		$session = new Session($this->plugins, $this->settings);
		echo json_encode($session->init($this->database, $dbName, false, $_POST['version']));

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

	# Settings functions

	private function setLogin() {

		Module::dependencies(isset($_POST['username'], $_POST['password']));
		if (!isset($_POST['oldPassword'])) $_POST['oldPassword'] = '';
		$this->settings = new Settings($this->database);
		echo $this->settings->setLogin($_POST['oldPassword'], $_POST['username'], $_POST['password']);

	}

	private function setSorting() {

		Module::dependencies(isset($_POST['type'], $_POST['order']));
		$this->settings = new Settings($this->database);
		echo $this->settings->setSorting($_POST['type'], $_POST['order']);

	}

	private function setDropboxKey() {

		Module::dependencies(isset($_POST['key']));
		$this->settings = new Settings($this->database);
		echo $this->settings->setDropboxKey($_POST['key']);

	}

	# Get functions

	private function getAlbumArchive() {

		Module::dependencies(isset($_GET['albumID']));
		$album = new Album($this->database, $this->plugins, $this->settings, $_GET['albumID']);
		$album->getArchive();

	}

	private function getPhotoArchive() {

		Module::dependencies(isset($_GET['photoID']));
		$photo = new Photo($this->database, $this->plugins, null, $_GET['photoID']);
		$photo->getArchive();

	}

}