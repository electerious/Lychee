<?php

/**
 * @name		Misc Module
 * @author		Philipp Maurer
 * @author		Tobias Reich
 * @copyright	2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function openGraphHeader($photoID) {

	global $database;

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

function search($term) {

	global $database, $settings;

	$return['albums'] = '';

	// Photos
	$result = $database->query("SELECT id, title, tags, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE title like '%$term%' OR description like '%$term%' OR tags like '%$term%';");
	while($row = $result->fetch_array()) {
		$return['photos'][$row['id']]				= $row;
		$return['photos'][$row['id']]['sysdate']	= date('d F Y', strtotime($row['sysdate']));
	}

	// Albums
	$result = $database->query("SELECT id, title, public, sysdate, password FROM lychee_albums WHERE title like '%$term%' OR description like '%$term%';");
	$i		= 0;
	while($row = $result->fetch_object()) {

		// Info
		$return['albums'][$row->id]['id']		= $row->id;
		$return['albums'][$row->id]['title']	= $row->title;
		$return['albums'][$row->id]['public']	= $row->public;
		$return['albums'][$row->id]['sysdate']	= date('F Y', strtotime($row->sysdate));
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

function update($version = '') {

	global $database, $configVersion;

	// Albums
	if(!$database->query("SELECT `public` FROM `lychee_albums` LIMIT 1;"))		$database->query("ALTER TABLE `lychee_albums` ADD `public` TINYINT( 1 ) NOT NULL DEFAULT	'0'");
	if(!$database->query("SELECT `password` FROM `lychee_albums` LIMIT 1;"))	$database->query("ALTER TABLE `lychee_albums` ADD `password` VARCHAR( 100 ) NULL DEFAULT ''");
	if(!$database->query("SELECT `description` FROM `lychee_albums` LIMIT 1;"))	$database->query("ALTER TABLE `lychee_albums` ADD `description` VARCHAR( 1000 ) NULL DEFAULT ''");
	if($database->query("SELECT `password` FROM `lychee_albums` LIMIT 1;"))		$database->query("ALTER TABLE `lychee_albums` CHANGE `password` `password` VARCHAR( 100 ) NULL DEFAULT ''");

	// Photos
	if($database->query("SELECT `description` FROM `lychee_photos` LIMIT 1;"))	$database->query("ALTER TABLE `lychee_photos` CHANGE `description` `description` VARCHAR( 1000 ) NULL DEFAULT ''");
	if(!$database->query("SELECT `tags` FROM `lychee_photos` LIMIT 1;"))		$database->query("ALTER TABLE `lychee_photos` ADD `tags` VARCHAR( 1000 ) NULL DEFAULT ''");
	$database->query("UPDATE `lychee_photos` SET url = replace(url, 'uploads/big/', ''), thumbUrl = replace(thumbUrl, 'uploads/thumb/', '')");

	// Settings
	$result = $database->query("SELECT `key` FROM `lychee_settings` WHERE `key` = 'dropboxKey' LIMIT 1;");
	if ($result->num_rows===0) $database->query("INSERT INTO `lychee_settings` (`key`, `value`) VALUES ('dropboxKey', '')");

	// Config
	if ($version!==''&&$configVersion!==$version) {
		$data = file_get_contents('../data/config.php');
		$data = preg_replace('/\$configVersion = \'[\w. ]*\';/', "\$configVersion = '$version';", $data);
		if (file_put_contents('../data/config.php', $data)===false) return 'Error: Could not save updated config!';
	}

	return true;

}

?>
