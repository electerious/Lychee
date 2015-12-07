<?php

###
# @name			Upload Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Import extends Module {

	private $database	= null;
	private $settings	= null;

	public function __construct($database, $plugins, $settings) {

		# Init vars
		$this->database	= $database;
		$this->plugins	= $plugins;
		$this->settings	= $settings;

		return true;

	}

	private function photo($path, $albumID = 0, $description = '', $tags = '') {

		# Check dependencies
		self::dependencies(isset($this->database, $this->plugins, $this->settings, $path));

		# No need to validate photo type and extension in this function.
		# $photo->add will take care of it.

		$info	= getimagesize($path);
		$size	= filesize($path);
		$photo	= new Photo($this->database, $this->plugins, $this->settings, null);

		$nameFile					= array(array());
		$nameFile[0]['name']		= $path;
		$nameFile[0]['type']		= $info['mime'];
		$nameFile[0]['tmp_name']	= $path;
		$nameFile[0]['error']		= 0;
		$nameFile[0]['size']		= $size;
		$nameFile[0]['error']		= UPLOAD_ERR_OK;

		if (!$photo->add($nameFile, $albumID, $description, $tags, true)) return false;
		return true;

	}

	public function url($urls, $albumID = 0) {

		# Check dependencies
		self::dependencies(isset($this->database, $urls));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		$error = false;

		# Parse URLs
		$urls = str_replace(' ', '%20', $urls);
		$urls = explode(',', $urls);

		foreach ($urls as &$url) {

			# Validate photo type and extension even when $this->photo (=> $photo->add) will do the same.
			# This prevents us from downloading invalid photos.

			# Verify extension
			$extension = getExtension($url);
			if (!in_array(strtolower($extension), Photo::$validExtensions, true)) {
				$error = true;
				Log::error($this->database, __METHOD__, __LINE__, 'Photo format not supported (' . $url . ')');
				continue;
			}

			# Verify image
			$type = @exif_imagetype($url);
			if (!in_array($type, Photo::$validTypes, true)) {
				$error = true;
				Log::error($this->database, __METHOD__, __LINE__, 'Photo type not supported (' . $url . ')');
				continue;
			}

			$pathinfo	= pathinfo($url);
			$filename	= $pathinfo['filename'] . '.' . $pathinfo['extension'];
			$tmp_name	= LYCHEE_DATA . $filename;

			if (@copy($url, $tmp_name)===false) {
				$error = true;
				Log::error($this->database, __METHOD__, __LINE__, 'Could not copy file (' . $tmp_name . ') to temp-folder (' . $tmp_name . ')');
				continue;
			}

			# Import photo
			if (!$this->photo($tmp_name, $albumID)) {
				$error = true;
				Log::error($this->database, __METHOD__, __LINE__, 'Could not import file: ' . $tmp_name);
				continue;
			}

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($error===false) return true;
		return false;

	}

	public function server($path, $albumID = 0) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->plugins, $this->settings));

		# Parse path
		if (!isset($path))				$path = LYCHEE_UPLOADS_IMPORT;
		if (substr($path, -1)==='/')	$path = substr($path, 0, -1);

		if (is_dir($path)===false) {
			Log::error($this->database, __METHOD__, __LINE__, 'Given path is not a directory (' . $path . ')');
			return 'Error: Given path is not a directory!';
		}

		# Skip folders of Lychee
		if ($path===LYCHEE_UPLOADS_BIG||($path . '/')===LYCHEE_UPLOADS_BIG||
			$path===LYCHEE_UPLOADS_MEDIUM||($path . '/')===LYCHEE_UPLOADS_MEDIUM||
			$path===LYCHEE_UPLOADS_THUMB||($path . '/')===LYCHEE_UPLOADS_THUMB) {
				Log::error($this->database, __METHOD__, __LINE__, 'The given path is a reserved path of Lychee (' . $path . ')');
				return 'Error: Given path is a reserved path of Lychee!';
		}

		$error				= false;
		$contains['photos']	= false;
		$contains['albums']	= false;

		# Call plugins
		# Note that updated albumId and path explicitly passed, rather
		# than using func_get_args() which will only return original ones
		$this->plugins(__METHOD__, 0, array($albumID, $path));

		# Get all files
		$files = glob($path . '/*');

		foreach ($files as $file) {

			# It is possible to move a file because of directory permissions but
			# the file may still be unreadable by the user
			if (!is_readable($file)) {
				$error = true;
				Log::error($this->database, __METHOD__, __LINE__, 'Could not read file or directory: ' . $file);
				continue;
			}

			if (@exif_imagetype($file)!==false) {

				# Photo

				$contains['photos'] = true;

				if (!$this->photo($file, $albumID)) {
					$error = true;
					Log::error($this->database, __METHOD__, __LINE__, 'Could not import file: ' . $file);
					continue;
				}

			} else if (is_dir($file)) {

				# Folder

				$album				= new Album($this->database, $this->plugins, $this->settings, null);
				$newAlbumID			= $album->add('[Import] ' . basename($file));
				$contains['albums']	= true;

				if ($newAlbumID===false) {
					$error = true;
					Log::error($this->database, __METHOD__, __LINE__, 'Could not create album in Lychee (' . $newAlbumID . ')');
					continue;
				}

				$import = $this->server($file . '/', $newAlbumID);

				if ($import!==true&&$import!=='Notice: Import only contains albums!') {
					$error = true;
					Log::error($this->database, __METHOD__, __LINE__, 'Could not import folder. Function returned warning.');
					continue;
				}

			}

		}

		# Call plugins
		# Note that updated albumId and path explicitly passed, rather
		# than using func_get_args() which will only return original ones
		$this->plugins(__METHOD__, 1, array($albumID, $path));

		# The following returns will be caught in the front-end
		if ($contains['photos']===false&&$contains['albums']===false)	return 'Warning: Folder empty or no readable files to process!';
		if ($contains['photos']===false&&$contains['albums']===true)	return 'Notice: Import only contained albums!';

		if ($error===true) return false;
		return true;

	}

}

?>
