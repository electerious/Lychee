<?php

/**
 * @name		Photo Module
 * @author		Philipp Maurer
 * @author		Tobias Reich
 * @copyright	2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function getPhoto($photoID, $albumID) {

	global $database;

	$query	= "SELECT * FROM lychee_photos WHERE id = '$photoID';";
	$result = $database->query($query);
	$return = $result->fetch_array();

	if ($albumID!='false') {

		if ($return['album']!=0) {

			$result = $database->query("SELECT public FROM lychee_albums WHERE id = '" . $return['album'] . "';");
			$return_album = $result->fetch_array();
			if ($return_album['public']=="1") $return['public'] = "2";

		}

		$return['original_album']	= $return['album'];
		$return['album']			= $albumID;
		$return['sysdate']			= date('d M. Y', strtotime($return['sysdate']));
		if (strlen($return['takedate'])>0) $return['takedate'] = date('d M. Y', strtotime($return['takedate']));

	}

	unset($return['album_public']);

	return $return;

}

function setPhotoPublic($photoID, $url) {

	global $database;

	$result	= $database->query("SELECT public FROM lychee_photos WHERE id = '$photoID';");
	$row	= $result->fetch_object();
	$public = ($row->public==0 ? 1 : 0);
	$result = $database->query("UPDATE lychee_photos SET public = '$public' WHERE id = '$photoID';");

	if (!$result) return false;
	return true;

}

function setPhotoStar($photoIDs) {

	global $database;

	$error	= false;
	$result	= $database->query("SELECT id, star FROM lychee_photos WHERE id IN ($photoIDs);");

	while ($row = $result->fetch_object()) {

		$star = ($row->star==0 ? 1 : 0);
		$star = $database->query("UPDATE lychee_photos SET star = '$star' WHERE id = '$row->id';");
		if (!$star) $error = true;

	}

	if ($error) return false;
	return true;

}

function setPhotoAlbum($photoIDs, $albumID) {

	global $database;

	$result = $database->query("UPDATE lychee_photos SET album = '$albumID' WHERE id IN ($photoIDs);");

	if (!$result) return false;
	return true;

}

function setPhotoTitle($photoIDs, $title) {

	global $database;

	if (strlen($title)>50) return false;
	$result = $database->query("UPDATE lychee_photos SET title = '$title' WHERE id IN ($photoIDs);");

	if (!$result) return false;
	return true;

}

function setPhotoDescription($photoID, $description) {

	global $database;

	$description = htmlentities($description);
	if (strlen($description)>1000) return false;

	$result = $database->query("UPDATE lychee_photos SET description = '$description' WHERE id = '$photoID';");

	if (!$result) return false;
	return true;

}

function setPhotoTags($photoIDs, $tags) {

	global $database;

	// Parse tags
	$tags = preg_replace('/(\ ,\ )|(\ ,)|(,\ )|(,{1,}\ {0,})|(,$|^,)/', ',', $tags);
	$tags = preg_replace('/,$|^,/', ',', $tags);

	if (strlen($tags)>1000) return false;

	$result = $database->query("UPDATE lychee_photos SET tags = '$tags' WHERE id IN ($photoIDs);");

	if (!$result) return false;
	return true;

}

function deletePhoto($photoIDs) {

	global $database;

	$result = $database->query("SELECT id, url, thumbUrl FROM lychee_photos WHERE id IN ($photoIDs);");

	while ($row = $result->fetch_object()) {

		// Get retina thumb url
		$thumbUrl2x = explode(".", $row->thumbUrl);
		$thumbUrl2x = $thumbUrl2x[0] . '@2x.' . $thumbUrl2x[1];

		// Delete files
		if (!unlink('../uploads/big/' . $row->url))			return false;
		if (!unlink('../uploads/thumb/' . $row->thumbUrl))	return false;
		if (!unlink('../uploads/thumb/' . $thumbUrl2x))		return false;

		// Delete db entry
		$delete = $database->query("DELETE FROM lychee_photos WHERE id = $row->id;");
		if (!$delete) return false;

	}

	if (!$result) return false;
	return true;

}

function isPhotoPublic($photoID, $password) {

	global $database;

	$query = "SELECT public, album FROM lychee_photos WHERE id = '$photoID';";

	$result	= $database->query($query);
	$row	= $result->fetch_object();

	if ($row->public==1) return true;
	else {
		$cAP = checkAlbumPassword($row->album, $password);
		$iAP = isAlbumPublic($row->album);
		if ($iAP&&$cAP) return true;
		return false;
	}

}

function getPhotoArchive($photoID) {

	global $database;

	$result	= $database->query("SELECT title, url FROM lychee_photos WHERE id = '$photoID';");
	$row	= $result->fetch_object();

	$extension = array_reverse(explode('.', $row->url));

	if ($row->title=='') $row->title = 'Untitled';

	header("Content-Type: application/octet-stream");
	header("Content-Disposition: attachment; filename=\"$row->title.$extension[0]\"");
	header("Content-Length: " . filesize("../uploads/big/$row->url"));

	readfile("../uploads/big/$row->url");

	return true;

}

?>