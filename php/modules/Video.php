<?php

###
# @name			Video Module
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Video extends Module {

	private $database	= null;
	private $settings	= null;
	private $videoIDs	= null;

	public static $allowedMimeTypes = array(
		# support Playback via MediaElement.js
		'video/mp4' => '.mp4',
		'video/ogg' => '.ogv',
		'video/webm' => '.webm',
		'video/x-flv' => '.flv',
		'video/x-ms-wmv' => '.wmv',

		# support Download
		'video/x-msvideo' => '.avi',
		'video/quicktime' => '.mov',
		'video/x-matroska' => '.mkv',
	);

	protected static $finfo_mime = false;

	public static function getMimeType($path) {
		# create finfo resource if it doesn't exist
		if ( ! self::$finfo_mime ) {
			self::$finfo_mime = finfo_open(FILEINFO_MIME_TYPE);
		}

		if ( is_array($path) && isset($path['name']) ) {
			$path = $path['name'];
		}

		# get mime type
		$mime_type = finfo_file( self::$finfo_mime, $path );

		# check if allowed
		if ( ! isset(self::$allowedMimeTypes[$mime_type]) ) {
			return false;
		}

		return $mime_type;
	}

	public function __construct($database, $plugins, $settings, $videoIDs) {

		# Init vars
		$this->database	= $database;
		$this->plugins	= $plugins;
		$this->settings	= $settings;
		$this->videoIDs	= $videoIDs;

		return true;

	}

	public function add($files, $albumID, $description = '', $tags = '') {

		# Check dependencies
		self::dependencies( isset( $this->database ) );

		# Check permissions
		if ( hasPermissions( LYCHEE_UPLOADS ) === false ||
		     hasPermissions( LYCHEE_UPLOADS_BIG ) === false ||
		     hasPermissions( LYCHEE_UPLOADS_THUMB ) === false
		) {
			Log::error( $this->database,
				__METHOD__,
				__LINE__,
				'An upload-folder is missing or not readable and writable' );
			exit( 'Error: An upload-folder is missing or not readable and writable!' );
		}

		# Call plugins
		$this->plugins( __METHOD__, 0, func_get_args() );

		switch ( $albumID ) {

			case 's':
				# s for public (share)
				$public  = 1;
				$star    = 0;
				$albumID = 0;
				break;

			case 'f':
				# f for starred (fav)
				$star    = 1;
				$public  = 0;
				$albumID = 0;
				break;

			case 'r':
				# r for recent
				$public  = 0;
				$star    = 0;
				$albumID = 0;
				break;

			default:
				$star   = 0;
				$public = 0;
				break;

		}

		foreach ( $files as $file ) {

			# Verify file and set extension
			$mime_type = Video::getMimeType($file);
			if ( $mime_type === false ) {
				Log::error($this->database, __METHOD__, __LINE__, 'Video format not supported');
				exit('Error: Video format not supported!');
			}
			$extension = self::$allowedMimeTypes[$mime_type];

			# Generate id
			$id = str_replace('.', '', microtime(true));
			while(strlen($id)<14) $id .= 0;

			# Set paths
			$tmp_name	= $file['tmp_name'];
			$video_name	= md5($id) . $extension;
			$path		= LYCHEE_UPLOADS_VIDEO . $video_name;

			# Create checksum based on $mime_type and $tmp_name
			$checksum = sha1_file($tmp_name);
			if ($checksum===false) {
				Log::error($this->database, __METHOD__, __LINE__, 'Could not calculate checksum for video');
				exit('Error: Could not calculate checksum for video!');
			}

			$exists = $this->exists($checksum);

			if ($exists!==false) {
				$video_name	= $exists['video_name'];
				$path		= $exists['path'];
				$exists		= true;
			}

			if ($exists===false) {

				# Import if not uploaded via web
				if (!is_uploaded_file($tmp_name)) {
					if (!@rename($tmp_name, $path)) {
						Log::error($this->database, __METHOD__, __LINE__, 'Could not move video to uploads');
						exit('Error: Could not move video to uploads!');
					}
				} else {
					if (!@move_uploaded_file($tmp_name, $path)) {
						Log::error($this->database, __METHOD__, __LINE__, 'Could not move video to uploads');
						exit('Error: Could not move video to uploads!');
					}
				}

			}

			$info = array();
			# Use title of file
			$info['title'] = substr(basename($file['name'], $extension), 0, 30);
			# Size
			$size = filesize($path)/1024;
			if ($size>=1024) $info['size'] = round($size/1024, 1) . ' MB';
			else $info['size'] = round($size, 1) . ' KB';

			# Save to DB
			$values	= array(LYCHEE_TABLE_PHOTOS, $id, $info['title'], $video_name, $description, $tags, $mime_type, 0, 0, $info['size'], '', '', '', '', '', '', '', '', $albumID, $public, $star, $checksum, '', 'video');
			$query	= Database::prepare($this->database, "INSERT INTO ? (id, title, url, description, tags, type, width, height, size, iso, aperture, make, model, shutter, focal, takestamp, thumbUrl, album, public, star, checksum, medium, media_type) VALUES ('?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?')", $values);
			$result = $this->database->query($query);

			if (!$result) {
				Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
				exit('Error: Could not save video in database!');
			}

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;
	}

	protected function exists($checksum, $videoID = null) {

		# Check dependencies
		self::dependencies(isset($this->database, $checksum));

		# Exclude $videoID from select when $videoID is set
		if (!is_null($videoID)) $query = Database::prepare($this->database, "SELECT id, url FROM ? WHERE checksum = '?' AND id <> '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $checksum, $videoID));
		else $query = Database::prepare($this->database, "SELECT id, url FROM ? WHERE checksum = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $checksum));

		$result	= $this->database->query($query);

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, 'Could not check for existing videos with the same checksum');
			return false;
		}

		if ($result->num_rows===1) {

			$result = $result->fetch_object();

			$return = array(
				'video_name'	=> $result->url,
				'path'			=> LYCHEE_UPLOADS_VIDEO . $result->url,
			);

			return $return;

		}

		return false;

	}

}