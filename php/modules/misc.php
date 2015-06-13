<?php

###
# @name			Misc Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function search($database, $settings, $term) {

	if (!isset($database, $settings, $term)) return false;

	$return['albums'] = '';

	# Initialize return var
	$return = array(
		'photos'	=> null,
		'albums'	=> null,
		'hash'		=> ''
	);

	###
	# Photos
	###

	$query	= Database::prepare($database, "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ? WHERE title LIKE '%?%' OR description LIKE '%?%' OR tags LIKE '%?%'", array(LYCHEE_TABLE_PHOTOS, $term, $term, $term));
	$result	= $database->query($query);

	while($photo = $result->fetch_assoc()) {

		$photo = Photo::prepareData($photo);
		$return['photos'][$photo['id']] = $photo;

	}

	###
	# Albums
	###

	$query	= Database::prepare($database, "SELECT id, title, public, sysstamp, password FROM ? WHERE title LIKE '%?%' OR description LIKE '%?%'", array(LYCHEE_TABLE_ALBUMS, $term, $term));
	$result = $database->query($query);

	while($album = $result->fetch_assoc()) {

		# Turn data from the database into a front-end friendly format
		$album = Album::prepareData($album);

		# Thumbs
		$query	= Database::prepare($database, "SELECT thumbUrl FROM ? WHERE album = '?' " . $settings['sortingPhotos'] . " LIMIT 0, 3", array(LYCHEE_TABLE_PHOTOS, $album['id']));
		$thumbs	= $database->query($query);

		# For each thumb
		$k = 0;
		while ($thumb = $thumbs->fetch_object()) {
			$album['thumbs'][$k] = LYCHEE_URL_UPLOADS_THUMB . $thumb->thumbUrl;
			$k++;
		}

		# Add to return
		$return['albums'][$album['id']] = $album;

	}

	# Hash
	$return['hash'] = md5(json_encode($return));

	return $return;

}

function getGraphHeader($database, $photoID) {

	if (!isset($database, $photoID)) return false;

	$photo = new Photo($database, null, null, $photoID);
	if ($photo->getPublic('')===false) return false;

	$query	= Database::prepare($database, "SELECT title, description, url, medium FROM ? WHERE id = '?'", array(LYCHEE_TABLE_PHOTOS, $photoID));
	$result	= $database->query($query);
	$row	= $result->fetch_object();

	if (!$result||!$row) return false;

	if ($row->medium==='1')	$dir = 'medium';
	else					$dir = 'big';

	$parseUrl	= parse_url('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
	$url		= $parseUrl['scheme'] . '://' . $parseUrl['host'] . $parseUrl['path'] . '?' . $parseUrl['query'];
	$picture	= $parseUrl['scheme'] . '://' . $parseUrl['host'] . $parseUrl['path'] . '/../uploads/' . $dir . '/' . $row->url;

	$url		= htmlentities($url);
	$picture	= htmlentities($picture);

	$row->title			= htmlentities($row->title);
	$row->description	= htmlentities($row->description);

	$return = '<!-- General Meta Data -->';
	$return .= '<meta name="title" content="' . $row->title . '">';
	$return .= '<meta name="description" content="' . $row->description . ' - via Lychee">';
	$return .= '<link rel="image_src" type="image/jpeg" href="' . $picture . '">';

	$return .= '<!-- Twitter Meta Data -->';
	$return .= '<meta name="twitter:card" content="photo">';
	$return .= '<meta name="twitter:title" content="' . $row->title . '">';
	$return .= '<meta name="twitter:image:src" content="' . $picture . '">';

	$return .= '<!-- Facebook Meta Data -->';
	$return .= '<meta property="og:title" content="' . $row->title . '">';
	$return .= '<meta property="og:description" content="' . $row->description . ' - via Lychee">';
	$return .= '<meta property="og:image" content="' . $picture . '">';
	$return .= '<meta property="og:url" content="' . $url . '">';

	return $return;

}

function getExtension($filename) {

	$extension = strpos($filename, '.') !== false
		? strrchr($filename, '.')
		: '';

	return $extension;

}

function getHashedString($password) {

	# Inspired by http://alias.io/2010/01/store-passwords-safely-with-php-and-mysql/

	# A higher $cost is more secure but consumes more processing power
	$cost = 10;

	# Create a random salt
	if (extension_loaded('openssl')) {
		$salt = strtr(substr(base64_encode(openssl_random_pseudo_bytes(17)),0,22), '+', '.');
	} elseif (extension_loaded('mcrypt')) {
		$salt = strtr(substr(base64_encode(mcrypt_create_iv(17, MCRYPT_DEV_URANDOM)),0,22), '+', '.');
	} else {
		$salt = "";
		for ($i = 0; $i < 22; $i++) {
			$salt .= substr("./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", mt_rand(0, 63), 1);
		}
	}

	# Prefix information about the hash so PHP knows how to verify it later.
	# "$2a$" Means we're using the Blowfish algorithm. The following two digits are the cost parameter.
	$salt = sprintf("$2a$%02d$", $cost) . $salt;

	# Hash the password with the salt
	return crypt($password, $salt);

}

function hasPermissions($path) {

	// Check if the given path is readable and writable
	// Both functions are also verifying that the path exists
	if (is_readable($path)===true&&
		is_writeable($path)===true) return true;

	return false;

}

function fastimagecopyresampled(&$dst_image, $src_image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h, $quality = 4) {

	###
	# Plug-and-Play fastimagecopyresampled function replaces much slower imagecopyresampled.
	# Just include this function and change all "imagecopyresampled" references to "fastimagecopyresampled".
	# Typically from 30 to 60 times faster when reducing high resolution images down to thumbnail size using the default quality setting.
	# Author: Tim Eckel - Date: 09/07/07 - Version: 1.1 - Project: FreeRingers.net - Freely distributable - These comments must remain.
	#
	# Optional "quality" parameter (defaults is 3). Fractional values are allowed, for example 1.5. Must be greater than zero.
	# Between 0 and 1 = Fast, but mosaic results, closer to 0 increases the mosaic effect.
	# 1 = Up to 350 times faster. Poor results, looks very similar to imagecopyresized.
	# 2 = Up to 95 times faster.  Images appear a little sharp, some prefer this over a quality of 3.
	# 3 = Up to 60 times faster.  Will give high quality smooth results very close to imagecopyresampled, just faster.
	# 4 = Up to 25 times faster.  Almost identical to imagecopyresampled for most images.
	# 5 = No speedup. Just uses imagecopyresampled, no advantage over imagecopyresampled.
	###

	if (empty($src_image) || empty($dst_image) || $quality <= 0) { return false; }

	if ($quality < 5 && (($dst_w * $quality) < $src_w || ($dst_h * $quality) < $src_h)) {

		$temp = imagecreatetruecolor($dst_w * $quality + 1, $dst_h * $quality + 1);
		imagecopyresized($temp, $src_image, 0, 0, $src_x, $src_y, $dst_w * $quality + 1, $dst_h * $quality + 1, $src_w, $src_h);
		imagecopyresampled($dst_image, $temp, $dst_x, $dst_y, 0, 0, $dst_w, $dst_h, $dst_w * $quality, $dst_h * $quality);
		imagedestroy($temp);

	} else imagecopyresampled($dst_image, $src_image, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h);

	return true;

}

?>
