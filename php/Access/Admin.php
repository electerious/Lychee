<?php

namespace Lychee\Access;

use Lychee\Modules\Album;
use Lychee\Modules\Import;
use Lychee\Modules\Photo;
use Lychee\Modules\Response;
use Lychee\Modules\Session;
use Lychee\Modules\Settings;
use Lychee\Modules\Validator;

final class Admin extends Access {

	public static function init($fn) {

		switch ($fn) {

			// Album functions
			case 'Album::getAll':           self::getAlbumsAction(); break;
			case 'Album::get':              self::getAlbumAction(); break;
			case 'Album::add':              self::addAlbumAction(); break;
			case 'Album::setTitle':         self::setAlbumTitleAction(); break;
			case 'Album::setDescription':   self::setAlbumDescriptionAction(); break;
			case 'Album::setPublic':        self::setAlbumPublicAction(); break;
			case 'Album::delete':           self::deleteAlbumAction(); break;
			case 'Album::merge':            self::mergeAlbumsAction(); break;

			// Photo functions
			case 'Photo::get':              self::getPhotoAction(); break;
			case 'Photo::setTitle':         self::setPhotoTitleAction(); break;
			case 'Photo::setDescription':   self::setPhotoDescriptionAction(); break;
			case 'Photo::setStar':          self::setPhotoStarAction(); break;
			case 'Photo::setPublic':        self::setPhotoPublicAction(); break;
			case 'Photo::setAlbum':         self::setPhotoAlbumAction(); break;
			case 'Photo::setTags':          self::setPhotoTagsAction(); break;
			case 'Photo::duplicate':        self::duplicatePhotoAction(); break;
			case 'Photo::delete':           self::deletePhotoAction(); break;

			// Add functions
			case 'Photo::add':              self::uploadAction(); break;
			case 'Import::url':             self::importUrlAction(); break;
			case 'Import::server':          self::importServerAction(); break;

			// Search functions
			case 'search':                  self::searchAction(); break;

			// Session functions
			case 'Session::init':           self::initAction(); break;
			case 'Session::login':          self::loginAction(); break;
			case 'Session::logout':         self::logoutAction(); break;

			// Settings functions
			case 'Settings::setLogin':      self::setLoginAction(); break;
			case 'Settings::setSorting':    self::setSortingAction(); break;
			case 'Settings::setDropboxKey': self::setDropboxKeyAction(); break;

			// $_GET functions
			case 'Album::getArchive':       self::getAlbumArchiveAction(); break;
			case 'Photo::getArchive':       self::getPhotoArchiveAction(); break;

		}

		self::fnNotFound();

	}

	// Album functions

	private static function getAlbumsAction() {

		$album = new Album(null);
		Response::json($album->getAll(false));

	}

	private static function getAlbumAction() {

		Validator::required(isset($_POST['albumID']), __METHOD__);

		$album = new Album($_POST['albumID']);
		Response::json($album->get());

	}

	private static function addAlbumAction() {

		Validator::required(isset($_POST['title']), __METHOD__);

		$album = new Album(null);
		echo $album->add($_POST['title']);

	}

	private static function setAlbumTitleAction() {

		Validator::required(isset($_POST['albumIDs'], $_POST['title']), __METHOD__);

		$album = new Album($_POST['albumIDs']);
		echo $album->setTitle($_POST['title']);

	}

	private static function setAlbumDescriptionAction() {

		Validator::required(isset($_POST['albumID'], $_POST['description']), __METHOD__);

		$album = new Album($_POST['albumID']);
		echo $album->setDescription($_POST['description']);

	}

	private static function setAlbumPublicAction() {

		Validator::required(isset($_POST['albumID'], $_POST['password'], $_POST['visible'], $_POST['downloadable']), __METHOD__);

		$album = new Album($_POST['albumID']);
		echo $album->setPublic($_POST['public'], $_POST['password'], $_POST['visible'], $_POST['downloadable']);

	}

	private static function deleteAlbumAction() {

		Validator::required(isset($_POST['albumIDs']), __METHOD__);

		$album = new Album($_POST['albumIDs']);
		echo $album->delete();

	}

	private static function mergeAlbumsAction() {

		Validator::required(isset($_POST['albumIDs']), __METHOD__);
		$album = new Album($_POST['albumIDs']);
		echo $album->merge();

	}

	// Photo functions

	private static function getPhotoAction() {

		Validator::required(isset($_POST['photoID'], $_POST['albumID']), __METHOD__);

		$photo = new Photo($_POST['photoID']);
		Response::json($photo->get($_POST['albumID']));

	}

	private static function setPhotoTitleAction() {

		Validator::required(isset($_POST['photoIDs'], $_POST['title']), __METHOD__);

		$photo = new Photo($_POST['photoIDs']);
		echo $photo->setTitle($_POST['title']);

	}

	private static function setPhotoDescriptionAction() {

		Validator::required(isset($_POST['photoID'], $_POST['description']), __METHOD__);

		$photo = new Photo($_POST['photoID']);
		echo $photo->setDescription($_POST['description']);

	}

	private static function setPhotoStarAction() {

		Validator::required(isset($_POST['photoIDs']), __METHOD__);

		$photo = new Photo($_POST['photoIDs']);
		echo $photo->setStar();

	}

	private static function setPhotoPublicAction() {

		Validator::required(isset($_POST['photoID']), __METHOD__);

		$photo = new Photo($_POST['photoID']);
		echo $photo->setPublic();

	}

	private static function setPhotoAlbumAction() {

		Validator::required(isset($_POST['photoIDs'], $_POST['albumID']), __METHOD__);

		$photo = new Photo($_POST['photoIDs']);
		echo $photo->setAlbum($_POST['albumID']);

	}

	private static function setPhotoTagsAction() {

		Validator::required(isset($_POST['photoIDs'], $_POST['tags']), __METHOD__);

		$photo = new Photo($_POST['photoIDs']);
		echo $photo->setTags($_POST['tags']);

	}

	private static function duplicatePhotoAction() {

		Validator::required(isset($_POST['photoIDs']), __METHOD__);

		$photo = new Photo($_POST['photoIDs']);
		echo $photo->duplicate();

	}

	private static function deletePhotoAction() {

		Validator::required(isset($_POST['photoIDs']), __METHOD__);

		$photo = new Photo($_POST['photoIDs']);
		echo $photo->delete();

	}

	// Add functions

	private static function uploadAction() {

		Validator::required(isset($_FILES, $_POST['albumID'], $_POST['tags']), __METHOD__);

		$photo = new Photo(null);
		echo $photo->add($_FILES, $_POST['albumID'], '', $_POST['tags']);

	}

	private static function importUrlAction() {

		Validator::required(isset($_POST['url'], $_POST['albumID']), __METHOD__);

		$import = new Import();
		echo $import->url($_POST['url'], $_POST['albumID']);

	}

	private static function importServerAction() {

		Validator::required(isset($_POST['albumID'], $_POST['path']), __METHOD__);

		$import = new Import();
		echo $import->server($_POST['path'], $_POST['albumID']);

	}

	// Search functions

	private static function searchAction() {

		Validator::required(isset($_POST['term']), __METHOD__);

		Response::json(search($_POST['term']));

	}

	// Session functions

	private static function initAction() {

		$session = new Session();
		Response::json($session->init(false));

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

	// Settings functions

	private static function setLoginAction() {

		Validator::required(isset($_POST['username'], $_POST['password']), __METHOD__);

		if (isset($_POST['oldPassword'])===false) $_POST['oldPassword'] = '';
		echo Settings::setLogin($_POST['oldPassword'], $_POST['username'], $_POST['password']);

	}

	private static function setSortingAction() {

		Validator::required(isset($_POST['typeAlbums'], $_POST['orderAlbums'], $_POST['typePhotos'], $_POST['orderPhotos']), __METHOD__);

		$sA = Settings::setSortingAlbums($_POST['typeAlbums'], $_POST['orderAlbums']);
		$sP = Settings::setSortingPhotos($_POST['typePhotos'], $_POST['orderPhotos']);

		if ($sA===true&&$sP===true) echo true;
		else                        echo false;

	}

	private static function setDropboxKeyAction() {

		Validator::required(isset($_POST['key']), __METHOD__);

		echo Settings::setDropboxKey($_POST['key']);

	}

	// Get functions

	private static function getAlbumArchiveAction() {

		Validator::required(isset($_GET['albumID']), __METHOD__);

		$album = new Album($_GET['albumID']);
		$album->getArchive();

	}

	private static function getPhotoArchiveAction() {

		Validator::required(isset($_GET['photoID']), __METHOD__);

		$photo = new Photo($_GET['photoID']);
		$photo->getArchive();

	}

}

?>