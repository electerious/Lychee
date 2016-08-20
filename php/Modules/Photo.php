<?php

namespace Lychee\Modules;

use ZipArchive;
use Imagick;
use ImagickPixel;

final class Photo {

	private $photoIDs = null;

	public static $validTypes = array(
		IMAGETYPE_JPEG,
		IMAGETYPE_GIF,
		IMAGETYPE_PNG
	);

	public static $validExtensions = array(
		'.jpg',
		'.jpeg',
		'.png',
		'.gif'
	);

	/**
	 * @return boolean Returns true when successful.
	 */
	public function __construct($photoIDs) {

		// Init vars
		$this->photoIDs = $photoIDs;

		return true;

	}

	/**
	 * Creats new photo(s).
	 * Exits on error.
	 * Use $returnOnError if you want to handle errors by your own.
	 * @return string|false ID of the added photo.
	 */
	public function add(array $files, $albumID = 0, $returnOnError = false) {

		// Check permissions
		if (hasPermissions(LYCHEE_UPLOADS)===false||
			hasPermissions(LYCHEE_UPLOADS_BIG)===false||
			hasPermissions(LYCHEE_UPLOADS_THUMB)===false) {
				Log::error(Database::get(), __METHOD__, __LINE__, 'An upload-folder is missing or not readable and writable');
				if ($returnOnError===true) return false;
				Response::error('An upload-folder is missing or not readable and writable!');
		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		switch($albumID) {

			case 's':
				// s for public (share)
				$public  = 1;
				$star    = 0;
				$albumID = 0;
				break;

			case 'f':
				// f for starred (fav)
				$star    = 1;
				$public  = 0;
				$albumID = 0;
				break;

			case 'r':
				// r for recent
				$public  = 0;
				$star    = 0;
				$albumID = 0;
				break;

			default:
				$star   = 0;
				$public = 0;
				break;

		}

		// Only process the first photo in the array
		$file = $files[0];

		// Check if file exceeds the upload_max_filesize directive
		if ($file['error']===UPLOAD_ERR_INI_SIZE) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'The uploaded file exceeds the upload_max_filesize directive in php.ini');
			if ($returnOnError===true) return false;
			Response::error('The uploaded file exceeds the upload_max_filesize directive in php.ini!');
		}

		// Check if file was only partially uploaded
		if ($file['error']===UPLOAD_ERR_PARTIAL) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'The uploaded file was only partially uploaded');
			if ($returnOnError===true) return false;
			Response::error('The uploaded file was only partially uploaded!');
		}

		// Check if writing file to disk failed
		if ($file['error']===UPLOAD_ERR_CANT_WRITE) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Failed to write photo to disk');
			if ($returnOnError===true) return false;
			Response::error('Failed to write photo to disk!');
		}

		// Check if a extension stopped the file upload
		if ($file['error']===UPLOAD_ERR_EXTENSION) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'A PHP extension stopped the file upload');
			if ($returnOnError===true) return false;
			Response::error('A PHP extension stopped the file upload!');
		}

		// Check if the upload was successful
		if ($file['error']!==UPLOAD_ERR_OK) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Upload contains an error (' . $file['error'] . ')');
			if ($returnOnError===true) return false;
			Response::error('Upload failed!');
		}

		// Verify extension
		$extension = getExtension($file['name'], false);
		if (!in_array(strtolower($extension), self::$validExtensions, true)) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Photo format not supported');
			if ($returnOnError===true) return false;
			Response::error('Photo format not supported!');
		}

		// Verify image
		$type = @exif_imagetype($file['tmp_name']);
		if (!in_array($type, self::$validTypes, true)) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Photo type not supported');
			if ($returnOnError===true) return false;
			Response::error('Photo type not supported!');
		}

		// Generate id
		$id = generateID();

		// Set paths
		$tmp_name   = $file['tmp_name'];
		$photo_name = md5($id) . $extension;
		$path       = LYCHEE_UPLOADS_BIG . $photo_name;

		// Calculate checksum
		$checksum = sha1_file($tmp_name);
		if ($checksum===false) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not calculate checksum for photo');
			if ($returnOnError===true) return false;
			Response::error('Could not calculate checksum for photo!');
		}

		// Check if image exists based on checksum
		if ($checksum===false) {

			$checksum = '';
			$exists   = false;

		} else {

			$exists = $this->exists($checksum);

			if ($exists!==false) {
				$photo_name = $exists['photo_name'];
				$path       = $exists['path'];
				$path_thumb = $exists['path_thumb'];
				$medium     = ($exists['medium']==='1' ? 1 : 0);
				$exists     = true;
			}

		}

		if ($exists===false) {

			// Import if not uploaded via web
			if (!is_uploaded_file($tmp_name)) {
				if (!@copy($tmp_name, $path)) {
					Log::error(Database::get(), __METHOD__, __LINE__, 'Could not copy photo to uploads');
					if ($returnOnError===true) return false;
					Response::error('Could not copy photo to uploads!');
				} else @unlink($tmp_name);
			} else {
				if (!@move_uploaded_file($tmp_name, $path)) {
					Log::error(Database::get(), __METHOD__, __LINE__, 'Could not move photo to uploads');
					if ($returnOnError===true) return false;
					Response::error('Could not move photo to uploads!');
				}
			}

		} else {

			// Photo already exists
			// Check if the user wants to skip duplicates
			if (Settings::get()['skipDuplicates']==='1') {
				Log::notice(Database::get(), __METHOD__, __LINE__, 'Skipped upload of existing photo because skipDuplicates is activated');
				if ($returnOnError===true) return false;
				Response::warning('This photo has been skipped because it\'s already in your library.');
			}

		}

		// Read infos
		$info = $this->getInfo($path);

		// Use title of file if IPTC title missing
		if ($info['title']==='') $info['title'] = substr(basename($file['name'], $extension), 0, 30);

		if ($exists===false) {

			// Set orientation based on EXIF data
			if ($file['type']==='image/jpeg'&&isset($info['orientation'])&&$info['orientation']!=='') {
				$adjustFile = $this->adjustFile($path, $info);
				if ($adjustFile!==false) $info = $adjustFile;
				else Log::notice(Database::get(), __METHOD__, __LINE__, 'Skipped adjustment of photo (' . $info['title'] . ')');
			}

			// Set original date
			if ($info['takestamp']!==''&&$info['takestamp']!==0) @touch($path, $info['takestamp']);

			// Create Thumb
			if (!$this->createThumb($path, $photo_name, $info['type'], $info['width'], $info['height'])) {
				Log::error(Database::get(), __METHOD__, __LINE__, 'Could not create thumbnail for photo');
				if ($returnOnError===true) return false;
				Response::error('Could not create thumbnail for photo!');
			}

			// Create Medium
			if ($this->createMedium($path, $photo_name, $info['width'], $info['height'])) $medium = 1;
			else $medium = 0;

			// Set thumb url
			$path_thumb = md5($id) . '.jpeg';

		}

		$values = array(LYCHEE_TABLE_PHOTOS, $id, $info['title'], $photo_name, $info['description'], $info['tags'], $info['type'], $info['width'], $info['height'], $info['size'], $info['iso'], $info['aperture'], $info['make'], $info['model'], $info['shutter'], $info['focal'], $info['takestamp'], $path_thumb, $albumID, $public, $star, $checksum, $medium);
		$query  = Database::prepare(Database::get(), "INSERT INTO ? (id, title, url, description, tags, type, width, height, size, iso, aperture, make, model, shutter, focal, takestamp, thumbUrl, album, public, star, checksum, medium) VALUES ('?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?')", $values);
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($result===false) {
			if ($returnOnError===true) return false;
			Response::error('Could not save photo in database!');
		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return $id;

	}

	/**
	 * @return array|false Returns a subset of a photo when same photo exists or returns false on failure.
	 */
	private function exists($checksum, $photoID = null) {

		// Exclude $photoID from select when $photoID is set
		if (isset($photoID)) $query = Database::prepare(Database::get(), "SELECT id, url, thumbUrl, medium FROM ? WHERE checksum = '?' AND id <> '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $checksum, $photoID));
		else                 $query = Database::prepare(Database::get(), "SELECT id, url, thumbUrl, medium FROM ? WHERE checksum = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $checksum));

		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($result===false) return false;

		if ($result->num_rows===1) {

			$result = $result->fetch_object();

			$return = array(
				'photo_name' => $result->url,
				'path'       => LYCHEE_UPLOADS_BIG . $result->url,
				'path_thumb' => $result->thumbUrl,
				'medium'     => $result->medium
			);

			return $return;

		}

		return false;

	}

	/**
	 * @return boolean Returns true when successful.
	 */
	private function createThumb($url, $filename, $type, $width, $height) {

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Quality of thumbnails
		$quality = 90;

		// Size of the thumbnail
		$newWidth  = 200;
		$newHeight = 200;

		$photoName = explode('.', $filename);
		$newUrl    = LYCHEE_UPLOADS_THUMB . $photoName[0] . '.jpeg';
		$newUrl2x  = LYCHEE_UPLOADS_THUMB . $photoName[0] . '@2x.jpeg';

		// Create thumbnails with Imagick
		if(Settings::hasImagick()) {

			// Read image
			$thumb = new Imagick();
			$thumb->readImage($url);
			$thumb->setImageCompressionQuality($quality);
			$thumb->setImageFormat('jpeg');

			// Remove metadata to save some bytes
			$thumb->stripImage();

			// Copy image for 2nd thumb version
			$thumb2x = clone $thumb;

			// Create 1st version
			$thumb->cropThumbnailImage($newWidth, $newHeight);
			$thumb->writeImage($newUrl);
			$thumb->clear();
			$thumb->destroy();

			// Create 2nd version
			$thumb2x->cropThumbnailImage($newWidth*2, $newHeight*2);
			$thumb2x->writeImage($newUrl2x);
			$thumb2x->clear();
			$thumb2x->destroy();

		} else {

			// Create image
			$thumb   = imagecreatetruecolor($newWidth, $newHeight);
			$thumb2x = imagecreatetruecolor($newWidth*2, $newHeight*2);

			// Set position
			if ($width<$height) {
				$newSize     = $width;
				$startWidth  = 0;
				$startHeight = $height/2 - $width/2;
			} else {
				$newSize     = $height;
				$startWidth  = $width/2 - $height/2;
				$startHeight = 0;
			}

			// Create new image
			switch($type) {
				case 'image/jpeg': $sourceImg = imagecreatefromjpeg($url); break;
				case 'image/png':  $sourceImg = imagecreatefrompng($url); break;
				case 'image/gif':  $sourceImg = imagecreatefromgif($url); break;
				default:           Log::error(Database::get(), __METHOD__, __LINE__, 'Type of photo is not supported');
				                   return false;
				                   break;
			}

			// Create thumb
			fastImageCopyResampled($thumb, $sourceImg, 0, 0, $startWidth, $startHeight, $newWidth, $newHeight, $newSize, $newSize);
			imagejpeg($thumb, $newUrl, $quality);
			imagedestroy($thumb);

			// Create retina thumb
			fastImageCopyResampled($thumb2x, $sourceImg, 0, 0, $startWidth, $startHeight, $newWidth*2, $newHeight*2, $newSize, $newSize);
			imagejpeg($thumb2x, $newUrl2x, $quality);
			imagedestroy($thumb2x);

			// Free memory
			imagedestroy($sourceImg);

		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return true;

	}

	/**
	 * Creates a smaller version of a photo when its size is bigger than a preset size.
	 * Photo must be big enough and Imagick must be installed and activated.
	 * @return boolean Returns true when successful.
	 */
	private function createMedium($url, $filename, $width, $height) {

		// Excepts the following:
		// (string) $url = Path to the photo-file
		// (string) $filename = Name of the photo-file
		// (int) $width = Width of the photo
		// (int) $height = Height of the photo

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Quality of medium-photo
		$quality = 90;

		// Set to true when creation of medium-photo failed
		$error = false;

		// Size of the medium-photo
		// When changing these values,
		// also change the size detection in the front-end
		$newWidth  = 1920;
		$newHeight = 1080;

		// Check permissions
		if (hasPermissions(LYCHEE_UPLOADS_MEDIUM)===false) {

			// Permissions are missing
			Log::notice(Database::get(), __METHOD__, __LINE__, 'Skipped creation of medium-photo, because uploads/medium/ is missing or not readable and writable.');
			$error = true;

		}

		// Is photo big enough?
		// Is Imagick installed and activated?
		if (($error===false)&&
			($width>$newWidth||$height>$newHeight)&&
			(extension_loaded('imagick')&&Settings::get()['imagick']==='1')) {

			$newUrl = LYCHEE_UPLOADS_MEDIUM . $filename;

			// Read image
			$medium = new Imagick();
			$medium->readImage($url);

			// Adjust image
			$medium->scaleImage($newWidth, $newHeight, true);
			$medium->stripImage();
			$medium->setImageCompressionQuality($quality);

			// Save image
			try { $medium->writeImage($newUrl); }
			catch (ImagickException $err) {
				Log::notice(Database::get(), __METHOD__, __LINE__, 'Could not save medium-photo (' . $err->getMessage() . ')');
				$error = true;
			}

			$medium->clear();
			$medium->destroy();

		} else {

			// Photo too small or
			// Medium is deactivated or
			// Imagick not installed
			$error = true;

		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($error===true) return false;
		return true;

	}

	/**
	 * Rotates and flips a photo based on its EXIF orientation.
	 * @return array|false Returns an array with the new orientation, width, height or false on failure.
	 */
	public function adjustFile($path, array $info) {

		// Excepts the following:
		// (string) $path = Path to the photo-file
		// (array) $info = ['orientation', 'width', 'height']

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		$swapSize = false;

		if (extension_loaded('imagick')&&Settings::get()['imagick']==='1') {

			$image = new Imagick();
			$image->readImage($path);

			$orientation = $image->getImageOrientation();

			switch ($orientation) {

				case Imagick::ORIENTATION_TOPLEFT:
					return false;
					break;

				case Imagick::ORIENTATION_TOPRIGHT:
					$image->flopImage();
					break;

				case Imagick::ORIENTATION_BOTTOMRIGHT:
					$image->rotateImage(new ImagickPixel(), 180);
					break;

				case Imagick::ORIENTATION_BOTTOMLEFT:
					$image->flopImage();
					$image->rotateImage(new ImagickPixel(), 180);
					break;

				case Imagick::ORIENTATION_LEFTTOP:
					$image->flopImage();
					$image->rotateImage(new ImagickPixel(), -90);
					$swapSize = true;
					break;

				case Imagick::ORIENTATION_RIGHTTOP:
					$image->rotateImage(new ImagickPixel(), 90);
					$swapSize = true;
					break;

				case Imagick::ORIENTATION_RIGHTBOTTOM:
					$image->flopImage();
					$image->rotateImage(new ImagickPixel(), 90);
					$swapSize = true;
					break;

				case Imagick::ORIENTATION_LEFTBOTTOM:
					$image->rotateImage(new ImagickPixel(), -90);
					$swapSize = true;
					break;

				default:
					return false;
					break;

			}

			// Adjust photo
			$image->setImageOrientation(Imagick::ORIENTATION_TOPLEFT);
			$image->writeImage($path);

			// Free memory
			$image->clear();
			$image->destroy();

		} else {

			$newWidth  = $info['width'];
			$newHeight = $info['height'];
			$sourceImg = imagecreatefromjpeg($path);

			switch ($info['orientation']) {

				case 1:
					// do nothing
					return false;
					break;

				case 2:
					// mirror
					imageflip($sourceImg, IMG_FLIP_HORIZONTAL);
					break;

				case 3:
					$sourceImg = imagerotate($sourceImg, -180, 0);
					break;

				case 4:
					// rotate 180 and mirror
					imageflip($sourceImg, IMG_FLIP_VERTICAL);
					break;

				case 5:
					// rotate 90 and mirror
					$sourceImg = imagerotate($sourceImg, -90, 0);
					$newWidth  = $info['height'];
					$newHeight = $info['width'];
					$swapSize  = true;
					imageflip($sourceImg, IMG_FLIP_HORIZONTAL);
					break;

				case 6:
					$sourceImg = imagerotate($sourceImg, -90, 0);
					$newWidth  = $info['height'];
					$newHeight = $info['width'];
					$swapSize  = true;
					break;

				case 7:
					// rotate -90 and mirror
					$sourceImg = imagerotate($sourceImg, 90, 0);
					$newWidth  = $info['height'];
					$newHeight = $info['width'];
					$swapSize  = true;
					imageflip($sourceImg, IMG_FLIP_HORIZONTAL);
					break;

				case 8:
					$sourceImg = imagerotate($sourceImg, 90, 0);
					$newWidth  = $info['height'];
					$newHeight = $info['width'];
					$swapSize  = true;
					break;

				default:
					return false;
					break;

			}

			// Recreate photo
			// In this step the photos also loses its metadata :(
			$newSourceImg = imagecreatetruecolor($newWidth, $newHeight);
			imagecopyresampled($newSourceImg, $sourceImg, 0, 0, 0, 0, $newWidth, $newHeight, $newWidth, $newHeight);
			imagejpeg($newSourceImg, $path, 100);

			// Free memory
			imagedestroy($sourceImg);
			imagedestroy($newSourceImg);

		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		// SwapSize should be true when the image has been rotated
		// Return new dimensions in this case
		if ($swapSize===true) {
			$swapSize       = $info['width'];
			$info['width']  = $info['height'];
			$info['height'] = $swapSize;
		}

		return $info;

	}

	/**
	 * Rurns photo-attributes into a front-end friendly format. Note that some attributes remain unchanged.
	 * @return array Returns photo-attributes in a normalized structure.
	 */
	public static function prepareData(array $data) {

		// Excepts the following:
		// (array) $data = ['id', 'title', 'tags', 'public', 'star', 'album', 'thumbUrl', 'takestamp', 'url', 'medium']

		// Init
		$photo = null;

		// Set unchanged attributes
		$photo['id']     = $data['id'];
		$photo['title']  = $data['title'];
		$photo['tags']   = $data['tags'];
		$photo['public'] = $data['public'];
		$photo['star']   = $data['star'];
		$photo['album']  = $data['album'];

		// Parse medium
		if ($data['medium']==='1') $photo['medium'] = LYCHEE_URL_UPLOADS_MEDIUM . $data['url'];
		else                       $photo['medium'] = '';

		// Parse paths
		$photo['thumbUrl'] = LYCHEE_URL_UPLOADS_THUMB . $data['thumbUrl'];
		$photo['url']      = LYCHEE_URL_UPLOADS_BIG . $data['url'];

		// Use takestamp as sysdate when possible
		if (isset($data['takestamp'])&&$data['takestamp']!=='0') {

			// Use takestamp
			$photo['cameraDate'] = '1';
			$photo['sysdate']    = strftime('%d %B %Y', $data['takestamp']);

		} else {

			// Use sysstamp from the id
			$photo['cameraDate'] = '0';
			$photo['sysdate']    = strftime('%d %B %Y', substr($data['id'], 0, -4));

		}

		return $photo;

	}

	/**
	 * @return array|false Returns an array with information about the photo or false on failure.
	 */
	public function get($albumID) {

		// Excepts the following:
		// (string) $albumID = Album which is currently visible to the user

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Get photo
		$query  = Database::prepare(Database::get(), "SELECT * FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($photos===false) return false;

		// Get photo object
		$photo = $photos->fetch_assoc();

		// Photo not found?
		if ($photo===null) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find specified photo');
			return false;
		}

		// Parse photo
		$photo['sysdate'] = strftime('%d %b. %Y', substr($photo['id'], 0, -4));
		if (strlen($photo['takestamp'])>1) $photo['takedate'] = strftime('%d %b. %Y', $photo['takestamp']);

		// Parse medium
		if ($photo['medium']==='1') $photo['medium'] = LYCHEE_URL_UPLOADS_MEDIUM . $photo['url'];
		else                        $photo['medium'] = '';

		// Parse paths
		$photo['url']      = LYCHEE_URL_UPLOADS_BIG . $photo['url'];
		$photo['thumbUrl'] = LYCHEE_URL_UPLOADS_THUMB . $photo['thumbUrl'];

		if ($albumID!='false') {

			// Only show photo as public when parent album is public
			// Check if parent album is not 'Unsorted'
			if ($photo['album']!=='0') {

				// Get album
				$query  = Database::prepare(Database::get(), "SELECT public FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $photo['album']));
				$albums = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

				if ($albums===false) return false;

				// Get album object
				$album = $albums->fetch_assoc();

				// Photo not found?
				if ($photo===null) {
					Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find specified album');
					return false;
				}

				// Parse album
				$photo['public'] = ($album['public']==='1' ? '2' : $photo['public']);

			}

			$photo['original_album'] = $photo['album'];
			$photo['album']          = $albumID;

		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return $photo;

	}

	/**
	 * Reads and parses information and metadata out of a photo.
	 * @return array Returns an array of photo information and metadata.
	 */
	public function getInfo($url) {

		// Functions returns information and metadata of a photo
		// Excepts the following:
		// (string) $url = Path to photo-file
		// Returns the following:
		// (array) $return

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		$iptcArray = array();
		$info      = getimagesize($url, $iptcArray);

		// General information
		$return['type']        = $info['mime'];
		$return['width']       = $info[0];
		$return['height']      = $info[1];
		$return['title']       = '';
		$return['description'] = '';
		$return['orientation'] = '';
		$return['iso']         = '';
		$return['aperture']    = '';
		$return['make']        = '';
		$return['model']       = '';
		$return['shutter']     = '';
		$return['focal']       = '';
		$return['takestamp']   = 0;
		$return['lens']        = '';
		$return['tags']        = '';
		$return['position']    = '';
		$return['latitude']    = '';
		$return['longitude']   = '';
		$return['altitude']    = '';

		// Size
		$size = filesize($url)/1024;
		if ($size>=1024) $return['size'] = round($size/1024, 1) . ' MB';
		else $return['size'] = round($size, 1) . ' KB';

		// IPTC Metadata
		// See https://www.iptc.org/std/IIM/4.2/specification/IIMV4.2.pdf for mapping
		if(isset($iptcArray['APP13'])) {

			$iptcInfo = iptcparse($iptcArray['APP13']);
			if (is_array($iptcInfo)) {

				// Title
				if (!empty($iptcInfo['2#105'][0])) $return['title'] = $iptcInfo['2#105'][0];
				else if (!empty($iptcInfo['2#005'][0])) $return['title'] = $iptcInfo['2#005'][0];

				// Description
				if (!empty($iptcInfo['2#120'][0])) $return['description'] = $iptcInfo['2#120'][0];

				// Tags
				if (!empty($iptcInfo['2#025'])) $return['tags'] = implode(',', $iptcInfo['2#025']);

				// Position
				$fields = array();
				if (!empty($iptcInfo['2#090'])) $fields[] = trim($iptcInfo['2#090'][0]);
				if (!empty($iptcInfo['2#092'])) $fields[] = trim($iptcInfo['2#092'][0]);
				if (!empty($iptcInfo['2#095'])) $fields[] = trim($iptcInfo['2#095'][0]);
				if (!empty($iptcInfo['2#101'])) $fields[] = trim($iptcInfo['2#101'][0]);

				if (!empty($fields)) $return['position'] = implode(', ', $fields);

			}

		}

		// Read EXIF
		if ($info['mime']=='image/jpeg') $exif = @exif_read_data($url, 'EXIF', false, false);
		else $exif = false;

		// EXIF Metadata
		if ($exif!==false) {

			// Orientation
			if (isset($exif['Orientation'])) $return['orientation'] = $exif['Orientation'];
			else if (isset($exif['IFD0']['Orientation'])) $return['orientation'] = $exif['IFD0']['Orientation'];

			// ISO
			if (!empty($exif['ISOSpeedRatings'])) $return['iso'] = $exif['ISOSpeedRatings'];

			// Aperture
			if (!empty($exif['COMPUTED']['ApertureFNumber'])) $return['aperture'] = $exif['COMPUTED']['ApertureFNumber'];

			// Make
			if (!empty($exif['Make'])) $return['make'] = trim($exif['Make']);

			// Model
			if (!empty($exif['Model'])) $return['model'] = trim($exif['Model']);

			// Exposure
			if (!empty($exif['ExposureTime'])) $return['shutter'] = $exif['ExposureTime'] . ' s';

			// Focal Length
			if (!empty($exif['FocalLength'])) {
				if (strpos($exif['FocalLength'], '/')!==false) {
					$temp = explode('/', $exif['FocalLength'], 2);
					$temp = $temp[0] / $temp[1];
					$temp = round($temp, 1);
					$return['focal'] = $temp . ' mm';
				} else {
					$return['focal'] = $exif['FocalLength'] . ' mm';
				}
			}

			// Takestamp
			if (!empty($exif['DateTimeOriginal'])) $return['takestamp'] = strtotime($exif['DateTimeOriginal']);

			// Lens field from Lightroom
			if (!empty($exif['UndefinedTag:0xA434'])) $return['lens'] = trim($exif['UndefinedTag:0xA434']);

			// Deal with GPS coordinates
			if (!empty($exif['GPSLatitude']) && !empty($exif['GPSLatitudeRef'])) $return['latitude'] = getGPSCoordinate($exif['GPSLatitude'], $exif['GPSLatitudeRef']);
			if (!empty($exif['GPSLongitude']) && !empty($exif['GPSLongitudeRef'])) $return['longitude'] = getGPSCoordinate($exif['GPSLongitude'], $exif['GPSLongitudeRef']);

		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return $return;

	}

	/**
	 * Starts a download of a photo.
	 * @return resource|boolean Sends a ZIP-file or returns false on failure.
	 */
	public function getArchive() {

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Get photo
		$query  = Database::prepare(Database::get(), "SELECT title, url FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($photos===false) return false;

		// Get photo object
		$photo = $photos->fetch_object();

		// Photo not found?
		if ($photo===null) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find specified photo');
			return false;
		}

		// Get extension
		$extension = getExtension($photo->url, false);
		if (empty($extension)===true) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Invalid photo extension');
			return false;
		}

		// Illicit chars
		$badChars = array_merge(
			array_map('chr', range(0,31)),
			array("<", ">", ":", '"', "/", "\\", "|", "?", "*")
		);

		// Parse title
		if ($photo->title=='') $photo->title = 'Untitled';

		// Escape title
		$photo->title = str_replace($badChars, '', $photo->title);

		// Set headers
		header("Content-Type: application/octet-stream");
		header("Content-Disposition: attachment; filename=\"" . $photo->title . $extension . "\"");
		header("Content-Length: " . filesize(LYCHEE_UPLOADS_BIG . $photo->url));

		// Send file
		readfile(LYCHEE_UPLOADS_BIG . $photo->url);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return true;

	}

	/**
	 * Sets the title of a photo.
	 * @return boolean Returns true when successful.
	 */
	public function setTitle($title = 'Untitled') {

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Set title
		$query  = Database::prepare(Database::get(), "UPDATE ? SET title = '?' WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $title, $this->photoIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

	/**
	 * Sets the description of a photo.
	 * @return boolean Returns true when successful.
	 */
	public function setDescription($description) {

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Set description
		$query  = Database::prepare(Database::get(), "UPDATE ? SET description = '?' WHERE id IN ('?')", array(LYCHEE_TABLE_PHOTOS, $description, $this->photoIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

	/**
	 * Toggles the star property of a photo.
	 * @return boolean Returns true when successful.
	 */
	public function setStar() {

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Init vars
		$error = false;

		// Get photos
		$query  = Database::prepare(Database::get(), "SELECT id, star FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($photos===false) return false;

		// For each photo
		while ($photo = $photos->fetch_object()) {

			// Invert star
			$star = ($photo->star==0 ? 1 : 0);

			// Set star
			$query  = Database::prepare(Database::get(), "UPDATE ? SET star = '?' WHERE id = '?'", array(LYCHEE_TABLE_PHOTOS, $star, $photo->id));
			$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

			if ($result===false) $error = true;

		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($error===true) return false;
		return true;

	}

	/**
	 * Checks if photo or parent album is public.
	 * @return integer 0 = Photo private and parent album private
	 *                 1 = Album public, but password incorrect
	 *                 2 = Photo public or album public and password correct
	 */
	public function getPublic($password) {

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Get photo
		$query  = Database::prepare(Database::get(), "SELECT public, album FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($photos===false) return 0;

		// Get photo object
		$photo = $photos->fetch_object();

		// Photo not found?
		if ($photo===null) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find specified photo');
			return false;
		}

		// Check if public
		if ($photo->public==='1') {

			// Photo public
			return 2;

		} else {

			// Check if album public
			$album = new Album($photo->album);
			$agP   = $album->getPublic();
			$acP   = $album->checkPassword($password);

			// Album public and password correct
			if ($agP===true&&$acP===true) return 2;

			// Album public, but password incorrect
			if ($agP===true&&$acP===false) return 1;

		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		// Photo private
		return 0;

	}

	/**
	 * Toggles the public property of a photo.
	 * @return boolean Returns true when successful.
	 */
	public function setPublic() {

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Get public
		$query  = Database::prepare(Database::get(), "SELECT public FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($photos===false) return false;

		// Get photo object
		$photo = $photos->fetch_object();

		// Photo not found?
		if ($photo===null) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find specified photo');
			return false;
		}

		// Invert public
		$public = ($photo->public==0 ? 1 : 0);

		// Set public
		$query  = Database::prepare(Database::get(), "UPDATE ? SET public = '?' WHERE id = '?'", array(LYCHEE_TABLE_PHOTOS, $public, $this->photoIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

	/**
	 * Sets the parent album of a photo.
	 * @return boolean Returns true when successful.
	 */
	function setAlbum($albumID) {

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Set album
		$query  = Database::prepare(Database::get(), "UPDATE ? SET album = '?' WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $albumID, $this->photoIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

	/**
	 * Sets the tags of a photo.
	 * @return boolean Returns true when successful.
	 */
	public function setTags($tags) {

		// Excepts the following:
		// (string) $tags = Comma separated list of tags with a maximum length of 1000 chars

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Parse tags
		$tags = preg_replace('/(\ ,\ )|(\ ,)|(,\ )|(,{1,}\ {0,})|(,$|^,)/', ',', $tags);
		$tags = preg_replace('/,$|^,|(\ ){0,}$/', '', $tags);

		// Set tags
		$query  = Database::prepare(Database::get(), "UPDATE ? SET tags = '?' WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $tags, $this->photoIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

	/**
	 * Duplicates a photo.
	 * @return boolean Returns true when successful.
	 */
	public function duplicate() {

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Init vars
		$error = false;

		// Get photos
		$query  = Database::prepare(Database::get(), "SELECT id, checksum FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($photos===false) return false;

		// For each photo
		while ($photo = $photos->fetch_object()) {

			// Generate id
			$id = generateID();

			// Duplicate entry
			$values = array(LYCHEE_TABLE_PHOTOS, $id, LYCHEE_TABLE_PHOTOS, $photo->id);
			$query  = Database::prepare(Database::get(), "INSERT INTO ? (id, title, url, description, tags, type, width, height, size, iso, aperture, make, model, shutter, focal, takestamp, thumbUrl, album, public, star, checksum) SELECT '?' AS id, title, url, description, tags, type, width, height, size, iso, aperture, make, model, shutter, focal, takestamp, thumbUrl, album, public, star, checksum FROM ? WHERE id = '?'", $values);
			$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

			if ($result===false) $error = true;

		}

		if ($error===true) return false;
		return true;

	}

	/**
	 * Deletes a photo with all its data and files.
	 * @return boolean Returns true when successful.
	 */
	public function delete() {

		// Check dependencies
		Validator::required(isset($this->photoIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Init vars
		$error = false;

		// Get photos
		$query  = Database::prepare(Database::get(), "SELECT id, url, thumbUrl, checksum FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($photos===false) return false;

		// For each photo
		while ($photo = $photos->fetch_object()) {

			// Check if other photos are referring to this images
			// If so, only delete the db entry
			if ($this->exists($photo->checksum, $photo->id)===false) {

				// Get retina thumb url
				$thumbUrl2x = explode(".", $photo->thumbUrl);
				$thumbUrl2x = $thumbUrl2x[0] . '@2x.' . $thumbUrl2x[1];

				// Delete big
				if (file_exists(LYCHEE_UPLOADS_BIG . $photo->url)&&!unlink(LYCHEE_UPLOADS_BIG . $photo->url)) {
					Log::error(Database::get(), __METHOD__, __LINE__, 'Could not delete photo in uploads/big/');
					$error = true;
				}

				// Delete medium
				if (file_exists(LYCHEE_UPLOADS_MEDIUM . $photo->url)&&!unlink(LYCHEE_UPLOADS_MEDIUM . $photo->url)) {
					Log::error(Database::get(), __METHOD__, __LINE__, 'Could not delete photo in uploads/medium/');
					$error = true;
				}

				// Delete thumb
				if (file_exists(LYCHEE_UPLOADS_THUMB . $photo->thumbUrl)&&!unlink(LYCHEE_UPLOADS_THUMB . $photo->thumbUrl)) {
					Log::error(Database::get(), __METHOD__, __LINE__, 'Could not delete photo in uploads/thumb/');
					$error = true;
				}

				// Delete thumb@2x
				if (file_exists(LYCHEE_UPLOADS_THUMB . $thumbUrl2x)&&!unlink(LYCHEE_UPLOADS_THUMB . $thumbUrl2x)) {
					Log::error(Database::get(), __METHOD__, __LINE__, 'Could not delete high-res photo in uploads/thumb/');
					$error = true;
				}

			}

			// Delete db entry
			$query  = Database::prepare(Database::get(), "DELETE FROM ? WHERE id = '?'", array(LYCHEE_TABLE_PHOTOS, $photo->id));
			$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

			if ($result===false) $error = true;

		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($error===true) return false;
		return true;

	}

}

?>
