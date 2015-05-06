<?php

###
# @name			Upload Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Import extends Module {

	static function photo($database, $plugins, $settings, $path, $albumID = 0, $description = '', $tags = '') {

		# No need to validate photo type and extension in this function.
		# $photo->add will take care of it.

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

	static function video($database, $plugins, $settings, $path, $albumID = 0, $description = '', $tags = '') {

		$size	= filesize($path);
		$video	= new Video($database, $plugins, $settings, null);

		$nameFile					= array(array());
		$nameFile[0]['name']		= $path;
		$nameFile[0]['type']		= Video::getMimeType($path);
		$nameFile[0]['tmp_name']	= $path;
		$nameFile[0]['error']		= 0;
		$nameFile[0]['size']		= $size;

		if (!$video->add($nameFile, $albumID, $description, $tags)) return false;
		return true;

	}

	static function url($urls, $albumID = 0) {

		$error = false;

		# Parse
		$urls = str_replace(' ', '%20', $urls);
		$urls = explode(',', $urls);

		foreach ($urls as &$url) {

			# Verify extension
			$extension = getExtension($url);
			if (!in_array(strtolower($extension), Photo::$validExtensions, true)) {
				$error = true;
				continue;
			}

			# Verify image
			$type = @exif_imagetype($url);
			if (!in_array($type, Photo::$validTypes, true)) {
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

		global $database, $plugins, $settings;

		# Parse path
		if (!isset($path)) $path = LYCHEE_UPLOADS_IMPORT;
		if (substr($path, -1)==='/') $path = substr($path, 0, -1);

		if (is_dir($path)===false) {
			Log::error($database, __METHOD__, __LINE__, 'Given path is not a directory (' . $path . ')');
			return 'Error: Given path is not a directory!';
		}

		# Skip folders of Lychee
		if ($path===LYCHEE_UPLOADS_BIG||($path . '/')===LYCHEE_UPLOADS_BIG||
			$path===LYCHEE_UPLOADS_MEDIUM||($path . '/')===LYCHEE_UPLOADS_MEDIUM||
			$path===LYCHEE_UPLOADS_THUMB||($path . '/')===LYCHEE_UPLOADS_THUMB) {
				Log::error($database, __METHOD__, __LINE__, 'The given path is a reserved path of Lychee (' . $path . ')');
				return 'Error: Given path is a reserved path of Lychee!';
		}

		$error				= false;
		$contains['photos']	= false;
		$contains['albums']	= false;

		# Invoke plugins directly, as instance method not valid here
		# Note that updated albumId and path explicitly passed, rather
		# than using func_get_args() which will only return original ones
		$plugins->activate(__METHOD__ . ":before", array($albumID, $path));

		# Get all files
		$files = glob($path . '/*');

		foreach ($files as $file) {

			# It is possible to move a file because of directory permissions but
			# the file may still be unreadable by the user
			if (!is_readable($file)) {
				$error = true;
				Log::error($database, __METHOD__, __LINE__, 'Could not read file or directory: ' . $file);
				continue;
			}

			if (@exif_imagetype($file)!==false) {

				# Photo

				if ( ! Import::photo( $database, $plugins, $settings, $file, $albumID ) ) {
					$error = true;
					Log::error( $database, __METHOD__, __LINE__, 'Could not import file: ' . $file );
					continue;
				}
				$contains['photos'] = true;

			} else if (Video::getMimeType($file)!== false) {

				# Video

				if ( ! Import::video( $database, $plugins, $settings, $file, $albumID ) ) {
					$error = true;
					Log::error( $database, __METHOD__, __LINE__, 'Could not import file: ' . $file );
					continue;
				}
				$contains['videos'] = true;

			} else if (is_dir($file)) {

				# Folder

				$name				= mysqli_real_escape_string($database, basename($file));
				$album				= new Album($database, null, null, null);
				$newAlbumID			= $album->add('[Import] ' . $name);
				$contains['albums']	= true;

				if ($newAlbumID===false) {
					$error = true;
					Log::error($database, __METHOD__, __LINE__, 'Could not create album in Lychee (' . $newAlbumID . ')');
					continue;
				}

				$import = Import::server($newAlbumID, $file . '/');

				if ($import!==true&&$import!=='Notice: Import only contains albums!') {
					$error = true;
					Log::error($database, __METHOD__, __LINE__, 'Could not import folder. Function returned warning');
					continue;
				}

			}

		}

		# Invoke plugins directly, as instance method not valid here
		# Note that updated albumId and path explicitly passed, rather
		# than using func_get_args() which will only return original ones
		$plugins->activate(__METHOD__ . ":after", array($albumID, $path));

		if ($contains['photos']===false&&$contains['videos']===false&&$contains['albums']===false)	return 'Warning: Folder empty or no readable files to process!';
		if ($contains['photos']===false&&$contains['albums']===true)	return 'Notice: Import only contains albums!';
		return true;

	}

}

?>
