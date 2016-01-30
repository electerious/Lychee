<?php

function search($term) {

	// Initialize return var
	$return = array(
		'photos' => null,
		'albums' => null,
		'hash'   => ''
	);

	/**
	 * Photos
	 */

	$query  = Database::prepare(Database::get(), "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ? WHERE title LIKE '%?%' OR description LIKE '%?%' OR tags LIKE '%?%'", array(LYCHEE_TABLE_PHOTOS, $term, $term, $term));
	$result = Database::get()->query($query);

	while($photo = $result->fetch_assoc()) {

		$photo = Photo::prepareData($photo);
		$return['photos'][$photo['id']] = $photo;

	}

	/**
	 * Albums
	 */

	$query  = Database::prepare(Database::get(), "SELECT id, title, public, sysstamp, password FROM ? WHERE title LIKE '%?%' OR description LIKE '%?%'", array(LYCHEE_TABLE_ALBUMS, $term, $term));
	$result = Database::get()->query($query);

	while($album = $result->fetch_assoc()) {

		// Turn data from the database into a front-end friendly format
		$album = Album::prepareData($album);

		// Thumbs
		$query  = Database::prepare(Database::get(), "SELECT thumbUrl FROM ? WHERE album = '?' " . Settings::get()['sortingPhotos'] . " LIMIT 0, 3", array(LYCHEE_TABLE_PHOTOS, $album['id']));
		$thumbs = Database::get()->query($query);

		// For each thumb
		$k = 0;
		while ($thumb = $thumbs->fetch_object()) {
			$album['thumbs'][$k] = LYCHEE_URL_UPLOADS_THUMB . $thumb->thumbUrl;
			$k++;
		}

		// Add to return
		$return['albums'][$album['id']] = $album;

	}

	// Hash
	$return['hash'] = md5(json_encode($return));

	return $return;

}

?>