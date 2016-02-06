<?php

namespace Lychee\Modules;

final class Validator {

	public static function required($available = false, $function) {

		if ($available===false) Response::error('Missing parameters. Can not execute function ' . $function);

		return true;

	}

	public static function isAlbumIDs($albumIDs) {

		return (preg_match('/^[0-9\,]{1,}$/', $albumIDs)===1 ? true : false);

	}

	public static function isAlbumID($albumID) {

		return (preg_match('/^[0-9sfr]{1,}$/', $albumID)===1 ? true : false);

	}

	public static function isPhotoIDs($photoIDs) {

		return (preg_match('/^[0-9\,]{1,}$/', $photoIDs)===1 ? true : false);

	}

	public static function isPhotoID($photoID) {

		return (preg_match('/^[0-9]{14}$/', $photoID)===1 ? true : false);

	}

}

?>