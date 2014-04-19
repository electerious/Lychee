<?php

###
# @name		Photo Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Photo extends Module {

	private $database	= null;
	private $settings	= null;
	private $photoIDs	= null;

	public function __construct($database, $plugins, $settings, $photoIDs) {

		# Init vars
		$this->database	= $database;
		$this->plugins	= $plugins;
		$this->settings	= $settings;
		$this->photoIDs	= $photoIDs;

		return true;

	}

	public function add($files, $albumID, $description = '', $tags = '') {

		if (!isset($this->database)) return false;

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

			default:
				$star		= 0;
				$public		= 0;
				break;

		}

		foreach ($files as $file) {

			if ($file['type']!=='image/jpeg'&&
				$file['type']!=='image/png'&&
				$file['type']!=='image/gif')
					continue;

			$id = str_replace('.', '', microtime(true));
			while(strlen($id)<14) $id .= 0;

			$tmp_name	= $file['tmp_name'];
			$extension	= array_reverse(explode('.', $file['name']));
			$extension	= $extension[0];
			$photo_name	= md5($id) . ".$extension";
			$path		= LYCHEE_UPLOADS_BIG . $photo_name;

			# Import if not uploaded via web
			if (!is_uploaded_file($tmp_name)) {
				if (!@copy($tmp_name, $path)) exit('Error: Could not copy photo to uploads!');
				else @unlink($tmp_name);
			} else {
				if (!@move_uploaded_file($tmp_name, $path)) exit('Error: Could not move photo to uploads!');
			}

			# Read infos
			$info = $this->getInfo($path);

			# Use title of file if IPTC title missing
			if ($info['title']==='') $info['title'] = mysqli_real_escape_string($this->database, substr(basename($file['name'], ".$extension"), 0, 30));

			# Use description parameter if set
			if ($description==='') $description = $info['description'];

			# Set orientation based on EXIF data
			if ($file['type']==='image/jpeg'&&isset($info['orientation'])&&$info['orientation']!==''&&isset($info['width'])&&isset($info['height'])) {
				if (!$this->adjustFile($path, $info)) exit('Error: Could not adjust photo!');
			}

			# Set original date
			if ($info['takestamp']!=='') @touch($path, $info['takestamp']);

			# Create Thumb
			if (!$this->createThumb($path, $photo_name)) exit('Error: Could not create thumbnail for photo!');

			# Save to DB
			$query = "INSERT INTO lychee_photos (id, title, url, description, tags, type, width, height, size, iso, aperture, make, model, shutter, focal, takestamp, thumbUrl, album, public, star)
				VALUES (
					'" . $id . "',
					'" . $info['title'] . "',
					'" . $photo_name . "',
					'" . $description . "',
					'" . $tags . "',
					'" . $info['type'] . "',
					'" . $info['width'] . "',
					'" . $info['height'] . "',
					'" . $info['size'] . "',
					'" . $info['iso'] . "',
					'" . $info['aperture'] . "',
					'" . $info['make'] . "',
					'" . $info['model'] . "',
					'" . $info['shutter'] . "',
					'" . $info['focal'] . "',
					'" . $info['takestamp'] . "',
					'" . md5($id) . ".jpeg',
					'" . $albumID . "',
					'" . $public . "',
					'" . $star . "');";
			$result = $this->database->query($query);

			if (!$result) exit('Error: Could not save photo in database!');

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	private function createThumb($url, $filename, $width = 200, $height = 200) {

		if (!isset($this->settings, $url, $filename)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		$info		= getimagesize($url);
		$photoName	= explode(".", $filename);
		$newUrl		= LYCHEE_UPLOADS_THUMB . $photoName[0] . '.jpeg';
		$newUrl2x	= LYCHEE_UPLOADS_THUMB . $photoName[0] . '@2x.jpeg';

		# create thumbnails with Imagick
		if(extension_loaded('imagick')) {

			# Read image
			$thumb = new Imagick();
			$thumb->readImage($url);
			$thumb->setImageCompressionQuality($this->settings['thumbQuality']);
			$thumb->setImageFormat('jpeg');

			# Copy image for 2nd thumb version
			$thumb2x = clone $thumb;

			# Create 1st version
			$thumb->cropThumbnailImage($width, $height);
			$thumb->writeImage($newUrl);
			$thumb->clear();
			$thumb->destroy();

			# Create 2nd version
			$thumb2x->cropThumbnailImage($width*2, $height*2);
			$thumb2x->writeImage($newUrl2x);
			$thumb2x->clear();
			$thumb2x->destroy();

		} else {

			# Set position and size
			$thumb = imagecreatetruecolor($width, $height);
			$thumb2x = imagecreatetruecolor($width*2, $height*2);
			if ($info[0]<$info[1]) {
				$newSize		= $info[0];
				$startWidth		= 0;
				$startHeight	= $info[1]/2 - $info[0]/2;
			} else {
				$newSize		= $info[1];
				$startWidth		= $info[0]/2 - $info[1]/2;
				$startHeight	= 0;
			}

			# Fallback for older version
			if ($info['mime']==='image/webp'&&floatval(phpversion())<5.5) return false;

			# Create new image
			switch($info['mime']) {
				case 'image/jpeg':	$sourceImg = imagecreatefromjpeg($url); break;
				case 'image/png':	$sourceImg = imagecreatefrompng($url); break;
				case 'image/gif':	$sourceImg = imagecreatefromgif($url); break;
				case 'image/webp':	$sourceImg = imagecreatefromwebp($url); break;
				default:			return false; break;
			}

			# Create thumb
			imagecopyresampled($thumb, $sourceImg, 0, 0, $startWidth, $startHeight, $width, $height, $newSize, $newSize);
			imagejpeg($thumb, $newUrl, $this->settings['thumbQuality']);
			imagedestroy($thumb);

			# Create retina thumb
			imagecopyresampled($thumb2x, $sourceImg, 0, 0, $startWidth, $startHeight, $width*2, $height*2, $newSize, $newSize);
			imagejpeg($thumb2x, $newUrl2x, $this->settings['thumbQuality']);
			imagedestroy($thumb2x);

			# Free memory
			imagedestroy($sourceImg);

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	private function adjustFile($path, $info) {

		if (!isset($path, $info)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		if (extension_loaded('imagick')) {

			$rotateImage = 0;

			switch ($info['orientation']) {

				case 3:
					$rotateImage = 180;
					$imageOrientation = 1;
					break;

				case 6:
					$rotateImage = 90;
					$imageOrientation = 1;
					break;

				case 8:
					$rotateImage = 270;
					$imageOrientation = 1;
					break;

			}

			if ($rotateImage!==0) {
				$image = new Imagick();
				$image->readImage($path);
				$image->rotateImage(new ImagickPixel(), $rotateImage);
				$image->setImageOrientation($imageOrientation);
				$image->writeImage($path);
				$image->clear();
				$image->destroy();
			}

		} else {

			$newWidth	= $info['width'];
			$newHeight	= $info['height'];
			$process	= false;
			$sourceImg	= imagecreatefromjpeg($path);

			switch ($info['orientation']) {

				case 2:
					# mirror
					# not yet implemented
					break;

				case 3:
					$process	= true;
					$sourceImg	= imagerotate($sourceImg, -180, 0);
					break;

				case 4:
					# rotate 180 and mirror
					# not yet implemented
					break;

				case 5:
					# rotate 90 and mirror
					# not yet implemented
					break;

				case 6:
					$process	= true;
					$sourceImg	= imagerotate($sourceImg, -90, 0);
					$newWidth	= $info['height'];
					$newHeight	= $info['width'];
					break;

				case 7:
					# rotate -90 and mirror
					# not yet implemented
					break;

				case 8:
					$process	= true;
					$sourceImg	= imagerotate($sourceImg, 90, 0);
					$newWidth	= $info['height'];
					$newHeight	= $info['width'];
					break;

			}

			# Need to adjust photo?
			if ($process===true) {

				# Recreate photo
				$newSourceImg = imagecreatetruecolor($newWidth, $newHeight);
				imagecopyresampled($newSourceImg, $sourceImg, 0, 0, 0, 0, $newWidth, $newHeight, $newWidth, $newHeight);
				imagejpeg($newSourceImg, $path, 100);

				# Free memory
				imagedestroy($sourceImg);
				imagedestroy($newSourceImg);

			}

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	public function get($albumID) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photo
		$photos	= $this->database->query("SELECT * FROM lychee_photos WHERE id = '$this->photoIDs' LIMIT 1;");
		$photo	= $photos->fetch_assoc();

		# Parse photo
		$photo['sysdate'] = date('d M. Y', substr($photo['id'], 0, -4));
		if (strlen($photo['takestamp'])>1) $photo['takedate'] = date('d M. Y', $photo['takestamp']);

		if ($albumID!='false') {

			if ($photo['album']!=0) {

				# Get album
				$albums = $this->database->query("SELECT public FROM lychee_albums WHERE id = '" . $photo['album'] . " LIMIT 1';");
				$album = $albums->fetch_assoc();

				# Parse album
				$photo['public'] = ($album['public']=='1' ? '2' : $photo['public']);

			}

			$photo['original_album']	= $photo['album'];
			$photo['album']			= $albumID;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $photo;

	}

	private function getInfo($url) {

		if (!isset($this->database, $url)) return false;

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
		$return['takestamp']		= '';

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
			if (isset($temp)) $return['make'] = $exif['Make'];

			$temp = @$exif['Model'];
			if (isset($temp)) $return['model'] = $temp;

			$temp = @$exif['ExposureTime'];
			if (isset($temp)) $return['shutter'] = $exif['ExposureTime'] . ' Sec.';

			$temp = @$exif['FocalLength'];
			if (isset($temp)) $return['focal'] = ($temp/1) . ' mm';

			$temp = @$exif['DateTimeOriginal'];
			if (isset($temp)) $return['takestamp'] = strtotime($temp);

		}

		# Security
		foreach(array_keys($return) as $key) $return[$key] = mysqli_real_escape_string($this->database, $return[$key]);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $return;

	}

	public function getArchive() {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photo
		$photos	= $this->database->query("SELECT title, url FROM lychee_photos WHERE id = '$this->photoIDs' LIMIT 1;");
		$photo	= $photos->fetch_object();

		# Get extension
		$extension = array_reverse(explode('.', $photo->url));

		# Parse title
		if ($photo->title=='') $photo->title = 'Untitled';

		# Set headers
		header("Content-Type: application/octet-stream");
		header("Content-Disposition: attachment; filename=\"$photo->title.$extension[0]\"");
		header("Content-Length: " . filesize(LYCHEE_UPLOADS_BIG . $photo->url));

		# Send file
		readfile(LYCHEE_UPLOADS_BIG . $photo->url);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	function setTitle($title) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Set title
		$result = $this->database->query("UPDATE lychee_photos SET title = '$title' WHERE id IN ($this->photoIDs);");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	function setDescription($description) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		$description = htmlentities($description);
		if (strlen($description)>1000) $description = substr($description, 0, 1000);

		# Set description
		$result = $this->database->query("UPDATE lychee_photos SET description = '$description' WHERE id IN ('$this->photoIDs');");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	public function setStar() {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Init vars
		$error	= false;

		# Get photos
		$photos	= $this->database->query("SELECT id, star FROM lychee_photos WHERE id IN ($this->photoIDs);");

		# For each photo
		while ($photo = $photos->fetch_object()) {

			# Invert star
			$star = ($photo->star==0 ? 1 : 0);

			# Set star
			$star = $this->database->query("UPDATE lychee_photos SET star = '$star' WHERE id = '$photo->id';");
			if (!$star) $error = true;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($error) return false;
		return true;

	}

	function getPublic($password) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photo
		$photos	= $this->database->query("SELECT public, album FROM lychee_photos WHERE id = '$this->photoIDs' LIMIT 1;");
		$photo	= $photos->fetch_object();

		# Check if public
		if ($photo->public==1) return true;
		else {
			$album	= new Album($this->database, null, null, $photo->album);
			$acP		= $album->checkPassword($password);
			$agP		= $album->getPublic();
			if ($acP===true&&$agP===true) return true;
		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return false;

	}

	public function setPublic() {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get public
		$photos	= $this->database->query("SELECT public FROM lychee_photos WHERE id = '$this->photoIDs' LIMIT 1;");
		$photo	= $photos->fetch_object();

		# Invert public
		$public = ($photo->public==0 ? 1 : 0);

		# Set public
		$result = $this->database->query("UPDATE lychee_photos SET public = '$public' WHERE id = '$this->photoIDs';");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	function setAlbum($albumID) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Set album
		$result = $this->database->query("UPDATE lychee_photos SET album = '$albumID' WHERE id IN ($this->photoIDs);");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	public function setTags($tags) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse tags
		$tags = preg_replace('/(\ ,\ )|(\ ,)|(,\ )|(,{1,}\ {0,})|(,$|^,)/', ',', $tags);
		$tags = preg_replace('/,$|^,|(\ ){0,}$/', '', $tags);
		if (strlen($tags)>1000) return false;

		# Set tags
		$result = $this->database->query("UPDATE lychee_photos SET tags = '$tags' WHERE id IN ($this->photoIDs);");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	public function delete() {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photos
		$photos = $this->database->query("SELECT id, url, thumbUrl FROM lychee_photos WHERE id IN ($this->photoIDs);");

		# For each photo
		while ($photo = $photos->fetch_object()) {

			# Get retina thumb url
			$thumbUrl2x = explode(".", $photo->thumbUrl);
			$thumbUrl2x = $thumbUrl2x[0] . '@2x.' . $thumbUrl2x[1];

			# Delete files
			if (file_exists(LYCHEE_UPLOADS_BIG . $photo->url)&&!unlink(LYCHEE_UPLOADS_BIG . $photo->url))					return false;
			if (file_exists(LYCHEE_UPLOADS_THUMB . $photo->thumbUrl)&&!unlink(LYCHEE_UPLOADS_THUMB . $photo->thumbUrl))		return false;
			if (file_exists(LYCHEE_UPLOADS_THUMB . $thumbUrl2x)&&!unlink(LYCHEE_UPLOADS_THUMB . $thumbUrl2x))				return false;

			# Delete db entry
			$delete = $this->database->query("DELETE FROM lychee_photos WHERE id = '$photo->id';");
			if (!$delete) return false;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$photos) return false;
		return true;

	}

}

?>