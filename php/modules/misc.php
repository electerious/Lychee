<?php

/**
 * @name		Misc Module
 * @author		Philipp Maurer
 * @author		Tobias Reich
 * @copyright	2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function getGraphHeader($database, $photoID) {

	if (!isset($database, $photoID)) return false;

	$photoID = mysqli_real_escape_string($database, $photoID);

	$result	= $database->query("SELECT title, description, url FROM lychee_photos WHERE id = '$photoID';");
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

function search($database, $settings, $term) {

	if (!isset($database, $settings, $term)) return false;

	$return['albums'] = '';

	// Photos
	$result = $database->query("SELECT id, title, tags, public, star, album, thumbUrl FROM lychee_photos WHERE title like '%$term%' OR description like '%$term%' OR tags like '%$term%';");
	while($row = $result->fetch_assoc()) {
		$return['photos'][$row['id']]				= $row;
		$return['photos'][$row['id']]['sysdate']	= date('d M. Y', substr($row['id'], 0, -4));
	}

	// Albums
	$result = $database->query("SELECT id, title, public, sysstamp, password FROM lychee_albums WHERE title like '%$term%' OR description like '%$term%';");
	$i		= 0;
	while($row = $result->fetch_object()) {

		// Info
		$return['albums'][$row->id]['id']		= $row->id;
		$return['albums'][$row->id]['title']	= $row->title;
		$return['albums'][$row->id]['public']	= $row->public;
		$return['albums'][$row->id]['sysdate']	= date('F Y', $row->sysstamp);
		$return['albums'][$row->id]['password']	= ($row->password=='' ? false : true);

		// Thumbs
		$result2	= $database->query("SELECT thumbUrl FROM lychee_photos WHERE album = '" . $row->id . "' " . $settings['sorting'] . " LIMIT 0, 3;");
		$k			= 0;
		while($row2 = $result2->fetch_object()){
			$return['albums'][$row->id]["thumb$k"] = $row2->thumbUrl;
			$k++;
		}

		$i++;

	}

	return $return;

}

function get_hashed_password($password) {

	# inspired by -> http://alias.io/2010/01/store-passwords-safely-with-php-and-mysql/

	# A higher "cost" is more secure but consumes more processing power
	$cost = 10;

	# Create a random salt
	$salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');

	# Prefix information about the hash so PHP knows how to verify it later.
	# "$2a$" Means we're using the Blowfish algorithm. The following two digits are the cost parameter.
	$salt = sprintf("$2a$%02d$", $cost) . $salt;

	# Hash the password with the salt
	return crypt($password, $salt);
}

?>
