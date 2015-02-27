<?php

###
# @name			Photo Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Photo extends Module {

	private $database	= null;
	private $settings	= null;
	private $photoIDs	= null;

	private $allowedTypes = array(
		IMAGETYPE_JPEG,
		IMAGETYPE_GIF,
		IMAGETYPE_PNG
	);
	private $validExtensions = array(
		'.jpg',
		'.jpeg',
		'.png',
		'.gif'
	);

	public function __construct($database, $plugins, $settings, $photoIDs) {

		# Init vars
		$this->database	= $database;
		$this->plugins	= $plugins;
		$this->settings	= $settings;
		$this->photoIDs	= $photoIDs;

		return true;

	}

	public function add($files, $albumID, $description = '', $tags = '') {

		# Check dependencies
		self::dependencies(isset($this->database));

		# Check permissions
		if (hasPermissions(LYCHEE_UPLOADS)===false||
			hasPermissions(LYCHEE_UPLOADS_BIG)===false||
			hasPermissions(LYCHEE_UPLOADS_THUMB)===false) {
				Log::error($this->database, __METHOD__, __LINE__, 'An upload-folder is missing or not readable and writable');
				exit('Error: An upload-folder is missing or not readable and writable!');
		}

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		switch($albumID) {

			case 's':
				# s for public (share)
				$public		= 1;
				$star		= 0;
				$albumID	= 0;
				break;

			case 'f':
				# f for starred (fav)
				$star		= 1;
				$public		= 0;
				$albumID	= 0;
				break;

			case 'r':
				# r for recent
				$public		= 0;
				$star		= 0;
				$albumID	= 0;
				break;

			default:
				$star		= 0;
				$public		= 0;
				break;

		}

		foreach ($files as $file) {

			# Verify extension
			$extension = getExtension($file['name']);
			if (!in_array(strtolower($extension), $this->validExtensions, true)) continue;

			# Verify image
			$type = @exif_imagetype($file['tmp_name']);
			if (!in_array($type, $this->allowedTypes, true)) continue;

			# Generate id
			$id = str_replace('.', '', microtime(true));
			while(strlen($id)<14) $id .= 0;

			# Set paths
			$tmp_name	= $file['tmp_name'];
			$photo_name	= md5($id) . $extension;
			$path		= LYCHEE_UPLOADS_BIG . $photo_name;

			# Calculate checksum
			$checksum = sha1_file($tmp_name);
			if ($checksum===false) {
				Log::error($this->database, __METHOD__, __LINE__, 'Could not calculate checksum for photo');
				exit('Error: Could not calculate checksum for photo!');
			}

			# Check if image exists based on checksum
			if ($checksum===false) {

				$checksum	= '';
				$exists		= false;

			} else {

				$exists = $this->exists($checksum);

				if ($exists!==false) {
					$photo_name	= $exists['photo_name'];
					$path		= $exists['path'];
					$path_thumb	= $exists['path_thumb'];
					$medium		= ($exists['medium']==='1' ? 1 : 0);
					$exists		= true;
				}

			}

			if ($exists===false) {

				# Import if not uploaded via web
				if (!is_uploaded_file($tmp_name)) {
					if (!@copy($tmp_name, $path)) {
						Log::error($this->database, __METHOD__, __LINE__, 'Could not copy photo to uploads');
						exit('Error: Could not copy photo to uploads!');
					} else @unlink($tmp_name);
				} else {
					if (!@move_uploaded_file($tmp_name, $path)) {
						Log::error($this->database, __METHOD__, __LINE__, 'Could not move photo to uploads');
						exit('Error: Could not move photo to uploads!');
					}
				}

			}

			# Read infos
			$info = $this->getInfo($path);

			# Use title of file if IPTC title missing
			if ($info['title']==='') $info['title'] = substr(basename($file['name'], $extension), 0, 30);

			# Use description parameter if set
			if ($description==='') $description = $info['description'];

			if ($exists===false) {

				# Set orientation based on EXIF data
				if ($file['type']==='image/jpeg'&&isset($info['orientation'])&&$info['orientation']!=='') {
					$adjustFile = $this->adjustFile($path, $info);
					if ($adjustFile!==false) $info = $adjustFile;
					else Log::notice($this->database, __METHOD__, __LINE__, 'Skipped adjustment of photo (' . $info['title'] . ')');
				}

				# Set original date
				if ($info['takestamp']!==''&&$info['takestamp']!==0) @touch($path, $info['takestamp']);

				# Create Thumb
				if (!$this->createThumb($path, $photo_name, $info['type'], $info['width'], $info['height'])) {
					Log::error($this->database, __METHOD__, __LINE__, 'Could not create thumbnail for photo');
					exit('Error: Could not create thumbnail for photo!');
				}

				# Create Medium
				if ($this->createMedium($path, $photo_name, $info['width'], $info['height'])) $medium = 1;
				else $medium = 0;

				# Set thumb url
				$path_thumb = md5($id) . '.jpeg';

			}

			# Save to DB
			$values	= array(LYCHEE_TABLE_PHOTOS, $id, $info['title'], $photo_name, $description, $tags, $info['type'], $info['width'], $info['height'], $info['size'], $info['iso'], $info['aperture'], $info['make'], $info['model'], $info['shutter'], $info['focal'], $info['takestamp'], $path_thumb, $albumID, $public, $star, $checksum, $medium);
			$query	= Database::prepare($this->database, "INSERT INTO ? (id, title, url, description, tags, type, width, height, size, iso, aperture, make, model, shutter, focal, takestamp, thumbUrl, album, public, star, checksum, medium) VALUES ('?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?')", $values);
			$result = $this->database->query($query);

			if (!$result) {
				Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
				exit('Error: Could not save photo in database!');
			}

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	private function exists($checksum, $photoID = null) {

		# Check dependencies
		self::dependencies(isset($this->database, $checksum));

		# Exclude $photoID from select when $photoID is set
		if (isset($photoID)) $query = Database::prepare($this->database, "SELECT id, url, thumbUrl, medium FROM ? WHERE checksum = '?' AND id <> '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $checksum, $photoID));
		else $query = Database::prepare($this->database, "SELECT id, url, thumbUrl, medium FROM ? WHERE checksum = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $checksum));

		$result	= $this->database->query($query);

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, 'Could not check for existing photos with the same checksum');
			return false;
		}

		if ($result->num_rows===1) {

			$result = $result->fetch_object();

			$return = array(
				'photo_name'	=> $result->url,
				'path'			=> LYCHEE_UPLOADS_BIG . $result->url,
				'path_thumb'	=> $result->thumbUrl,
				'medium'		=> $result->medium
			);

			return $return;

		}

		return false;

	}

	private function createThumb($url, $filename, $type, $width, $height) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->settings, $url, $filename, $type, $width, $height));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Size of the thumbnail
		$newWidth	= 200;
		$newHeight	= 200;

		$photoName	= explode('.', $filename);
		$newUrl		= LYCHEE_UPLOADS_THUMB . $photoName[0] . '.jpeg';
		$newUrl2x	= LYCHEE_UPLOADS_THUMB . $photoName[0] . '@2x.jpeg';

		# Create thumbnails with Imagick
		if(extension_loaded('imagick')&&$this->settings['imagick']==='1') {

			# Read image
			$thumb = new Imagick();
			$thumb->readImage($url);
			$thumb->setImageCompressionQuality($this->settings['thumbQuality']);
			$thumb->setImageFormat('jpeg');

			# Copy image for 2nd thumb version
			$thumb2x = clone $thumb;

			# Create 1st version
			$thumb->cropThumbnailImage($newWidth, $newHeight);
			$thumb->writeImage($newUrl);
			$thumb->clear();
			$thumb->destroy();

			# Create 2nd version
			$thumb2x->cropThumbnailImage($newWidth*2, $newHeight*2);
			$thumb2x->writeImage($newUrl2x);
			$thumb2x->clear();
			$thumb2x->destroy();

		} else {

			# Create image
			$thumb		= imagecreatetruecolor($newWidth, $newHeight);
			$thumb2x	= imagecreatetruecolor($newWidth*2, $newHeight*2);

			# Set position
			if ($width<$height) {
				$newSize		= $width;
				$startWidth		= 0;
				$startHeight	= $height/2 - $width/2;
			} else {
				$newSize		= $height;
				$startWidth		= $width/2 - $height/2;
				$startHeight	= 0;
			}

			# Create new image
			switch($type) {
				case 'image/jpeg':	$sourceImg = imagecreatefromjpeg($url); break;
				case 'image/png':	$sourceImg = imagecreatefrompng($url); break;
				case 'image/gif':	$sourceImg = imagecreatefromgif($url); break;
				default:			Log::error($this->database, __METHOD__, __LINE__, 'Type of photo is not supported');
									return false;
									break;
			}

			# Create thumb
			fastimagecopyresampled($thumb, $sourceImg, 0, 0, $startWidth, $startHeight, $newWidth, $newHeight, $newSize, $newSize);
			imagejpeg($thumb, $newUrl, $this->settings['thumbQuality']);
			imagedestroy($thumb);

			# Create retina thumb
			fastimagecopyresampled($thumb2x, $sourceImg, 0, 0, $startWidth, $startHeight, $newWidth*2, $newHeight*2, $newSize, $newSize);
			imagejpeg($thumb2x, $newUrl2x, $this->settings['thumbQuality']);
			imagedestroy($thumb2x);

			# Free memory
			imagedestroy($sourceImg);

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	private function createMedium($url, $filename, $width, $height) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->settings, $url, $filename, $width, $height));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Set to true when creation of medium-photo failed
		$error = false;

		# Size of the medium-photo
		# When changing these values,
		# also change the size detection in the front-end
		$newWidth	= 1920;
		$newHeight	= 1080;

		# Check permissions
		if (hasPermissions(LYCHEE_UPLOADS_MEDIUM)===false) {

			# Permissions are missing
			Log::notice($this->database, __METHOD__, __LINE__, 'Skipped creation of medium-photo, because uploads/medium/ is missing or not readable and writable.');
			$error = true;

		}

		# Is photo big enough?
		# Is medium activated?
		# Is Imagick installed and activated?
		if (($error===false)&&
			($width>$newWidth||$height>$newHeight)&&
			($this->settings['medium']==='1')&&
			(extension_loaded('imagick')&&$this->settings['imagick']==='1')) {

			$newUrl = LYCHEE_UPLOADS_MEDIUM . $filename;

			# Read image
			$medium = new Imagick();
			$medium->readImage($url);

			# Adjust image
			$medium->scaleImage($newWidth, $newHeight, true);

			# Save image
			try { $medium->writeImage($newUrl); }
			catch (ImagickException $err) {
				Log::notice($this->database, __METHOD__, __LINE__, 'Could not save medium-photo: ' . $err->getMessage());
				$error = true;
			}

			$medium->clear();
			$medium->destroy();

		} else {

			# Photo too small or
			# Medium is deactivated or
			# Imagick not installed
			$error = true;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($error===true) return false;
		return true;

	}

	public function adjustFile($path, $info) {

		# Check dependencies
		self::dependencies(isset($path, $info));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		$swapSize = false;

		if (extension_loaded('imagick')&&$this->settings['imagick']==='1') {

			$rotateImage = 0;

			switch ($info['orientation']) {

				case 3:
					$rotateImage = 180;
					break;

				case 6:
					$rotateImage	= 90;
					$swapSize		= true;
					break;

				case 8:
					$rotateImage	= 270;
					$swapSize		= true;
					break;

				default:
					return false;
					break;

			}

			if ($rotateImage!==0) {
				$image = new Imagick();
				$image->readImage($path);
				$image->rotateImage(new ImagickPixel(), $rotateImage);
				$image->setImageOrientation(1);
				$image->writeImage($path);
				$image->clear();
				$image->destroy();
			}

		} else {

			$newWidth	= $info['width'];
			$newHeight	= $info['height'];
			$sourceImg	= imagecreatefromjpeg($path);

			switch ($info['orientation']) {

				case 2:
					# mirror
					# not yet implemented
					return false;
					break;

				case 3:
					$process	= true;
					$sourceImg	= imagerotate($sourceImg, -180, 0);
					break;

				case 4:
					# rotate 180 and mirror
					# not yet implemented
					return false;
					break;

				case 5:
					# rotate 90 and mirror
					# not yet implemented
					return false;
					break;

				case 6:
					$process	= true;
					$sourceImg	= imagerotate($sourceImg, -90, 0);
					$newWidth	= $info['height'];
					$newHeight	= $info['width'];
					$swapSize	= true;
					break;

				case 7:
					# rotate -90 and mirror
					# not yet implemented
					return false;
					break;

				case 8:
					$process	= true;
					$sourceImg	= imagerotate($sourceImg, 90, 0);
					$newWidth	= $info['height'];
					$newHeight	= $info['width'];
					$swapSize	= true;
					break;

				default:
					return false;
					break;

			}

			# Recreate photo
			$newSourceImg = imagecreatetruecolor($newWidth, $newHeight);
			imagecopyresampled($newSourceImg, $sourceImg, 0, 0, 0, 0, $newWidth, $newHeight, $newWidth, $newHeight);
			imagejpeg($newSourceImg, $path, 100);

			# Free memory
			imagedestroy($sourceImg);
			imagedestroy($newSourceImg);

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		# SwapSize should be true when the image has been rotated
		# Return new dimensions in this case
		if ($swapSize===true) {
			$swapSize		= $info['width'];
			$info['width']	= $info['height'];
			$info['height']	= $swapSize;
		}

		return $info;

	}

	public function get($albumID) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photo
		$query	= Database::prepare($this->database, "SELECT * FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos	= $this->database->query($query);
		$photo	= $photos->fetch_assoc();

		# Parse photo
		$photo['sysdate'] = date('d M. Y', substr($photo['id'], 0, -4));
		if (strlen($photo['takestamp'])>1) $photo['takedate'] = date('d M. Y', $photo['takestamp']);

		# Parse medium
		if ($photo['medium']==='1') $photo['medium'] = LYCHEE_URL_UPLOADS_MEDIUM . $photo['url'];
		else $photo['medium'] = '';

		# Parse paths
		$photo['url']		= LYCHEE_URL_UPLOADS_BIG . $photo['url'];
		$photo['thumbUrl']	= LYCHEE_URL_UPLOADS_THUMB . $photo['thumbUrl'];

		if ($albumID!='false') {

			# Show photo as public when parent album is public
			# Check if parent album is available and not photo not unsorted
			if ($photo['album']!=0) {

				# Get album
				$query	= Database::prepare($this->database, "SELECT public FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $photo['album']));
				$albums	= $this->database->query($query);
				$album	= $albums->fetch_assoc();

				# Parse album
				$photo['public'] = ($album['public']=='1' ? '2' : $photo['public']);

			}

			$photo['original_album']	= $photo['album'];
			$photo['album']				= $albumID;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $photo;

	}

	public function getInfo($url) {

		# Check dependencies
		self::dependencies(isset($this->database, $url));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		$iptcArray	= array();
		$info		= getimagesize($url, $iptcArray);

		# General information
		$return['type']		= $info['mime'];
		$return['width']	= $info[0];
		$return['height']	= $info[1];

		# Size
		$size = filesize($url)/1024;
		if ($size>=1024) $return['size'] = round($size/1024, 1) . ' MB';
		else $return['size'] = round($size, 1) . ' KB';

		# IPTC Metadata Fallback
		$return['title']		= '';
		$return['description']	= '';

		# IPTC Metadata
		if(isset($iptcArray['APP13'])) {

			$iptcInfo = iptcparse($iptcArray['APP13']);
			if (is_array($iptcInfo)) {

				$temp = @$iptcInfo['2#105'][0];
				if (isset($temp)&&strlen($temp)>0) $return['title'] = $temp;

				$temp = @$iptcInfo['2#120'][0];
				if (isset($temp)&&strlen($temp)>0) $return['description'] = $temp;

				$temp = @$iptcInfo['2#005'][0];
				if (isset($temp)&&strlen($temp)>0&&$return['title']==='') $return['title'] = $temp;

			}

		}

		# EXIF Metadata Fallback
		$return['orientation']	= '';
		$return['iso']			= '';
		$return['aperture']		= '';
		$return['make']			= '';
		$return['model']		= '';
		$return['shutter']		= '';
		$return['focal']		= '';
		$return['takestamp']	= 0;

		# Read EXIF
		if ($info['mime']=='image/jpeg') $exif = @exif_read_data($url, 'EXIF', 0);
		else $exif = false;

		# EXIF Metadata
		if ($exif!==false) {

			if (isset($exif['Orientation'])) $return['orientation'] = $exif['Orientation'];
			else if (isset($exif['IFD0']['Orientation'])) $return['orientation'] = $exif['IFD0']['Orientation'];

			$temp = @$exif['ISOSpeedRatings'];
			if (isset($temp)) $return['iso'] = $temp;

			$temp = @$exif['COMPUTED']['ApertureFNumber'];
			if (isset($temp)) $return['aperture'] = $temp;

			$temp = @$exif['Make'];
			if (isset($temp)) $return['make'] = trim($temp);

			$temp = @$exif['Model'];
			if (isset($temp)) $return['model'] = trim($temp);

			$temp = @$exif['ExposureTime'];
			if (isset($temp)) $return['shutter'] = $exif['ExposureTime'] . ' s';

			$temp = @$exif['FocalLength'];
			if (isset($temp)) {
				if (strpos($temp, '/')!==FALSE) {
					$temp = explode('/', $temp, 2);
					$temp = $temp[0] / $temp[1];
					$temp = round($temp, 1);
					$return['focal'] = $temp . ' mm';
				}
				$return['focal'] = $temp . ' mm';
			}

			$temp = @$exif['DateTimeOriginal'];
			if (isset($temp)) $return['takestamp'] = strtotime($temp);

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $return;

	}

	public function getArchive() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photo
		$query	= Database::prepare($this->database, "SELECT title, url FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos	= $this->database->query($query);
		$photo	= $photos->fetch_object();

		# Get extension
		$extension = getExtension($photo->url);
		if ($extension===false) {
			Log::error($this->database, __METHOD__, __LINE__, 'Invalid photo extension');
			return false;
		}

		# Illicit chars
		$badChars =	array_merge(
						array_map('chr', range(0,31)),
						array("<", ">", ":", '"', "/", "\\", "|", "?", "*")
					);

		# Parse title
		if ($photo->title=='') $photo->title = 'Untitled';

		# Escape title
		$photo->title = str_replace($badChars, '', $photo->title);

		# Set headers
		header("Content-Type: application/octet-stream");
		header("Content-Disposition: attachment; filename=\"" . $photo->title . $extension . "\"");
		header("Content-Length: " . filesize(LYCHEE_UPLOADS_BIG . $photo->url));

		# Send file
		readfile(LYCHEE_UPLOADS_BIG . $photo->url);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	public function setTitle($title) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Set title
		$query	= Database::prepare($this->database, "UPDATE ? SET title = '?' WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $title, $this->photoIDs));
		$result	= $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function setDescription($description) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		$description = htmlentities($description, ENT_COMPAT | ENT_HTML401, 'UTF-8');
		if (strlen($description)>1000) $description = substr($description, 0, 1000);

		# Set description
		$query	= Database::prepare($this->database, "UPDATE ? SET description = '?' WHERE id IN ('?')", array(LYCHEE_TABLE_PHOTOS, $description, $this->photoIDs));
		$result	= $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function setStar() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Init vars
		$error	= false;

		# Get photos
		$query	= Database::prepare($this->database, "SELECT id, star FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos	= $this->database->query($query);

		# For each photo
		while ($photo = $photos->fetch_object()) {

			# Invert star
			$star = ($photo->star==0 ? 1 : 0);

			# Set star
			$query	= Database::prepare($this->database, "UPDATE ? SET star = '?' WHERE id = '?'", array(LYCHEE_TABLE_PHOTOS, $star, $photo->id));
			$star	= $this->database->query($query);
			if (!$star) $error = true;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($error===true) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function getPublic($password) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photo
		$query	= Database::prepare($this->database, "SELECT public, album FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos	= $this->database->query($query);
		$photo	= $photos->fetch_object();

		# Check if public
		if ($photo->public==1) return true;
		else {
			$album	= new Album($this->database, null, null, $photo->album);
			$acP	= $album->checkPassword($password);
			$agP	= $album->getPublic();
			if ($acP===true&&$agP===true) return true;
		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return false;

	}

	public function setPublic() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get public
		$query	= Database::prepare($this->database, "SELECT public FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos	= $this->database->query($query);
		$photo	= $photos->fetch_object();

		# Invert public
		$public = ($photo->public==0 ? 1 : 0);

		# Set public
		$query	= Database::prepare($this->database, "UPDATE ? SET public = '?' WHERE id = '?'", array(LYCHEE_TABLE_PHOTOS, $public, $this->photoIDs));
		$result	= $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	function setAlbum($albumID) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Set album
		$query	= Database::prepare($this->database, "UPDATE ? SET album = '?' WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $albumID, $this->photoIDs));
		$result	= $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function setTags($tags) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse tags
		$tags = preg_replace('/(\ ,\ )|(\ ,)|(,\ )|(,{1,}\ {0,})|(,$|^,)/', ',', $tags);
		$tags = preg_replace('/,$|^,|(\ ){0,}$/', '', $tags);
		if (strlen($tags)>1000) {
			Log::notice($this->database, __METHOD__, __LINE__, 'Length of tags higher than 1000');
			return false;
		}

		# Set tags
		$query	= Database::prepare($this->database, "UPDATE ? SET tags = '?' WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $tags, $this->photoIDs));
		$result	= $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function duplicate() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photos
		$query	= Database::prepare($this->database, "SELECT id, checksum FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos	= $this->database->query($query);
		if (!$photos) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}

		# For each photo
		while ($photo = $photos->fetch_object()) {

			# Generate id
			$id = str_replace('.', '', microtime(true));
			while(strlen($id)<14) $id .= 0;

			# Duplicate entry
			$values		= array(LYCHEE_TABLE_PHOTOS, $id, LYCHEE_TABLE_PHOTOS, $photo->id);
			$query		= Database::prepare($this->database, "INSERT INTO ? (id, title, url, description, tags, type, width, height, size, iso, aperture, make, model, shutter, focal, takestamp, thumbUrl, album, public, star, checksum) SELECT '?' AS id, title, url, description, tags, type, width, height, size, iso, aperture, make, model, shutter, focal, takestamp, thumbUrl, album, public, star, checksum FROM ? WHERE id = '?'", $values);
			$duplicate	= $this->database->query($query);
			if (!$duplicate) {
				Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
				return false;
			}

		}

		return true;

	}

	public function delete() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->photoIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photos
		$query	= Database::prepare($this->database, "SELECT id, url, thumbUrl, checksum FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $this->photoIDs));
		$photos	= $this->database->query($query);
		if (!$photos) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}

		# For each photo
		while ($photo = $photos->fetch_object()) {

			# Check if other photos are referring to this images
			# If so, only delete the db entry
			if ($this->exists($photo->checksum, $photo->id)===false) {

				# Get retina thumb url
				$thumbUrl2x = explode(".", $photo->thumbUrl);
				$thumbUrl2x = $thumbUrl2x[0] . '@2x.' . $thumbUrl2x[1];

				# Delete big
				if (file_exists(LYCHEE_UPLOADS_BIG . $photo->url)&&!unlink(LYCHEE_UPLOADS_BIG . $photo->url)) {
					Log::error($this->database, __METHOD__, __LINE__, 'Could not delete photo in uploads/big/');
					return false;
				}

				# Delete medium
				if (file_exists(LYCHEE_UPLOADS_MEDIUM . $photo->url)&&!unlink(LYCHEE_UPLOADS_MEDIUM . $photo->url)) {
					Log::error($this->database, __METHOD__, __LINE__, 'Could not delete photo in uploads/medium/');
					return false;
				}

				# Delete thumb
				if (file_exists(LYCHEE_UPLOADS_THUMB . $photo->thumbUrl)&&!unlink(LYCHEE_UPLOADS_THUMB . $photo->thumbUrl)) {
					Log::error($this->database, __METHOD__, __LINE__, 'Could not delete photo in uploads/thumb/');
					return false;
				}

				# Delete thumb@2x
				if (file_exists(LYCHEE_UPLOADS_THUMB . $thumbUrl2x)&&!unlink(LYCHEE_UPLOADS_THUMB . $thumbUrl2x))	 {
					Log::error($this->database, __METHOD__, __LINE__, 'Could not delete high-res photo in uploads/thumb/');
					return false;
				}

			}

			# Delete db entry
			$query	= Database::prepare($this->database, "DELETE FROM ? WHERE id = '?'", array(LYCHEE_TABLE_PHOTOS, $photo->id));
			$delete	= $this->database->query($query);
			if (!$delete) {
				Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
				return false;
			}

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

}

?>