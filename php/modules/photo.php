<?php

/**
 * @name        Photo Module
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function getPhoto($photoID, $albumID) {

	global $database;

	if (!is_numeric($photoID)) {
		$result = $database->query("SELECT COUNT(*) AS quantity FROM lychee_photos WHERE import_name = '../uploads/import/$photoID';");
		$row = $result->fetch_object();
		if ($row->quantity == 0) {
			importPhoto($photoID, 's');
		}
		if (is_file("../uploads/import/$photoID")) {
			importPhoto($photoID, 's');
		}
		$query = "SELECT * FROM lychee_photos WHERE import_name = '../uploads/import/$photoID' ORDER BY ID DESC;";
	} else {
		$query = "SELECT * FROM lychee_photos WHERE id = '$photoID';";
	}

    $result = $database->query($query);
    $return = $result->fetch_array();

    if ($albumID!='false') {

    	if ($return['album']!=0) {

    		$result = $database->query("SELECT public FROM lychee_albums WHERE id = " . $return['album'] . ";");
    		$return_album = $result->fetch_array();
    		if ($return_album['public']=="1") $return['public'] = "2";

    	}

    	$return['original_album'] = $return['album'];
    	$return['album'] = $albumID;
    	$return['sysdate'] = date('d M. Y', strtotime($return['sysdate']));
    	if (strlen($return['takedate'])>0) $return['takedate'] = date('d M. Y', strtotime($return['takedate']));

	}

	unset($return['album_public']);

    return $return;

}

function setPhotoPublic($photoID, $url) {

	global $database;

    $result = $database->query("SELECT public FROM lychee_photos WHERE id = '$photoID';");
    $row = $result->fetch_object();
    if ($row->public == 0){
        $public = 1;
    } else {
        $public = 0;
    }
    $result = $database->query("UPDATE lychee_photos SET public = '$public' WHERE id = '$photoID';");

    if (!$result) return false;
    return true;

}

function setPhotoStar($photoID) {

	global $database;

    $result = $database->query("SELECT star FROM lychee_photos WHERE id = '$photoID';");
    $row = $result->fetch_object();
    if ($row->star == 0) {
        $star = 1;
    } else {
        $star = 0;
    }
    $result = $database->query("UPDATE lychee_photos SET star = '$star' WHERE id = '$photoID';");
    return true;

}

function setAlbum($photoID, $newAlbum) {

	global $database;

    $result = $database->query("UPDATE lychee_photos SET album = '$newAlbum' WHERE id = '$photoID';");

    if (!$result) return false;
    else return true;

}

function setPhotoTitle($photoID, $title) {

	global $database;

    if (strlen($title)>30) return false;
    $result = $database->query("UPDATE lychee_photos SET title = '$title' WHERE id = '$photoID';");

    if (!$result) return false;
    else return true;

}

function setPhotoDescription($photoID, $description) {

	global $database;

    $description = htmlentities($description);
    if (strlen($description)>800) return false;
    $result = $database->query("UPDATE lychee_photos SET description = '$description' WHERE id = '$photoID';");

    if (!$result) return false;
    return true;

}

function deletePhoto($photoID) {

	global $database;

    $result = $database->query("SELECT * FROM lychee_photos WHERE id = '$photoID';");
    if (!$result) return false;
    $row = $result->fetch_object();
    $retinaUrl = explode(".", $row->thumbUrl);
    $unlink1 = unlink("../uploads/big/".$row->url);
    $unlink2 = unlink("../uploads/thumb/".$row->thumbUrl);
    $unlink3 = unlink("../uploads/thumb/".$retinaUrl[0].'@2x.'.$retinaUrl[1]);
    $result = $database->query("DELETE FROM lychee_photos WHERE id = '$photoID';");
    if (!$unlink1 || !$unlink2 || !$unlink3) return false;
    if (!$result) return false;

    return true;

}

function isPhotoPublic($photoID, $password) {

	global $database;

	if (is_numeric($photoID)) {
		$query = "SELECT * FROM lychee_photos WHERE id = '$photoID';";
	} else {
		$query = "SELECT * FROM lychee_photos WHERE import_name = '../uploads/import/$photoID';";
	}
    $result = $database->query($query);
    $row = $result->fetch_object();
    if (!is_numeric($photoID)&&!$row) return true;
    if ($row->public==1) return true;
    else {
    	$cAP = checkAlbumPassword($row->album, $password);
    	$iAP = isAlbumPublic($row->album);
    	if ($iAP&&$cAP) return true;
    	else return false;
    }

}

function getPhotoArchive($photoID) {

	global $database;

	$result = $database->query("SELECT * FROM lychee_photos WHERE id = '$photoID';");
	$row = $result->fetch_object();

	$extension = array_reverse(explode('.', $row->url));

	if ($row->title=='') $row->title = 'Untitled';

	header("Content-Type: application/octet-stream");
	header("Content-Disposition: attachment; filename=\"$row->title.$extension[0]\"");
	header("Content-Length: " . filesize("../uploads/big/$row->url"));

	readfile("../uploads/big/$row->url");

	return true;

}

?>