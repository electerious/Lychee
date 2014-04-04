<?php

/**
 * @name		Album Module
 * @author		Philipp Maurer
 * @author		Tobias Reich
 * @copyright	2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function addAlbum($title, $public = 0) {

	global $database;

	if (strlen($title)<1||strlen($title)>50) return false;

	$sysdate	= date("d.m.Y");
	$result		= $database->query("INSERT INTO lychee_albums (title, sysdate, public) VALUES ('$title', '$sysdate', '$public');");

	if (!$result) return false;
	return $database->insert_id;

}

function getAlbums($public) {

	global $database, $settings;

	// Smart Albums
	if (!$public) $return = getSmartInfo();

	// Albums
	if ($public) $query = "SELECT id, title, public, sysdate, password FROM lychee_albums WHERE public = 1";
	else $query = "SELECT id, title, public, sysdate, password FROM lychee_albums";

	$result	= $database->query($query) OR exit("Error: $result <br>".$database->error);
	$i		= 0;

	while($row = $result->fetch_object()) {

		// Info
		$return["content"][$row->id]['id']		= $row->id;
		$return["content"][$row->id]['title']	= $row->title;
		$return["content"][$row->id]['public']	= $row->public;
		$return["content"][$row->id]['sysdate']	= date('F Y', strtotime($row->sysdate));

		// Password
		if ($row->password=="") $return["content"][$row->id]['password'] = false;
		else $return["content"][$row->id]['password'] = true;

		// Thumbs
		if (($public&&$row->password=="")||(!$public)) {

			$albumID = $row->id;
			$result2 = $database->query("SELECT thumbUrl FROM lychee_photos WHERE album = '$albumID' ORDER BY star DESC, " . substr($settings['sorting'], 9)	. " LIMIT 0, 3");
			$k = 0;
			while($row2 = $result2->fetch_object()){
				$return["content"][$row->id]["thumb$k"] = $row2->thumbUrl;
				$k++;
			}
			if (!isset($return["content"][$row->id]["thumb0"])) $return["content"][$row->id]["thumb0"] = "";
			if (!isset($return["content"][$row->id]["thumb1"])) $return["content"][$row->id]["thumb1"] = "";
			if (!isset($return["content"][$row->id]["thumb2"])) $return["content"][$row->id]["thumb2"] = "";

		}

		// Album count
		$i++;

	}

	$return["num"] = $i;

	return $return;

}

function getSmartInfo() {

	global $database, $settings;

	// Unsorted
	$result	= $database->query("SELECT thumbUrl FROM lychee_photos WHERE album = 0 " . $settings['sorting']);
	$i		= 0;
	while($row = $result->fetch_object()) {
		if ($i<3) $return["unsortedThumb$i"] = $row->thumbUrl;
		$i++;
	}
	$return['unsortedNum'] = $i;

	// Public
	$result2	= $database->query("SELECT thumbUrl FROM lychee_photos WHERE public = 1 " . $settings['sorting']);
	$i			= 0;
	while($row2 = $result2->fetch_object()) {
		if ($i<3) $return["publicThumb$i"] = $row2->thumbUrl;
		$i++;
	}
	$return['publicNum'] = $i;

	// Starred
	$result3	= $database->query("SELECT thumbUrl FROM lychee_photos WHERE star = 1 " . $settings['sorting']);
	$i			= 0;
	while($row3 = $result3->fetch_object()) {
		if ($i<3) $return["starredThumb$i"] = $row3->thumbUrl;
		$i++;
	}
	$return['starredNum'] = $i;

	return $return;

}

function getAlbum($albumID) {

	global $database, $settings;

	// Get album information
	switch($albumID) {

		case "f":	$return['public'] = false;
					$query = "SELECT id, title, tags, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE star = 1 " . $settings['sorting'];
					break;

		case "s":	$return['public'] = false;
					$query = "SELECT id, title, tags, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE public = 1 " . $settings['sorting'];
					break;

		case "0":	$return['public'] = false;
					$query = "SELECT id, title, tags, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE album = 0 " . $settings['sorting'];
					break;

		default:	$result = $database->query("SELECT * FROM lychee_albums WHERE id = '$albumID';");
					$row = $result->fetch_object();
					$return['title']		= $row->title;
					$return['description']	= $row->description;
					$return['sysdate']		= date('d M. Y', strtotime($row->sysdate));
					$return['public']		= $row->public;
					$return['password']		= ($row->password=="" ? false : true);
					$query = "SELECT id, title, tags, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE album = '$albumID' " . $settings['sorting'];
					break;

	}

	// Get photos
	$result				= $database->query($query);
	$previousPhotoID	= "";
	$i					= 0;
	while($row = $result->fetch_assoc()) {

		$return['content'][$row['id']]['id']		= $row['id'];
		$return['content'][$row['id']]['title']		= $row['title'];
		$return['content'][$row['id']]['sysdate']	= date('d F Y', strtotime($row['sysdate']));
		$return['content'][$row['id']]['public']	= $row['public'];
		$return['content'][$row['id']]['star']		= $row['star'];
		$return['content'][$row['id']]['tags']		= $row['tags'];
		$return['content'][$row['id']]['album']		= $row['album'];
		$return['content'][$row['id']]['thumbUrl']	= $row['thumbUrl'];

		$return['content'][$row['id']]['previousPhoto']	= $previousPhotoID;
		$return['content'][$row['id']]['nextPhoto']		= "";
		if ($previousPhotoID!="") $return['content'][$previousPhotoID]['nextPhoto'] = $row['id'];

		$previousPhotoID = $row['id'];
		$i++;

	}

	if ($i==0) {

		// Empty album
		$return['content'] = false;

	} else {

		// Enable next and previous for the first and last photo
		$lastElement	= end($return['content']);
		$lastElementId	= $lastElement['id'];
		$firstElement	= reset($return['content']);
		$firstElementId	= $firstElement['id'];

		if ($lastElementId!==$firstElementId) {
			$return['content'][$lastElementId]['nextPhoto']			= $firstElementId;
			$return['content'][$firstElementId]['previousPhoto']	= $lastElementId;
		}

	}

	$return['id']	= $albumID;
	$return['num']	= $i;

	return $return;

}

function setAlbumTitle($albumIDs, $title) {

	global $database;

	if (strlen($title)<1||strlen($title)>50) return false;
	$result = $database->query("UPDATE lychee_albums SET title = '$title' WHERE id IN ($albumIDs);");

	if (!$result) return false;
	return true;

}

function setAlbumDescription($albumID, $description) {

	global $database;

	$description = htmlentities($description);
	if (strlen($description)>1000) return false;
	$result = $database->query("UPDATE lychee_albums SET description = '$description' WHERE id = '$albumID';");

	if (!$result) return false;
	return true;

}

function deleteAlbum($albumIDs) {

	global $database;

	$error	= false;
	$result	= $database->query("SELECT id FROM lychee_photos WHERE album IN ($albumIDs);");

	// Delete photos
	while ($row = $result->fetch_object())
		if (!deletePhoto($row->id)) $error = true;

	// Delete album
	$result = $database->query("DELETE FROM lychee_albums WHERE id IN ($albumIDs);");

	if ($error||!$result) return false;
	return true;

}

function getAlbumArchive($albumID) {

	global $database;

	switch($albumID) {
		case 's':
			$query = "SELECT takedate, taketime, title, type, url FROM lychee_photos WHERE public = '1';";
			$zipTitle = "Public";
			break;
		case 'f':
			$query = "SELECT takedate, taketime, title, type, url FROM lychee_photos WHERE star = '1';";
			$zipTitle = "Starred";
			break;
		default:
			$query = "SELECT takedate, taketime, title, type, url FROM lychee_photos WHERE album = '$albumID';";
			$zipTitle = "Unsorted";
	}

	// get images from DB
	$result_images = $database->query($query);

	// there should be a proper error handling
	if ($result_images->num_rows == 0) {
		return false;
	}

	// get album title from db
	$result = @$database->query("SELECT title FROM lychee_albums WHERE id = '$albumID' LIMIT 1;");
	if ($result->num_rows == 1) {
		$row = $result->fetch_object();
		if ($albumID!=0&&is_numeric($albumID)) $zipTitle = $row->title;
	}

	// set zip file name
	$outfilename = "../data/$zipTitle.zip";

	// initialize zip file
	$zip = new ZipArchive();

	if ($zip->open($outfilename, ZIPARCHIVE::CREATE)!==TRUE) {
		return false;
	}

	// now add all files to zip file
	$img_extension  = "jpg";
	$file_stats     = array();

	// this operation should be moved to upload after getInfo();
	$set_mtime      = true;

	while($row = $result_images->fetch_object()) {

		$image_file_path = "../uploads/big/".$row->url;

		// check if file exists and is readable
		if (! @is_readable($image_file_path)) {
			continue;
		}

		switch($row->type) {
			case 'image/png':
				$img_extension = "png";
				break;
			case 'image/gif':
				$img_extension = "gif";
				break;
			default:
				$img_extension = "jpg";
		}

		// sets the file date according to exif
		// this is nasty. Changing attributes in
		// zip files is only possible with
		// php version >= 5.6
		// this way we change the date of the
		// actual file and zip saves as it as
		// mtime attribute
		if ($set_mtime === true ) {

			$file_date = @explode(".", $row->takedate);
			$file_time = @explode(":", $row->taketime);

			$file_mtime = @mktime(  $file_time[0],
						$file_time[1],
						$file_time[2],
						$file_date[1],
						$file_date[0],
						$file_date[2]);

			@touch($image_file_path, $file_mtime);
		}

		// set file name in zip file
		$zip_file_name = $zipTitle."/".$row->title.".".$img_extension;

		// add file to zip
		$zip->addFile($image_file_path, $zip_file_name);
	}

	$zip->close();

	header("Content-Type: application/zip");
	header("Content-Disposition: attachment; filename=\"$zipTitle.zip\"");
	header("Content-Length: ".filesize($outfilename));
	readfile($outfilename);
	unlink($outfilename);

	return true;

}

function setAlbumPublic($albumID, $password) {

	global $database;

	$result	= $database->query("SELECT public FROM lychee_albums WHERE id = '$albumID';");
	$row	= $result->fetch_object();
	$public	= ($row->public=='0' ? 1 : 0);

	$result = $database->query("UPDATE lychee_albums SET public = '$public', password = NULL WHERE id = '$albumID';");
	if (!$result) return false;

	if ($public==1) {
		$result = $database->query("UPDATE lychee_photos SET public = 0 WHERE album = '$albumID';");
		if (!$result) return false;
	}

	if (strlen($password)>0) return setAlbumPassword($albumID, $password);
	return true;

}

function setAlbumPassword($albumID, $password) {

	global $database;

	$result = $database->query("UPDATE lychee_albums SET password = '$password' WHERE id = '$albumID';");

	if (!$result) return false;
	return true;

}

function checkAlbumPassword($albumID, $password) {

	global $database;

	$result	= $database->query("SELECT password FROM lychee_albums WHERE id = '$albumID';");
	$row	= $result->fetch_object();

	if ($row->password=="") return true;
	else if ($row->password==$password) return true;
	return false;

}

function isAlbumPublic($albumID) {

	global $database;

	$result	= $database->query("SELECT public FROM lychee_albums WHERE id = '$albumID';");
	$row	= $result->fetch_object();

	if ($albumID==='0'||$albumID==='s'||$albumID==='f') return false;
	if ($row->public==1) return true;
	return false;

}

?>