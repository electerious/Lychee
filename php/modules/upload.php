<?php

/**
 * @name		Upload Module
 * @author		Philipp Maurer
 * @author		Tobias Reich
 * @copyright	2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function upload($files, $albumID) {

	global $database, $settings;

	switch($albumID) {
		// s for public (share)
		case 's':
			$public		= 1;
			$star		= 0;
			$albumID	= 0;
			break;
		// f for starred (fav)
		case 'f':
			$star		= 1;
			$public		= 0;
			$albumID	= 0;
			break;
		default:
			$star		= 0;
			$public		= 0;
	}

	foreach ($files as $file) {

		if ($file['type']!=='image/jpeg'&&
			$file['type']!=='image/png'&&
			$file['type']!=='image/gif')
				return false;

		$id = str_replace('.', '', microtime(true));
		while(strlen($id)<14) $id .= 0;

		$tmp_name	= $file['tmp_name'];
		$extension	= array_reverse(explode('.', $file['name']));
		$extension	= $extension[0];
		$photo_name	= md5($id) . ".$extension";

		// Import if not uploaded via web
		if (!is_uploaded_file($tmp_name)) {
			if (copy($tmp_name, '../uploads/big/' . $photo_name)) {
				@unlink($tmp_name);
				$import_name = $tmp_name;
			}
		} else {
			move_uploaded_file($tmp_name, '../uploads/big/' . $photo_name);
			$import_name = '';
		}

		// Read infos
		$info = getInfo($photo_name);

		// Use title of file if IPTC title missing
		if ($info['title']==='')
			$info['title'] = mysqli_real_escape_string($database, substr(basename($file['name'], ".$extension"), 0, 30));

		// Set orientation based on EXIF data
		if ($file['type']==='image/jpeg'&&isset($info['orientation'])&&isset($info['width'])&&isset($info['height'])) {

			if ($info['orientation']==3||$info['orientation']==6||$info['orientation']==8) {

				$newWidth = $info['width'];
				$newHeight = $info['height'];

				$sourceImg = imagecreatefromjpeg("../uploads/big/$photo_name");

				switch($info['orientation']){

					case 2:
						// mirror
						// not yet implemented
						break;

					case 3:
						$sourceImg = imagerotate($sourceImg, -180, 0);
						break;

					case 4:
						// rotate 180 and mirror
						// not yet implemented
						break;

					case 5:
						// rotate 90 and mirror
						// not yet implemented
						break;

					case 6:
						$sourceImg = imagerotate($sourceImg, -90, 0);
						$newWidth = $info['height'];
						$newHeight = $info['width'];
						break;

					case 7:
						// rotate -90 and mirror
						// not yet implemented
						break;

					case 8:
						$sourceImg = imagerotate($sourceImg, 90, 0);
						$newWidth = $info['height'];
						$newHeight = $info['width'];
						break;

				}

				$newSourceImg = imagecreatetruecolor($newWidth, $newHeight);

				imagecopyresampled($newSourceImg, $sourceImg, 0, 0, 0, 0, $newWidth, $newHeight, $newWidth, $newHeight);
				imagejpeg($newSourceImg, "../uploads/big/$photo_name", 100);

			}

		}

		// Create Thumb
		if (!createThumb($photo_name)) return false;

		// Save to DB
		$query = "INSERT INTO lychee_photos (id, title, url, description, type, width, height, size, sysdate, systime, iso, aperture, make, model, shutter, focal, takedate, taketime, thumbUrl, album, public, star, import_name)
			VALUES (
				'" . $id . "',
				'" . $info['title'] . "',
				'" . $photo_name . "',
				'" . $info['description'] . "',
				'" . $info['type'] . "',
				'" . $info['width'] . "',
				'" . $info['height'] . "',
				'" . $info['size'] . "',
				'" . $info['date'] . "',
				'" . $info['time'] . "',
				'" . $info['iso'] . "',
				'" . $info['aperture'] . "',
				'" . $info['make'] . "',
				'" . $info['model'] . "',
				'" . $info['shutter'] . "',
				'" . $info['focal'] . "',
				'" . $info['takeDate'] . "',
				'" . $info['takeTime'] . "',
				'" . md5($id) . ".jpeg',
				'" . $albumID . "',
				'" . $public . "',
				'" . $star . "',
				'" . $import_name . "');";
		$result = $database->query($query);

		if (!$result) return false;

	}

	return true;

}

function getInfo($filename) {

	global $database;

	$url		= '../uploads/big/' . $filename;
	$iptcArray	= array();
	$info		= getimagesize($url, $iptcArray);

	// General information
	$return['type']		= $info['mime'];
	$return['width']	= $info[0];
	$return['height']	= $info[1];
	$return['date']		= date('d.m.Y', filectime($url));
	$return['time']		= date('H:i:s', filectime($url));

	// Size
	$size = filesize($url)/1024;
	if ($size>=1024) $return['size'] = round($size/1024, 1) . ' MB';
	else $return['size'] = round($size, 1) . ' KB';

	// IPTC Metadata Fallback
	$return['title']		= '';
	$return['description']	= '';

	// IPTC Metadata
	if(isset($iptcArray['APP13'])) {

		$iptcInfo = iptcparse($iptcArray['APP13']);
		if (is_array($iptcInfo)) {

			$temp = @$iptcInfo['2#105'][0];
			if (isset($temp)&&strlen($temp)>0) $return['title'] = $temp;

			$temp = @$iptcInfo['2#120'][0];
			if (isset($temp)&&strlen($temp)>0) $return['description'] = $temp;

		}

	}

	// EXIF Metadata Fallback
	$return['orientation']	= '';
	$return['iso']			= '';
	$return['aperture']		= '';
	$return['make']			= '';
	$return['model']		= '';
	$return['shutter']		= '';
	$return['focal']		= '';
	$return['takeDate']		= '';
	$return['takeTime']		= '';

	// Read EXIF
	if ($info['mime']=='image/jpeg') $exif = @exif_read_data($url, 'EXIF', 0);
	else $exif = false;

	// EXIF Metadata
	if ($exif!==false) {

		$temp = @$exif['Orientation'];
		if (isset($temp)) $return['orientation'] = $temp;

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
		if (isset($temp)) {
			$exifDate	= explode(' ', $temp);
			$date		= explode(':', $exifDate[0]);
			$return['takeDate'] = $date[2].'.'.$date[1].'.'.$date[0];
			$return['takeTime'] = $exifDate[1];
		}

	}

	// Security
	foreach(array_keys($return) as $key) $return[$key] = mysqli_real_escape_string($database, $return[$key]);

	return $return;

}

function createThumb($filename, $width = 200, $height = 200) {

	global $settings;

	$url	= "../uploads/big/$filename";
	$info	= getimagesize($url);

	$photoName	= explode(".", $filename);
	$newUrl		= "../uploads/thumb/$photoName[0].jpeg";
	$newUrl2x	= "../uploads/thumb/$photoName[0]@2x.jpeg";

	// Set position and size
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

	// Fallback for older version
	if ($info['mime']==='image/webp'&&floatval(phpversion())<5.5) return false;

	// Create new image
	switch($info['mime']) {
		case 'image/jpeg':	$sourceImg = imagecreatefromjpeg($url); break;
		case 'image/png':	$sourceImg = imagecreatefrompng($url); break;
		case 'image/gif':	$sourceImg = imagecreatefromgif($url); break;
		case 'image/webp':	$sourceImg = imagecreatefromwebp($url); break;
		default: return false;
	}

	imagecopyresampled($thumb,$sourceImg,0,0,$startWidth,$startHeight,$width,$height,$newSize,$newSize);
	imagecopyresampled($thumb2x,$sourceImg,0,0,$startWidth,$startHeight,$width*2,$height*2,$newSize,$newSize);

	imagejpeg($thumb,$newUrl,$settings['thumbQuality']);
	imagejpeg($thumb2x,$newUrl2x,$settings['thumbQuality']);

	return true;

}

function importPhoto($path, $albumID = 0) {

	$info = getimagesize($path);
	$size = filesize($path);

	$nameFile					= array(array());
	$nameFile[0]['name']		= $path;
	$nameFile[0]['type']		= $info['mime'];
	$nameFile[0]['tmp_name']	= $path;
	$nameFile[0]['error']		= 0;
	$nameFile[0]['size']		= $size;

	return upload($nameFile, $albumID);

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
				$tmp_name = "../uploads/import/$filename";

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
			$tmp_name = "../uploads/import/$filename";

			copy($url, $tmp_name);

			return importPhoto($tmp_name, $albumID);

		}

	}

	return false;

}

function importServer($albumID = 0, $path = '../uploads/import/') {

	global $database;

	$files				= glob($path . '*');
	$contains['photos'] = false;
	$contains['albums'] = false;

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