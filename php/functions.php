<?php

/**
 * @name        functions.php
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) die('Direct access is not allowed!');

// Database Functions
function dbConnect() {
    global $db, $dbUser, $dbPassword, $dbHost;
    $database = new mysqli($dbHost, $dbUser, $dbPassword);
    if (mysqli_connect_errno() != 0) {
	    echo mysqli_connect_errno().': '.mysqli_connect_error();
        return false;
	}
	if (!$database->select_db($db)) {
		createDatabase($db, $database);
	}
    $query = "SELECT * FROM lychee_photos, lychee_albums;";
    if (!$database->query($query)) createTables($database);
    return $database;
}
function dbClose() {
	global $database;
    if (!$database->close()) {
        echo "Closing the connection failed!";
        return false;
    }
    return true;
}
function createDatabase($db, $database) {
	$result = $database->query("CREATE DATABASE IF NOT EXISTS $db;");
	$database->select_db($db);
	if (!$result) return false;
	return true;
}
function createTables($database) {
    $query = "CREATE TABLE IF NOT EXISTS `lychee_albums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `sysdate` varchar(10) NOT NULL,
  `public` TINYINT(1) DEFAULT '0',
  `password` VARCHAR(100),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";
    $result = $database->query($query);
    if (!$result) return false;

    $query = "CREATE TABLE `lychee_photos` (
  `id` bigint(14) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(160) NOT NULL,
  `url` varchar(100) NOT NULL,
  `public` tinyint(1) NOT NULL,
  `type` varchar(10) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `size` varchar(10) NOT NULL,
  `sysdate` varchar(10) NOT NULL,
  `systime` varchar(8) NOT NULL,
  `iso` varchar(15) NOT NULL,
  `aperture` varchar(10) NOT NULL,
  `make` varchar(20) NOT NULL,
  `model` varchar(50) NOT NULL,
  `shutter` varchar(20) NOT NULL,
  `focal` varchar(10) NOT NULL,
  `takedate` varchar(10) NOT NULL,
  `taketime` varchar(8) NOT NULL,
  `star` tinyint(1) NOT NULL,
  `thumbUrl` varchar(50) NOT NULL,
  `album` varchar(30) NOT NULL DEFAULT '0',
  `import_name` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;";
    $result = $database->query($query);
    if (!$result) return false;
    return true;
}

// Upload Functions
function upload($files, $albumID) {

	global $database;

	switch($albumID) {
		// s for public (share)
	    case 's':
	        $public = 1;
	        $star = 0;
	        $albumID = 0;
	        break;
	    // f for starred (fav)
	    case 'f':
	        $star = 1;
	        $public = 0;
	        $albumID = 0;
	        break;
	    default:
	        $star = 0;
	        $public = 0;
	}

	foreach ($files as $file) {

	    $id = str_replace('.', '', microtime(true));
	    while(strlen($id)<14) $id .= 0;
	    $tmp_name = $file["tmp_name"];
	    $type = getimagesize($tmp_name);
	    if (($type[2]!=1)&&($type[2]!=2)&&($type[2]!=3)) return false;
	    $data = $file["name"];
	    $data = explode('.',$data);
	    $data = array_reverse ($data);
	    $data = $data[0];

	    // Import if not uploaded via web
	    if (!is_uploaded_file($file)) {
	    	if (copy($tmp_name, "../uploads/big/" . md5($id) . ".$data")) {
				unlink($tmp_name);
				$import_name = $tmp_name;
			}
	    } else {
		    move_uploaded_file($tmp_name, "../uploads/big/" . md5($id) . ".$data");
		    $import_name = "";
	    }

	    // Create Thumb
	    createThumb(md5($id).".".$data);

	    // Read infos
	    $info = getCamera(md5($id).".".$data);
	    $title = "";
	    if (isset($info['type'])){$type=$info['type'];} else {$type="";}
	    if (isset($info['width'])){$width=$info['width'];} else {$width="";}
	    if (isset($info['height'])){$height=$info['height'] OR "";} else {$height="";}
	    if (isset($info['size'])){$size=$info['size'] OR "";} else {$size="";}
	    if (isset($info['date'])){$sysdate=$info['date'];} else {$sysdate="";}
	    if (isset($info['time'])){$systime=$info['time'];} else {$systime="";}
	    if (isset($info['iso'])){$iso=$info['iso'];} else {$iso="";}
	    if (isset($info['aperture'])){$aperture=$info['aperture'];} else {$aperture="";}
	    if (isset($info['make'])){$make=$info['make'];} else {$make="";}
	    if (isset($info['model'])){$model=$info['model'] OR "";} else {$model="";}
	    if (isset($info['shutter'])){$shutter=$info['shutter'];} else {$shutter="";}
	    if (isset($info['focal'])){$focal=$info['focal'];} else {$focal="";}
	    if (isset($info['takeDate'])){$takeDate=$info['takeDate'];} else {$takeDate="";}
	    if (isset($info['takeTime'])){$takeTime=$info['takeTime'];} else {$takeTime="";}
	    $query = "INSERT INTO lychee_photos (id, title, description, url, type, width, height, size, sysdate, systime, iso, aperture, make, model, shutter, focal, takedate, taketime, thumbUrl, album, public, star, import_name)
	        VALUES ('$id', '$title', '" . md5($id) . ".$data', '', '$type', '$width', '$height', '$size', '$sysdate', '$systime', '$iso', '$aperture', '$make', '$model', '$shutter', '$focal', '$takeDate', '$takeTime', '" . md5($id) . ".$data', '$albumID', '$public', '$star', '$import_name');";
	    $result = $database->query($query);

    }

    return true;

}
function getCamera($filename) {
	global $database;
    $url = "../uploads/big/$filename";
    $type = getimagesize($url);
    $type = $type['mime'];

    if (($type == "image/jpeg") && function_exists('exif_read_data') ){

        $exif = exif_read_data($url, "EXIF", 0);

        // General information
        $return['name'] = $exif['FileName'];
        $generalInfos = getimagesize($url);
        $return['type'] = $generalInfos['mime'];
        $return['width'] = $generalInfos[0];
        $return['height'] = $generalInfos[1];
        $size = (filesize($url) / 1024);
        if ($size >= 1024){$size=round($size/1024,1)." MB";} else {$size=round($size,1)." KB";}
        $return['size'] = $size;
        $return['date'] = date("d.m.Y",filectime($url));
        $return['time'] = date("H:i:s",filectime($url));

        // Camera Information
        if (isset($exif['ISOSpeedRatings'])){$return['iso']="ISO-".$exif['ISOSpeedRatings'];}
        if (isset($exif['COMPUTED']['ApertureFNumber'])){$return['aperture']=$exif['COMPUTED']['ApertureFNumber'];}
        if (isset($exif['Make'])){$return['make']=$exif['Make'];}
        if (isset($exif['Model'])){$return['model']=$exif['Model'];}
        if (isset($exif['ExposureTime'])){$return['shutter']=$exif['ExposureTime']." Sek.";}
        if (isset($exif['FocalLength'])){$return['focal']=($exif['FocalLength']/1)." mm";}
        if (isset($exif['Software'])){$return['software']=$exif['Software'];}
        if (isset($exif['DateTimeOriginal'])) {
            $exifDate = explode(" ",$exif['DateTimeOriginal']);
            $date = explode(":", $exifDate[0]); $return['takeDate'] = $date[2].".".$date[1].".".$date[0];
            $return['takeTime'] = $exifDate[1];
        }

    } else {

        $exif = getimagesize($url);
        $return['type'] = $exif['mime'];
        $return['width'] = $exif[0];
        $return['height'] = $exif[1];
        $size = (filesize($url) / 1024);
        if ($size >= 1024){$size=round($size/1024,1)." MB";} else {$size=round($size,1)." KB";}
        $return['size'] = $size;
        $return['date'] = date("d.m.Y",filectime($url));
        $return['time'] = date("H:i:s",filectime($url));

    }
    return $return;
}
function createThumb($filename, $width = 200, $width2x = 400, $height = 200, $height2x = 400) {

	global $database, $thumbQuality;
    $photoUrl = "../uploads/big/$filename";
    $newUrl = "../uploads/thumb/$filename";
    $thumbPhotoName = explode(".", $filename);
    $newUrl2x = "../uploads/thumb/".$thumbPhotoName[0]."@2x.".$thumbPhotoName[1];
    $oldImg = getimagesize($photoUrl);
    $type = $oldImg['mime'];

    // Set position and size
    $thumb = imagecreatetruecolor($width, $height);
    $thumb2x = imagecreatetruecolor($width2x, $height2x);
    if ($oldImg[0]<$oldImg[1]) {
        $newSize = $oldImg[0];
        $startWidth = 0;
        $startHeight = $oldImg[1]/2 - $oldImg[0]/2;
    } else {
        $newSize = $oldImg[1];
        $startWidth = $oldImg[0]/2 - $oldImg[1]/2;
        $startHeight = 0;
    }

    // Create new image
    switch($type) {
        case "image/jpeg": $sourceImg = imagecreatefromjpeg($photoUrl); break;
        case "image/png": $sourceImg = imagecreatefrompng($photoUrl); break;
        case "image/gif": $sourceImg = imagecreatefromgif($photoUrl); break;
        default: return false;
    }
    imagecopyresampled($thumb,$sourceImg,0,0,$startWidth,$startHeight,$width,$height,$newSize,$newSize);
    imagecopyresampled($thumb2x,$sourceImg,0,0,$startWidth,$startHeight,$width2x,$height2x,$newSize,$newSize);
    switch($type) {
        case "image/jpeg": imagejpeg($thumb,$newUrl,$thumbQuality); imagejpeg($thumb2x,$newUrl2x,$thumbQuality); break;
        case "image/png": imagepng($thumb,$newUrl); imagepng($thumb2x,$newUrl2x); break;
        case "image/gif": imagegif($thumb,$newUrl); imagegif($thumb2x,$newUrl2x); break;
        default: return false;
    }

    return true;

}

// Session Functions
function init($mode) {
	global $checkForUpdates;
	$return["config"]["checkForUpdates"] = $checkForUpdates;
	if ($mode=="admin") $return["loggedIn"] = true;
	else $return["loggedIn"] = false;
	return $return;
}
function login($loginUser, $loginPassword) {
	global $database, $user, $password;
    if ($loginUser==$user&&$loginPassword==md5($password)) {
    	// Admin Login
        $_SESSION['login'] = true;
        return true;
    } else {
    	return false;
    }
}
function logout() {
    session_destroy();
    return true;
}

// Album Functions
function addAlbum($title) {
	global $database;
    $title = mysqli_real_escape_string($database, urldecode($title));
    if (strlen($title)<1||strlen($title)>30) return false;
    $sysdate = date("d.m.Y");
    $query = "INSERT INTO lychee_albums (title, sysdate) VALUES ('$title', '$sysdate');";
    $result = $database->query($query);
    if (!$result) return false;
    return $database->insert_id;
}
function getAlbums($public) {
	global $database, $sorting;

    // Smart Albums
    if (!$public) $return = getSmartInfo();

    // Albums
    if ($public) $query = "SELECT * FROM lychee_albums WHERE public = 1 ORDER BY id $sorting;";
    else $query = "SELECT * FROM lychee_albums ORDER BY id $sorting;";
    $result = $database->query($query) OR die("Error: $result <br>".$database->error);
    $i=0;
    while($row = $result->fetch_object()) {
    	$return["content"][$row->id]['id'] = $row->id;
        $return["content"][$row->id]['title'] = $row->title;
        $return["content"][$row->id]['public'] = $row->public;
        $return["content"][$row->id]['sysdate'] = $row->sysdate;
        if ($row->password=="") $return["content"][$row->id]['password'] = false;
        else $return["content"][$row->id]['password'] = true;

        // Thumbs
        if (($public&&$row->password=="")||(!$public)) {
	        $albumID = $row->id;
	        $query = "SELECT thumbUrl FROM lychee_photos WHERE album = '$albumID' ORDER BY id $sorting LIMIT 0, 3;";
	        $result2 = $database->query($query);
	        $k = 0;
	        while($row2 = $result2->fetch_object()){
	            $return["content"][$row->id]["thumb$k"] = $row2->thumbUrl;
	            $k++;
	        }
	        if (!isset($return["content"][$row->id]["thumb0"])) $return["content"][$row->id]["thumb0"]="";
	        if (!isset($return["content"][$row->id]["thumb1"])) $return["content"][$row->id]["thumb1"]="";
	        if (!isset($return["content"][$row->id]["thumb2"])) $return["content"][$row->id]["thumb2"]="";
        }
        $i++;
    }
    if ($i==0) $return["albums"] = false;
    else $return["albums"] = true;
    return $return;
}
function getAlbum($albumID) {
	global $database, $sorting;
	switch($albumID) {
	    case "f":
	    	$return['public'] = false;
	    	$query = "SELECT id, title, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE star = 1 ORDER BY id $sorting;";
	        break;
	    case "s":
	    	$return['public'] = false;
	    	$query = "SELECT id, title, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE public = 1 ORDER BY id $sorting;";
	        break;
	    case 0:
	    	$return['public'] = false;
	    	$query = "SELECT id, title, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE album = 0 ORDER BY id $sorting;";
	    default:
	    	$result = $database->query("SELECT title, public, password FROM lychee_albums WHERE id = '$albumID';");
	    	$row = $result->fetch_object();
	    	$return['title'] = $row->title;
	    	$return['public'] = $row->public;
	    	if ($row->password=="") $return['password'] = false;
	    	else $return['password'] = true;
	    	$query = "SELECT id, title, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE album = '$albumID' ORDER BY id $sorting;";
	    	break;
	}
	$result = $database->query($query);
	$i = 0;
	while($row = $result->fetch_array()) {
	    $return['content'][$row['id']] = $row;
	    $i++;
	}
	if ($i==0) $return['content'] = false;
	$return['id'] = $albumID;
	$return['num'] = $i;
	return $return;
}
function getSmartInfo() {

	global $database, $sorting;

	// Unsorted
    $query = "SELECT * FROM lychee_photos WHERE album = 0 ORDER BY id $sorting;";
    $result = $database->query($query);
    $i = 0;
    while($row = $result->fetch_object()) {
        if ($i<3) $return["unsortedThumb$i"] = $row->thumbUrl;
        $i++;
    }
    $return['unsortedNum'] = $i;

	// Public
    $query2 = "SELECT * FROM lychee_photos WHERE public = 1 ORDER BY id $sorting;";
    $result2 = $database->query($query2);
    $i = 0;
    while($row2 = $result2->fetch_object()) {
        if ($i<3) $return["publicThumb$i"] = $row2->thumbUrl;
        $i++;
    }
    $return['publicNum'] = $i;

	// Starred
    $query3 = "SELECT * FROM lychee_photos WHERE star = 1 ORDER BY id $sorting;";
    $result3 = $database->query($query3);
    $i = 0;
    while($row3 = $result3->fetch_object()) {
        if ($i<3) $return["starredThumb$i"] = $row3->thumbUrl;
        $i++;
    }
    $return['starredNum'] = $i;

    return $return;

}
function setAlbumTitle($albumID, $title) {
	global $database;
    $title = mysqli_real_escape_string($database, urldecode($title));
    if (strlen($title)<1||strlen($title)>30) return false;
    $query = "UPDATE lychee_albums SET title = '$title' WHERE id = '$albumID';";
    $result = $database->query($query);
    if (!$result) return false;
    return true;
}
function deleteAlbum($albumID, $delAll) {
	global $database;
    if ($delAll=="true") {
        $query = "SELECT id FROM lychee_photos WHERE album = '$albumID';";
        $result = $database->query($query);
        $error = false;
        while($row =  $result->fetch_object()) {
            if (!deletePhoto($row->id)) $error = true;
        }
    } else {
        $query = "UPDATE lychee_photos SET album = '0' WHERE album = '$albumID';";
        $result = $database->query($query);
        if (!$result) return false;
    }
    if ($albumID!=0) {
        $query = "DELETE FROM lychee_albums WHERE id = '$albumID';";
        $result = $database->query($query);
        if (!$result) return false;
    }
    if ($error) return false;
    return true;
}
function getAlbumArchive($albumID) {
	global $database;
    switch($albumID) {
        case 's':
            $query = "SELECT * FROM lychee_photos WHERE public = '1';";
            $zipTitle = "Public";
            break;
        case 'f':
            $query = "SELECT * FROM lychee_photos WHERE star = '1';";
            $zipTitle = "Starred";
            break;
        default:
            $query = "SELECT * FROM lychee_photos WHERE album = '$albumID';";
            $zipTitle = "Unsorted";
    }
    $result = $database->query($query);
    $files = array();
    $i=0;
    while($row = $result->fetch_object()) {
        $files[$i] = "../uploads/big/".$row->url;
        $i++;
    }
    $query = "SELECT * FROM lychee_albums WHERE id = '$albumID';";
    $result = $database->query($query);
    $row = $result->fetch_object();
    if ($albumID!=0&&is_numeric($albumID))$zipTitle = $row->title;
    $filename = "../uploads/".$zipTitle.".zip";

    $zip = new ZipArchive();

    if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE) {
        return false;
    }

    foreach($files AS $zipFile) {
        $newFile = explode("/",$zipFile);
        $newFile = array_reverse($newFile);
        $zip->addFile($zipFile, $zipTitle."/".$newFile[0]);
    }

    $zip->close();

    header("Content-Type: application/zip");
    header("Content-Disposition: attachment; filename=\"$zipTitle.zip\"");
    header("Content-Length: ".filesize($filename));
    readfile($filename);
    unlink($filename);

    return true;
}
function setAlbumPublic($albumID, $password) {
	global $database;
	$query = "SELECT public FROM lychee_albums WHERE id = '$albumID';";
	$result = $database->query($query);
	$row = $result->fetch_object();
	if ($row->public == 0){
	    $public = 1;
	} else {
	    $public = 0;
	}
	$query = "UPDATE lychee_albums SET public = '$public', password = NULL WHERE id = '$albumID';";
	$result = $database->query($query);
	if (!$result) return false;
	if ($public==1) {
		$query = "UPDATE lychee_photos SET public = 0 WHERE album = '$albumID';";
		$result = $database->query($query);
		if (!$result) return false;
	}
	if (strlen($password)>0) return setAlbumPassword($albumID, $password);
	else return true;
}
function setAlbumPassword($albumID, $password) {
	global $database;
	$query = "UPDATE lychee_albums SET password = '$password' WHERE id = '$albumID';";
	$result = $database->query($query);
	if (!$result) return false;
	return true;
}
function checkAlbumPassword($albumID, $password) {
	global $database;
	$query = "SELECT public, password FROM lychee_albums WHERE id = '$albumID';";
	$result = $database->query($query);
	$row = $result->fetch_object();
	if ($row->password=="") return true;
	else if ($row->password==$password) return true;
	else return false;
}
function isAlbumPublic($albumID) {
	global $database;
	$query = "SELECT public, password FROM lychee_albums WHERE id = '$albumID';";
	$result = $database->query($query);
	$row = $result->fetch_object();
	if ($row->public==1) return true;
	else return false;
}

// Photo Functions
function getPhoto($photoID, $albumID) {
	global $database;
	if (!is_numeric($photoID)) {
		$query = "SELECT COUNT(*) AS quantity FROM lychee_photos WHERE import_name = '../uploads/import/$photoID';";
		$result = $database->query($query);
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

	    $nextPhoto = getNextPhotoID($photoID, $albumID, false);
	    if ($nextPhoto==$photoID) $return['nextPhoto'] = false;
		else $return['nextPhoto'] = $nextPhoto;

		$previousPhoto = getPreviousPhotoID($photoID, $albumID, false);
		if ($previousPhoto==$photoID) $return['previousPhoto'] = false;
		else $return['previousPhoto'] = $previousPhoto;

	}

	unset($return['album_public']);

    return $return;
}
function setPhotoPublic($photoID, $url) {
	global $database;
    $query = "SELECT public FROM lychee_photos WHERE id = '$photoID';";
    $result = $database->query($query);
    $row = $result->fetch_object();
    if ($row->public == 0){
        $public = 1;
    } else {
        $public = 0;
    }
    $query = "UPDATE lychee_photos SET public = '$public' WHERE id = '$photoID';";
    $result = $database->query($query);
    if (!$result) return false;
    return true;
}
function setPhotoStar($photoID) {
	global $database;
    $query = "SELECT star FROM lychee_photos WHERE id = '$photoID';";
    $result = $database->query($query);
    $row = $result->fetch_object();
    if ($row->star == 0) {
        $star = 1;
    } else {
        $star = 0;
    }
    $query = "UPDATE lychee_photos SET star = '$star' WHERE id = '$photoID';";
    $result = $database->query($query);
    return true;
}
function getNextPhotoID($photoID, $albumID, $innerCall) {
	global $database, $sorting;
	if (!$innerCall&&$sorting=="ASC") return getPreviousPhotoID($photoID, $albumID, true);
    switch($albumID) {
        case 'f': $query = "SELECT id FROM lychee_photos WHERE id < '$photoID' AND star = '1' ORDER BY id DESC LIMIT 0, 1;";
            break;
        case 's': $query = "SELECT id FROM lychee_photos WHERE id < '$photoID' AND public = '1' ORDER BY id DESC LIMIT 0, 1;";
            break;
        default: $query = "SELECT id FROM lychee_photos WHERE id < '$photoID' AND album = '$albumID' ORDER BY id DESC LIMIT 0, 1;";
    }
    $result = $database->query($query);
    $return = $result->fetch_array();
    if (!$return || ($return==0)) {
        switch($albumID) {
            case 'f': $query = "SELECT id FROM lychee_photos WHERE star = '1' ORDER BY id DESC LIMIT 0, 1;";
                break;
            case 's': $query = "SELECT id FROM lychee_photos WHERE public = '1' ORDER BY id DESC LIMIT 0, 1;";
                break;
            default: $query = "SELECT id FROM lychee_photos WHERE album = '$albumID' ORDER BY id DESC LIMIT 0, 1;";
        }
        $result = $database->query($query);
        $return = $result->fetch_array();
    }
    return $return['id'];
}
function getPreviousPhotoID($photoID, $albumID, $innerCall) {
	global $database, $sorting;
	if (!$innerCall&&$sorting=="ASC") return getNextPhotoID($photoID, $albumID, true);
    switch($albumID) {
        case 'f': $query = "SELECT id FROM lychee_photos WHERE id > '$photoID' AND star = '1' ORDER BY id LIMIT 0, 1;";
            break;
        case 's': $query = "SELECT id FROM lychee_photos WHERE id > '$photoID' AND public = '1' ORDER BY id LIMIT 0, 1;";
            break;
        default: $query = "SELECT id FROM lychee_photos WHERE id > '$photoID' AND album = '$albumID' ORDER BY id LIMIT 0, 1;";
    }
    $result = $database->query($query);
    $return = $result->fetch_array();
    if (!$return || ($return==0)) {
        switch($albumID) {
            case 'f': $query = "SELECT id FROM lychee_photos WHERE star = '1' ORDER BY id LIMIT 0, 1;";
                break;
            case 's': $query = "SELECT id FROM lychee_photos WHERE public = '1' ORDER BY id LIMIT 0, 1;";
                break;
            default: $query = "SELECT id FROM lychee_photos WHERE album = '$albumID' ORDER BY id LIMIT 0, 1;";
        }
        $result = $database->query($query);
        $return = $result->fetch_array();
    }
    return $return['id'];
}
function setAlbum($photoID, $newAlbum) {
	global $database;
    $query = "UPDATE lychee_photos SET album = '$newAlbum' WHERE id = '$photoID';";
    $result = $database->query($query);
    if (!$result) return false;
    else return true;
}
function setPhotoTitle($photoID, $title) {
	global $database;
    $title = mysqli_real_escape_string($database, urldecode($title));
    if (strlen($title)>30) return false;
    $query = "UPDATE lychee_photos SET title = '$title' WHERE id = '$photoID';";
    $result = $database->query($query);
    if (!$result) return false;
    else return true;
}
function setPhotoDescription($photoID, $description) {
	global $database;
    $description = mysqli_real_escape_string($database, htmlentities($description));
    if (strlen($description)>160) return false;
    $query = "UPDATE lychee_photos SET description = '$description' WHERE id = '$photoID';";
    $result = $database->query($query);
    if (!$result) return false;
    return true;
}
function deletePhoto($photoID) {
	global $database;
    $query = "SELECT * FROM lychee_photos WHERE id = '$photoID';";
    $result = $database->query($query);
    if (!$result) return false;
    $row = $result->fetch_object();
    $retinaUrl = explode(".", $row->thumbUrl);
    $unlink1 = unlink("../uploads/big/".$row->url);
    $unlink2 = unlink("../uploads/thumb/".$row->thumbUrl);
    $unlink3 = unlink("../uploads/thumb/".$retinaUrl[0].'@2x.'.$retinaUrl[1]);
    $query = "DELETE FROM lychee_photos WHERE id = '$photoID';";
    $result = $database->query($query);
    if (!$unlink1 || !$unlink2 || !$unlink3) return false;
    if (!$result) return false;
    return true;
}
function importPhoto($name, $albumID) {
	$tmp_name = "../uploads/import/$name";
	$details = getimagesize($tmp_name);
	$size = filesize($tmp_name);
	$nameFile = array(array());
	$nameFile[0]['name'] = $name;
	$nameFile[0]['type'] = $details['mime'];
	$nameFile[0]['tmp_name'] = $tmp_name;
	$nameFile[0]['error'] = 0;
	$nameFile[0]['size'] = $size;
	if (!upload($nameFile, $albumID)) return false;
	else return true;
}
function importUrl($url, $albumID) {
	if (@getimagesize($url)) {
		$pathinfo = pathinfo($url);
		$filename = $pathinfo['filename'].".".$pathinfo['extension'];
		$tmp_name = "../uploads/import/$filename";
		copy($url, $tmp_name);
		return importPhoto($filename, $albumID);
	} else {
		return false;
	}
}

// Share Functions
function facebookHeader($photoID) {
	$database = dbConnect();
    if (!is_numeric($photoID)) return false;
    $query = "SELECT * FROM lychee_photos WHERE id = '$photoID';";
    $result = $database->query($query);
    $row = $result->fetch_object();

    $parseUrl = parse_url("http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
    $thumb = $parseUrl['scheme']."://".$parseUrl['host'].$parseUrl['path']."/../uploads/big/".$row->thumbUrl;

	$return .= '<!-- General Meta Data -->';
	$return  = '<meta name="title" content="'.$row->title.'" />';
	$return .= '<meta name="description" content="'.$row->description.' - via Lychee" />';
	$return .= '<link rel="image_src"  type="image/jpeg" href="'.$thumb.'" />';

	$return .= '<!-- Twitter Meta Data -->';
	$return .= '<meta name="twitter:card" content="photo">';
	$return .= '<meta name="twitter:title" content="'.$row->title.'">';
	$return .= '<meta name="twitter:image:src" content="'.$thumb.'">';

	$return .= '<!-- Facebook Meta Data -->';
	$return .= '<meta property="og:title" content="'.$row->title.'">';
	$return .= '<meta property="og:image" content="'.$thumb.'">';

    return $return;
}
function isPhotoPublic($photoID, $password) {
	global $database;
	$photoID = mysqli_real_escape_string($database, $photoID);
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

// Search Function
function search($term) {
	global $database, $sorting;
	$return["albums"] = "";
    $term = mysqli_real_escape_string($database, $term);

    $query = "SELECT * FROM lychee_photos WHERE title like '%$term%' OR description like '%$term%';";
    $result = $database->query($query);
    while($row = $result->fetch_array()) {
        $return['photos'][$row['id']] = $row;
    }

    $query = "SELECT * FROM lychee_albums WHERE title like '%$term%';";
    $result = $database->query($query);
    $i=0;
    while($row = $result->fetch_object()) {

        $return["albums"][$row->id]['id'] = $row->id;
        $return["albums"][$row->id]['title'] = $row->title;
        $return["albums"][$row->id]['public'] = $row->public;
        $return["albums"][$row->id]['sysdate'] = $row->sysdate;
        if ($row->password=="") $return["albums"][$row->id]['password'] = false;
        else $return["albums"][$row->id]['password'] = true;

        $query2 = "SELECT thumbUrl FROM lychee_photos WHERE album = '".$row->id."' ORDER BY id $sorting LIMIT 0, 3;";
        $result2 = $database->query($query2);
        $k = 0;
        while($row2 = $result2->fetch_object()){
            $return['albums'][$row->id]["thumb$k"] = $row2->thumbUrl;
            $k++;
        }
        $i++;

    }
    return $return;
}

?>
