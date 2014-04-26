<?php

###
# @name			Upload Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Import extends Module {

	static function photo($database, $plugins, $settings, $path, $albumID = 0, $description = '', $tags = '') {

		$info	= getimagesize($path);
		$size	= filesize($path);
		$photo	= new Photo($database, $plugins, $settings, null);

		$nameFile					= array(array());
		$nameFile[0]['name']		= $path;
		$nameFile[0]['type']		= $info['mime'];
		$nameFile[0]['tmp_name']	= $path;
		$nameFile[0]['error']		= 0;
		$nameFile[0]['size']		= $size;

		if (!$photo->add($nameFile, $albumID, $description, $tags)) return false;
		return true;

	}

	static function url($urls, $albumID = 0) {

		$error = false;

		# Parse
		$urls = str_replace(' ', '%20', $urls);
		$urls = explode(',', $urls);

		foreach ($urls as &$url) {

			if (@exif_imagetype($url)===false) {
				$error = true;
				continue;
			}

			$pathinfo	= pathinfo($url);
			$filename	= $pathinfo['filename'] . '.' . $pathinfo['extension'];
			$tmp_name	= LYCHEE_DATA . $filename;

			if (@copy($url, $tmp_name)===false) $error = true;

		}

		$import = Import::server($albumID, LYCHEE_DATA);

		if ($error===false&&$import===true) return true;
		else return false;

	}

	static function server($albumID = 0, $path) {

		if (!isset($path)) $path = LYCHEE_UPLOADS_IMPORT;

		global $database, $plugins, $settings;

		$files				= glob($path . '*');
		$contains['photos']	= false;
		$contains['albums']	= false;

		foreach ($files as $file) {

			if (@exif_imagetype($file)!==false) {

				# Photo

				if (!Import::photo($database, $plugins, $settings, $file, $albumID)) return false;
				$contains['photos'] = true;

			} else if (is_dir($file)) {

				# Folder

				$name		= mysqli_real_escape_string($database, basename($file));
				$album		= new Album($database, null, null, null);
				$newAlbumID	= $album->add('[Import] ' . $name);

				if ($newAlbumID!==false) Import::server($newAlbumID, $file . '/');
				$contains['albums'] = true;

			}

		}

		if ($contains['photos']===false&&$contains['albums']===false)	return 'Warning: Folder empty!';
		if ($contains['photos']===false&&$contains['albums']===true)	return 'Notice: Import only contains albums!';
		return true;

	}

}

?>