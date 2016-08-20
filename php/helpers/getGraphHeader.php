<?php

use Lychee\Modules\Database;
use Lychee\Modules\Photo;

function getGraphHeader($photoID) {

	$photo = new Photo($photoID);
	if ($photo->getPublic('')===false) return false;

	$query  = Database::prepare(Database::get(), "SELECT title, description, url, medium FROM ? WHERE id = '?'", array(LYCHEE_TABLE_PHOTOS, $photoID));
	$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

	if ($result===false) return false;

	$row = $result->fetch_object();

	if ($row===null) {
		Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find photo in database');
		return false;
	}

	if ($row->medium==='1') $dir = 'medium';
	else                    $dir = 'big';

	$parseUrl = parse_url('http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
	$url      = '//' . $parseUrl['host'] . $parseUrl['path'] . '?' . $parseUrl['query'];
	$picture  = '//' . $parseUrl['host'] . $parseUrl['path'] . '/../uploads/' . $dir . '/' . $row->url;

	$url     = htmlentities($url);
	$picture = htmlentities($picture);

	$row->title       = htmlentities($row->title);
	$row->description = htmlentities($row->description);

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

?>