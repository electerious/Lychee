<?php

/**
 * @name		Misc Module
 * @author		Philipp Maurer
 * @author		Tobias Reich
 * @copyright	2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function search($database, $settings, $term) {

	if (!isset($database, $settings, $term)) return false;

	$return['albums'] = '';

	// Photos
	$query	= Database::prepare($database, "SELECT id, title, tags, public, star, album, thumbUrl FROM ? WHERE title LIKE '%?%' OR description LIKE '%?%' OR tags LIKE '%?%'", array(LYCHEE_TABLE_PHOTOS, $term, $term, $term));
	$result	= $database->query($query);
	while($row = $result->fetch_assoc()) {
		$return['photos'][$row['id']]				= $row;
		$return['photos'][$row['id']]['thumbUrl']	= LYCHEE_URL_UPLOADS_THUMB . $row['thumbUrl'];
		$return['photos'][$row['id']]['sysdate']	= date('d M. Y', substr($row['id'], 0, -4));
	}

	// Albums
	$query	= Database::prepare($database, "SELECT id, title, public, sysstamp, password FROM ? WHERE title LIKE '%?%' OR description LIKE '%?%'", array(LYCHEE_TABLE_ALBUMS, $term, $term));
	$result = $database->query($query);
	$i		= 0;
	while($row = $result->fetch_object()) {

		// Info
		$return['albums'][$row->id]['id']		= $row->id;
		$return['albums'][$row->id]['title']	= $row->title;
		$return['albums'][$row->id]['public']	= $row->public;
		$return['albums'][$row->id]['sysdate']	= date('F Y', $row->sysstamp);
		$return['albums'][$row->id]['password']	= ($row->password=='' ? false : true);

		// Thumbs
		$query		= Database::prepare($database, "SELECT thumbUrl FROM ? WHERE album = '?' " . $settings['sorting'] . " LIMIT 0, 3", array(LYCHEE_TABLE_PHOTOS, $row->id));
		$result2	= $database->query($query);
		$k			= 0;
		while($row2 = $result2->fetch_object()){
			$return['albums'][$row->id]["thumb$k"] = LYCHEE_URL_UPLOADS_THUMB . $row2->thumbUrl;
			$k++;
		}

		$i++;

	}

	return $return;

}

function getGraphHeader($database, $photoID) {

	if (!isset($database, $photoID)) return false;

	$query	= Database::prepare($database, "SELECT title, description, url FROM ? WHERE id = '?'", array(LYCHEE_TABLE_PHOTOS, $photoID));
	$result	= $database->query($query);
	$row	= $result->fetch_object();

	$parseUrl	= parse_url("http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
	$picture	= $parseUrl['scheme']."://".$parseUrl['host'].$parseUrl['path']."/../uploads/big/".$row->url;

	$return = '<!-- General Meta Data -->';
	$return .= '<meta name="title" content="'.$row->title.'" />';
	$return .= '<meta name="description" content="'.$row->description.' - via Lychee" />';
	$return .= '<link rel="image_src" type="image/jpeg" href="'.$picture.'" />';

	$return .= '<!-- Twitter Meta Data -->';
	$return .= '<meta name="twitter:card" content="photo">';
	$return .= '<meta name="twitter:title" content="'.$row->title.'">';
	$return .= '<meta name="twitter:image:src" content="'.$picture.'">';

	$return .= '<!-- Facebook Meta Data -->';
	$return .= '<meta property="og:title" content="'.$row->title.'">';
	$return .= '<meta property="og:image" content="'.$picture.'">';

	return $return;

}

function getExtension($filename) {

	$extension = strpos($filename, '.') !== false
		? strrchr($filename, '.')
		: '';

	return $extension;

}

function get_hashed_password($password) {

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

function hasPermissions($path, $permissions = '0777') {

	/* assume that if running with the same uid as the owner of the directory it's ok */
	$stat = @stat($path);
	if ($stat && ($stat['uid'] == getmyuid())) return true;
	if (substr(sprintf('%o', @fileperms($path)), -4)!=$permissions) return false;
	else return true;

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
