<?php

/**
 * @name		Upload Module
 * @author		Philipp Maurer
 * @author		Tobias Reich
 * @copyright	2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function importPhoto($path, $albumID = 0, $description = '', $tags = '') {

	$info = getimagesize($path);
	$size = filesize($path);

	$nameFile					= array(array());
	$nameFile[0]['name']		= $path;
	$nameFile[0]['type']		= $info['mime'];
	$nameFile[0]['tmp_name']	= $path;
	$nameFile[0]['error']		= 0;
	$nameFile[0]['size']		= $size;

	return upload($nameFile, $albumID, $description, $tags);

}

function importUrl($url, $albumID = 0) {

	if (strpos($url, ',')!==false) {

		// Multiple photos

		$url = explode(',', $url);

		foreach ($url as &$key) {

			$key = str_replace(' ', '%20', $key);

			if (@getimagesize($key)) {

				$pathinfo = pathinfo($key);
				$filename = $pathinfo['filename'].".".$pathinfo['extension'];
				$tmp_name = __DIR__ . '/../../uploads/import/' . $filename;

				copy($key, $tmp_name);

			}

		}

		return importServer($albumID);

	} else {

		// One photo

		$url = str_replace(' ', '%20', $url);

		if (@getimagesize($url)) {

			$pathinfo = pathinfo($url);
			$filename = $pathinfo['filename'].".".$pathinfo['extension'];
			$tmp_name = __DIR__ . "/../../uploads/import/$filename";

			copy($url, $tmp_name);

			return importPhoto($tmp_name, $albumID);

		}

	}

	return false;

}

function importServer($albumID = 0, $path) {

	if (!isset($path)) $path = __DIR__ . '/../../uploads/import/';

	global $database;

	$files			= glob($path . '*');
	$contains['photos']	= false;
	$contains['albums']	= false;

	foreach ($files as $file) {

		if (@getimagesize($file)) {

			// Photo
			if (!importPhoto($file, $albumID)) return false;
			$contains['photos'] = true;

		} else if (is_dir($file)) {

			$name		= mysqli_real_escape_string($database, basename($file));
			$newAlbumID	= addAlbum('[Import] ' . $name);

			if ($newAlbumID!==false) importServer($newAlbumID, $file . '/');
			$contains['albums'] = true;

		}

	}

	if ($contains['photos']===false&&$contains['albums']===false) return "Warning: Folder empty!";
	if ($contains['photos']===false&&$contains['albums']===true) return "Notice: Import only contains albums!";
	return true;

}

?>