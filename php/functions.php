<?php

/**
 * @name        functions.php
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2012 by Philipp Maurer, Tobias Reich
 */

include("config.php");

// Database Functions
function dbConnect() {
    global $db, $dbUser, $dbPassword, $dbHost;
    $connect = mysql_connect($dbHost, $dbUser, $dbPassword);
    if(!$connect) {
        echo "No connection: ".mysql_error();
        return false;
    }
    $dbSelect = mysql_select_db($db);
    if(!$dbSelect) {
	    if(createDatabase($db)){$dbSelect = mysql_select_db($db);}
	    else {echo "Can not create Database!"; return false;}
    }
    $query = "SELECT * FROM photos, albums;";
    if(!mysql_query($query)) createTables();
    return true;
}
function dbClose() {
    $close = mysql_close();
    if(!$close) {
        echo "Closing the connection failed!";
        return false;
    }
    return true;
}
function createDatabase($db) {
	$query = "CREATE DATABASE $db;";
	$result = mysql_query($query);
	if(!$result) return false;
	return true;
}
function createTables() {
    $query = "CREATE TABLE IF NOT EXISTS `albums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `sysdate` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;";
    $result = mysql_query($query);
    if(!$result) return false;

    $query = "CREATE TABLE IF NOT EXISTS `photos` (
  `id` bigint(14) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(160) NOT NULL,
  `url` varchar(100) NOT NULL,
  `public` tinyint(1) NOT NULL,
  `shortlink` varchar(20) NOT NULL,
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
  `shutter` varchar(10) NOT NULL,
  `focal` varchar(10) NOT NULL,
  `takedate` varchar(10) NOT NULL,
  `taketime` varchar(8) NOT NULL,
  `star` tinyint(1) NOT NULL,
  `album` varchar(30) NOT NULL DEFAULT '0',
  `thumbUrl` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;";
    $result = mysql_query($query);
    if(!$result) return false;
    return true;
}

// Upload Functions
function upload($file, $albumID) {
    switch($albumID) {
        case 's':
            $public = 1;
            $star = 0;
            $albumID = 0;
            break;
        case 'f':
            $star = 1;
            $public = 0;
            $albumID = 0;
            break;
        default:
            $star = 0;
            $public = 0;
    }
    $id = str_replace('.', '', microtime(true));
    while(strlen($id)<14) $id .= 0;
    $tmp_name = $file['File']["tmp_name"];
    $type = getimagesize($tmp_name);
    if(($type[2]!=1)&&($type[2]!=2)&&($type[2]!=3)) return false;
    $data = $file['File']["name"];
    $data = explode('.',$data);
    $data = array_reverse ($data);
    $data = $data[0];
    move_uploaded_file($tmp_name, "../uploads/big/$id.$data");
    createThumb($id.".".$data);
    // Read infos
    $info = getCamera($id.".".$data);
    $title="";
    if(isset($info['type'])){$type=$info['type'];}else{$type="";}
    if(isset($info['width'])){$width=$info['width'];}else{$width="";}
    if(isset($info['height'])){$height=$info['height'] OR "";}else{$height="";}
    if(isset($info['size'])){$size=$info['size'] OR "";}else{$size="";}
    if(isset($info['date'])){$sysdate=$info['date'];}else{$sysdate="";}
    if(isset($info['time'])){$systime=$info['time'];}else{$systime="";}
    if(isset($info['iso'])){$iso=$info['iso'];}else{$iso="";}
    if(isset($info['aperture'])){$aperture=$info['aperture'];}else{$aperture="";}
    if(isset($info['make'])){$make=$info['make'];}else{$make="";}
    if(isset($info['model'])){$model=$info['model'] OR "";}else{$model="";}
    if(isset($info['shutter'])){$shutter=$info['shutter'];}else{$shutter="";}
    if(isset($info['focal'])){$focal=$info['focal'];}else{$focal="";}
    if(isset($info['takeDate'])){$takeDate=$info['takeDate'];}else{$takeDate="";}
    if(isset($info['takeTime'])){$takeTime=$info['takeTime'];}else{$takeTime="";}
    $query = "INSERT INTO photos (id, title, url, type, width, height, size, sysdate, systime, iso, aperture, make, model, shutter, focal, takedate, taketime, thumbUrl, album, public, star)
        VALUES ('$id', '$title', 'uploads/big/$id.$data', '$type', '$width', '$height', '$size', '$sysdate', '$systime', '$iso', '$aperture', '$make', '$model', '$shutter', '$focal', '$takeDate', '$takeTime', 'uploads/thumb/$id.$data', '$albumID', '$public', '$star');";
    $result = mysql_query($query);
}
function getCamera($photoID) {
    $return = array();
    $url = "../uploads/big/$photoID";
    $type = getimagesize($url);
    $type = $type['mime'];

    if(($type == "image/jpeg") && function_exists('exif_read_data') ){

        $exif = exif_read_data($url, "EXIF", 0);

        // General information
        $return['name'] = $exif['FileName'];
        $generalInfos = getimagesize($url);
        $return['type'] = $generalInfos['mime'];
        $return['width'] = $generalInfos[0];
        $return['height'] = $generalInfos[1];
        $size = (filesize($url) / 1024);
        if($size >= 1024){$size=round($size/1024,1)." MB";}else{$size=round($size,1)." KB";}
        $return['size'] = $size;
        $return['date'] = date("d.m.Y",filectime($url));
        $return['time'] = date("H:i:s",filectime($url));

        echo $exif['FileDateTime']."<br/>".$exif['DateTimeOriginal'];

        // Camera Information
        if(isset($exif['ISOSpeedRatings'])){$return['iso']="ISO-".$exif['ISOSpeedRatings'];}
        if(isset($exif['COMPUTED']['ApertureFNumber'])){$return['aperture']=$exif['COMPUTED']['ApertureFNumber'];}
        if(isset($exif['Make'])){$return['make']=$exif['Make'];}
        if(isset($exif['Model'])){$return['model']=$exif['Model'];}
        if(isset($exif['ExposureTime'])){$return['shutter']=$exif['ExposureTime']." Sek.";}
        if(isset($exif['FocalLength'])){$return['focal']=($exif['FocalLength']/1)." mm";}
        if(isset($exif['Software'])){$return['software']=$exif['Software'];}
        if(isset($exif['DateTimeOriginal'])) {
            $exifDate = explode(" ",$exif['DateTimeOriginal']);
            $date = explode(":", $exifDate[0]); $return['takeDate'] = $date[2].".".$date[1].".".$date[0];
            $return['takeTime'] = $exifDate[1];
        }

    }else{

        $exif = getimagesize($url);
        $return['type'] = $exif['mime'];
        $return['width'] = $exif[0];
        $return['height'] = $exif[1];
        $size = (filesize($url) / 1024);
        if($size >= 1024){$size=round($size/1024,1)." MB";}else{$size=round($size,1)." KB";}
        $return['size'] = $size;
        $return['date'] = date("d.m.Y",filectime($url));
        $return['time'] = date("H:i:s",filectime($url));

    }
    return $return;
}
function createThumb($photoName, $width = 200, $height = 200) {
    global $thumbQuality;
    $photoUrl = "../uploads/big/$photoName";
    $newUrl = "../uploads/thumb/$photoName";
    $oldImg = getimagesize($photoUrl);
    $type = $oldImg['mime'];
    switch($type) {
        case "image/jpeg": $sourceImg = imagecreatefromjpeg($photoUrl); break;
        case "image/png": $sourceImg = imagecreatefrompng($photoUrl); break;
        case "image/gif": $sourceImg = imagecreatefromgif($photoUrl); break;
        default: return false;
    }
    $thumb = imagecreatetruecolor($width, $height);
    if($oldImg[0]<$oldImg[1]) {
        $newSize = $oldImg[0];
        $startWidth = 0;
        $startHeight = $oldImg[1]/2 - $oldImg[0]/2;
    } else {
        $newSize = $oldImg[1];
        $startWidth = $oldImg[0]/2 - $oldImg[1]/2;
        $startHeight = 0;
    }
    imagecopyresampled($thumb,$sourceImg,0,0,$startWidth,$startHeight,$width,$height,$newSize,$newSize);
    switch($type) {
        case "image/jpeg": imagejpeg($thumb,$newUrl,$thumbQuality); break;
        case "image/png": imagepng($thumb,$newUrl); break;
        case "image/gif": imagegif($thumb,$newUrl); break;
        default: return false;
    }
    return true;
}

// Session Functions
function login($loginUser, $loginPassword) {
    global $user, $password;
    if(($loginUser == $user) && ($loginPassword == $password)){
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
    $title = mysql_escape_string($title);
    $sysdate = date("d.m.Y");
    $query = "INSERT INTO albums (title, sysdate) VALUES ('$title', '$sysdate');";
    $result = mysql_query($query);
    if(!$result) return false;
    return mysql_insert_id();
}
function getAlbums() {
    $return = array(array());
    $query = "SELECT id, title, sysdate FROM albums ORDER BY id DESC;";
    $result = mysql_query($query) OR die("Error: $result <br>".mysql_error());
    $i=0;
    while($row = mysql_fetch_object($result)) {
    	$return[$i]['id'] = $row->id;
        $return[$i]['title'] = $row->title;
        $return[$i]['sysdate'] = $row->sysdate;
        $albumID = $row->id;
        $query = "SELECT thumbUrl FROM photos WHERE album = '$albumID' ORDER BY id DESC LIMIT 0, 3;";
        $result2 = mysql_query($query);
        $k = 0;
        while($row2 = mysql_fetch_object($result2)){
            $return[$i]["thumb$k"] = $row2->thumbUrl;
            $k++;
        }
        if(!isset($return[$i]["thumb0"]))$return[$i]["thumb0"]="";
        if(!isset($return[$i]["thumb1"]))$return[$i]["thumb1"]="";
        if(!isset($return[$i]["thumb2"]))$return[$i]["thumb2"]="";
        $i++;
    }
    if($i==0) return false;
    return $return;
}
function getSmartInfo() {
    $return = array();
    $query = "SELECT * FROM photos WHERE album = 0 ORDER BY id DESC;";
    $result = mysql_query($query);
    $i = 0;
    while($row = mysql_fetch_object($result)) {
        if($i<3) $return["unsortThumb$i"] = $row->thumbUrl;
        $i++;
    }
    $return['unsortNum'] = $i;

    $query2 = "SELECT * FROM photos WHERE public = 1 ORDER BY id DESC;";
    $result2 = mysql_query($query2);
    $i = 0;
    while($row2 = mysql_fetch_object($result2)) {
        if($i<3) $return["publicThumb$i"] = $row2->thumbUrl;
        $i++;
    }
    $return['publicNum'] = $i;

    $query3 = "SELECT * FROM photos WHERE star = 1 ORDER BY id DESC;";
    $result3 = mysql_query($query3);
    $i = 0;
    while($row3 = mysql_fetch_object($result3)) {
        if($i<3) $return["starredThumb$i"] = $row3->thumbUrl;
        $i++;
    }
    $return['starredNum'] = $i;
    return $return;

}
function getAlbumInfo($albumID) {
    $return = array();
    $query = "SELECT * FROM albums WHERE id = '$albumID';";
    $result = mysql_query($query);
    $row = mysql_fetch_object($result);
    $return['title'] = $row->title;
    $return['date'] = $row->sysdate;
    $return['star'] = $row->star;
    $return['public'] = $row->public;
    $query = "SELECT COUNT(*) AS num FROM photos WHERE album = '$albumID';";
    $result = mysql_query($query);
    $row = mysql_fetch_object($result);
    $return['num'] = $row->num;
    return $return;
}
function setAlbumTitle($albumID, $title) {
    $title = mysql_real_escape_string(urldecode($title));
    if(strlen($title)<3||strlen($title)>30) return false;
    $query = "UPDATE albums SET title = '$title' WHERE id = '$albumID';";
    $result = mysql_query($query);
    if(!$result) return false;
    return true;
}
function deleteAlbum($albumID, $delAll) {
    if($delAll=="true") {
        $query = "SELECT id FROM photos WHERE album = '$albumID';";
        $result = mysql_query($query);
        $error = false;
        while($row =  mysql_fetch_object($result)) {
            if(!deletePhoto($row->id)) $error = true;
        }
    } else {
        $query = "UPDATE photos SET album = '0' WHERE album = '$albumID';";
        $result = mysql_query($query);
        if(!$result) return false;
    }
    if($albumID!=0) {
        $query = "DELETE FROM albums WHERE id = '$albumID';";
        $result = mysql_query($query);
        if(!$result) return false;
    }
    if($error) return false;
    return true;
}
function getAlbumArchive($albumID) {
    switch($albumID) {
        case 's':
            $query = "SELECT * FROM photos WHERE public = '1';";
            $zipTitle = "Public";
            break;
        case 'f':
            $query = "SELECT * FROM photos WHERE star = '1';";
            $zipTitle = "Starred";
            break;
        default:
            $query = "SELECT * FROM photos WHERE album = '$albumID';";
            $zipTitle = "Unsorted";
    }
    $result = mysql_query($query);
    $files = array();
    $i=0;
    while($row = mysql_fetch_object($result)) {
        $files[$i] = "../".$row->url;
        $i++;
    }
    $query = "SELECT * FROM albums WHERE id = '$albumID';";
    $result = mysql_query($query);
    $row = mysql_fetch_object($result);
    if($albumID!=0&&is_numeric($albumID))$zipTitle = $row->title;
    $filename = "./".$zipTitle.".zip";

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
    readfile($filename);
    unlink($filename);

    return true;
}

// Photo Functions
function getPhotos($albumID) {
    switch($albumID) {
        case "f": $query = "SELECT * FROM photos WHERE star = 1 ORDER BY id DESC;";
            break;
        case "s": $query = "SELECT * FROM photos WHERE public = 1 ORDER BY id DESC;";
            break;
        default: $query = "SELECT * FROM photos WHERE album = '$albumID' ORDER BY id DESC;";
    }
    $result = mysql_query($query);
    $return = array(array());
    $i = 0;
    while($row = mysql_fetch_array($result)) {
        $return[$i] = $row;
        $i++;
    }
    if($i==0) return false;
    return $return;
}
function getPhotoInfo($photoID) {
    $query = "SELECT * FROM photos WHERE id = '$photoID';";
    $result = mysql_query($query);
    $return = mysql_fetch_array($result);
    return $return;
}
function downloadPhoto($photoID) {
    $query = "SELECT * FROM photos WHERE id = '$photoID';";
    $result = mysql_query($query);
    $row = mysql_fetch_object($result);

    $photo = "../".$row->url;
    $title = $row->title;
    $type = "appcication/zip";
    $filename = "./imageDownload.zip";

    $zip = new ZipArchive();
    if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE) return false;

    $newFile = explode("/",$photo);
    $newFile = array_reverse($newFile);
    $zip->addFile($photo, $title.$newFile[0]);
    $zip->close();
    header("Content-Type: $type");
    header("Content-Disposition: attachment; filename=\"$title.zip\"");
    readfile($filename);
    unlink($filename);
    return true;
}
function countPhotos() {
    $query = "SELECT COUNT(*) AS num FROM photos;";
    $result = mysql_query($query);
    $row = mysql_fetch_object($result);
    return $row->num;
}
function setPhotoPublic($photoID, $url) {
    $query = "SELECT public, shortlink FROM photos WHERE id = '$photoID';";
    $row = mysql_fetch_object(mysql_query($query));
    if($row->public == 0){
        $public = 1;
    }else{
        $public = 0;
    }
    if(preg_match('/localhost/', $_SERVER['HTTP_REFERER'])) {
        $shortlink = "";
    }else{
        if($row->shortlink==""){
            $shortlink = urlShortner($url);
        }else{
            $shortlink = $row->shortlink;
        }
    }
    $query = "UPDATE photos SET public = '$public', shortlink = '$shortlink' WHERE id = '$photoID';";
    $result = mysql_query($query);
    if(!$result) return false;
    return true;
}
function setPhotoStar($photoID) {
    $query = "SELECT star FROM photos WHERE id = '$photoID';";
    $row = mysql_fetch_object(mysql_query($query));
    if($row->star == 0) {
        $star = 1;
    } else {
        $star = 0;
    }
    $query = "UPDATE photos SET star = '$star' WHERE id = '$photoID';";
    $result = mysql_query($query);
    return true;
}
function nextPhoto($photoID, $albumID) {
    switch($albumID) {
        case 'f': $query = "SELECT * FROM photos WHERE id < '$photoID' AND star = '1' ORDER BY id DESC LIMIT 0, 1;";
            break;
        case 's': $query = "SELECT * FROM photos WHERE id < '$photoID' AND public = '1' ORDER BY id DESC LIMIT 0, 1;";
            break;
        default: $query = "SELECT * FROM photos WHERE id < '$photoID' AND album = '$albumID' ORDER BY id DESC LIMIT 0, 1;";
    }
    $result = mysql_query($query);
    $return = mysql_fetch_array($result);
    if(!$return || ($return==0)) {
        switch($albumID) {
            case 'f': $query = "SELECT * FROM photos WHERE star = '1' ORDER BY id DESC LIMIT 0, 1;";
                break;
            case 's': $query = "SELECT * FROM photos WHERE public = '1' ORDER BY id DESC LIMIT 0, 1;";
                break;
            default: $query = "SELECT * FROM photos WHERE album = '$albumID' ORDER BY id DESC LIMIT 0, 1;";
        }
        $result = mysql_query($query);
        $return = mysql_fetch_array($result);
    }
    return $return;
}
function previousPhoto($photoID, $albumID) {
    switch($albumID) {
        case 'f': $query = "SELECT * FROM photos WHERE id > '$photoID' AND star = '1' LIMIT 0, 1;";
            break;
        case 's': $query = "SELECT * FROM photos WHERE id > '$photoID' AND public = '1' LIMIT 0, 1;";
            break;
        default: $query = "SELECT * FROM photos WHERE id > '$photoID' AND album = '$albumID' LIMIT 0, 1;";
    }
    $result = mysql_query($query);
    $return = mysql_fetch_array($result);
    if(!$return || ($return==0)) {
        switch($albumID) {
            case 'f': $query = "SELECT * FROM photos WHERE star = '1' ORDER BY id LIMIT 0, 1;";
                break;
            case 's': $query = "SELECT * FROM photos WHERE public = '1' ORDER BY id LIMIT 0, 1;";
                break;
            default: $query = "SELECT * FROM photos WHERE album = '$albumID' ORDER BY id LIMIT 0, 1;";
        }
        $result = mysql_query($query);
        $return = mysql_fetch_array($result);
    }
    return $return;
}
function movePhoto($photoID, $newAlbum) {
    $query = "UPDATE photos SET album = '$newAlbum' WHERE id = '$photoID';";
    $result = mysql_query($query);
    if(!$result) return false;
    else return true;
}
function setPhotoTitle($photoID, $title) {
    $title = mysql_real_escape_string(urldecode($title));
    if(strlen($title)>30) return false;
    $query = "UPDATE photos SET title = '$title' WHERE id = '$photoID';";
    $result = mysql_query($query);
    if(!$result) return false;
    else return true;
}
function setPhotoDescription($photoID, $description) {
    $description = mysql_real_escape_string(htmlentities($description));
    if(strlen($description)>160) return false;
    $query = "UPDATE photos SET description = '$description' WHERE id = '$photoID';";
    $result = mysql_query($query);
    if(!$result) return false;
    return true;
}
function deletePhoto($photoID) {
    $query = "SELECT * FROM photos WHERE id = '$photoID';";
    $result = mysql_query($query);
    if(!$result) return false;
    $row = mysql_fetch_object($result);
    $unlink1 = unlink("../".$row->url);
    $unlink2 = unlink("../".$row->thumbUrl);
    if(!$unlink1 || !$unlink2) return false;
    $query = "DELETE FROM photos WHERE id = '$photoID';";
    $result = mysql_query($query);
    if(!$result) return false;
    return true;
}

// Share Functions
function urlShortner($url) {
    global $bitlyUsername, $bitlyApi;
    if($bitlyUsername==""||$bitlyApi=="") return false;
    $url = urlencode($url);
    $bitlyAPI = "http://api.bit.ly/shorten?version=2.0.1&format=xml&longUrl=$url&login=$bitlyUsername&apiKey=$bitlyApi";

    $data = file_get_contents($bitlyAPI);

    $xml = simplexml_load_string($data);
    $shortlink = $xml->results->nodeKeyVal->shortUrl;
    return $shortlink;
}
function sharePhoto($photoID, $url) {
    $query = "SELECT * FROM photos WHERE id = '$photoID'";
    $result = mysql_query($query);
    $row = mysql_fetch_object($result);

    $thumb = "http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']."/../../".$row->thumbUrl;
    $title = $row->title;
    $description = $row->description;
    $shortlink = $row->shortlink;

    $twitterUrl = "https://twitter.com/share?url=".urlencode("$url");
    $facebookUrl = "http://www.facebook.com/sharer.php?u=".urlencode("$url")."&t=".urlencode($title);
    $tumblrUrl = "http://www.tumblr.com/share/link?url=".urlencode("$url")."&name=".  urlencode($title)."&description=".urlencode($description);
    $pinterestUrl = "http://pinterest.com/pin/create/button/?url=".urlencode("$url")."&media=".urlencode($thumb);
    $mailUrl = "mailto:?subject=".rawurlencode($title)."&body=".rawurlencode("Hey guy! Check this out: $url");

    $share = array();
    $share['twitter'] = $twitterUrl;
    $share['facebook'] = $facebookUrl;
    $share['tumblr'] = $tumblrUrl;
    $share['pinterest'] = $pinterestUrl;
    $share['mail'] = $mailUrl;
    $share['shortlink'] = $shortlink;

    return $share;
}
function facebookHeader($photoID) {
    if(!is_numeric($photoID)) return false;
    dbConnect();
    $query = "SELECT * FROM photos WHERE id = '$photoID';";
    $result = mysql_query($query);
    $row = mysql_fetch_object($result);

    $parseUrl = parse_url("http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
    $thumb = $parseUrl['scheme']."://".$parseUrl['host'].$parseUrl['path']."/../".$row->thumbUrl;

    $return  = '<meta name="title" content="'.$row->title.'" />';
    $return .= '<meta name="description" content="'.$row->description.' - via Lychee" />';
    $return .= '<link rel="image_src"  type="image/jpeg" href="'. $thumb .'" />';

    return $return;
}
function isPhotoPublic($photoID) {
    $query = "SELECT * FROM photos WHERE id = '$photoID';";
    $result = mysql_query($query);
    $row = mysql_fetch_object($result);
    if($row->public == 1) return true;
    return false;
}

// Search Function
function search($term) {
    $term = mysql_real_escape_string($term);

    $query = "SELECT * FROM photos WHERE title like '%$term%' OR description like '%$term%';";
    $result = mysql_query($query);
    while($row = mysql_fetch_array($result)) {
        $return['photos'][] = $row;
    }

    $query = "SELECT * FROM albums WHERE title like '%$term%';";
    $result = mysql_query($query);
    $i=0;
    while($row = mysql_fetch_array($result)) {
        $return['albums'][$i] = $row;

        $query = "SELECT thumbUrl FROM photos WHERE album = '".$row['id']."' ORDER BY id DESC LIMIT 0, 3;";
        $result2 = mysql_query($query);
        $k = 0;
        while($row2 = mysql_fetch_object($result2)){
            $return['albums'][$i]["thumb$k"] = $row2->thumbUrl;
            $k++;
        }

    }
    return $return;
}

?>
