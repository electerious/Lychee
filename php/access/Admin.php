<?php

###
# @name			Admin Access
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');
if (!defined('LYCHEE_ACCESS_ADMIN')) exit('Error: You are not allowed to access this area!');

class Admin extends Access {

	public function check($fn) {

		switch ($fn) {

			# Album functions
			case 'getAlbums':			$this->getAlbums(); break;
			case 'getAlbum':			$this->getAlbum(); break;
			case 'addAlbum':			$this->addAlbum(); break;
			case 'setAlbumTitle':		$this->setAlbumTitle(); break;
			case 'setAlbumDescription':	$this->setAlbumDescription(); break;
			case 'setAlbumPublic':		$this->setAlbumPublic(); break;
			case 'deleteAlbum':			$this->deleteAlbum(); break;

			# Photo functions
			case 'getPhoto':			$this->getPhoto(); break;
			case 'setPhotoTitle':		$this->setPhotoTitle(); break;
			case 'setPhotoDescription':	$this->setPhotoDescription(); break;
			case 'setPhotoStar':		$this->setPhotoStar(); break;
			case 'setPhotoPublic':		$this->setPhotoPublic(); break;
			case 'setPhotoAlbum':		$this->setPhotoAlbum(); break;
			case 'setPhotoTags':		$this->setPhotoTags(); break;
			case 'duplicatePhoto':		$this->duplicatePhoto(); break;
			case 'deletePhoto':			$this->deletePhoto(); break;

			# Add functions
			case 'upload':				$this->upload(); break;
			case 'importUrl':			$this->importUrl(); break;
			case 'importServer':		$this->importServer(); break;

			# Search functions
			case 'search':				$this->search(); break;

			# Session functions
			case 'init':				$this->init(); break;
			case 'login':				$this->login(); break;
			case 'logout':				$this->logout(); break;

			# Settings functions
			case 'setLogin':			$this->setLogin(); break;
			case 'setSorting':			$this->setSorting(); break;
			case 'setDropboxKey':		$this->setDropboxKey(); break;

			# $_GET functions
			case 'getAlbumArchive':		$this->getAlbumArchive(); break;
			case 'getPhotoArchive':		$this->getPhotoArchive(); break;

			# Error
			default:					exit('Error: Function not found! Please check the spelling of the called function.');
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