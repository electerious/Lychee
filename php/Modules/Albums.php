<?php

namespace Lychee\Modules;

final class Albums {

	/**
	 * @return boolean Returns true when successful.
	 */
	public function __construct() {

		return true;

	}

	/**
	 * @return array|false Returns an array of albums or false on failure.
	 */
	public function get($public = true, $parent = 0) {

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Initialize return var
		$return = array(
			'smartalbums' => null,
			'albums'      => null,
			'num'         => 0
		);

		// Get SmartAlbums
		if ($public===false) $return['smartalbums'] = $this->getSmartAlbums();

		// Albums query
		if ($public===false) $query = Database::prepare(Database::get(), "SELECT id, title, public, sysstamp, password, parent FROM ? " . ($parent != -1 ? "WHERE parent = '?' " : "") . Settings::get()['sortingAlbums'], array(LYCHEE_TABLE_ALBUMS, $parent));
		else                 $query = Database::prepare(Database::get(), "SELECT id, title, public, sysstamp, password, parent FROM ? " . ($parent != -1 ? "WHERE parent = '?' " : "") . " AND public = 1 AND visible <> 0 " . Settings::get()['sortingAlbums'], array(LYCHEE_TABLE_ALBUMS, $parent));

		// Execute query
		$albums = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($albums===false) return false;

		// For each album
		while ($album = $albums->fetch_assoc()) {

			// Turn data from the database into a front-end friendly format
			$album = Album::prepareData($album);

			// Thumbs
			if (($public===true&&$album['password']==='0')||
				($public===false)) {

					// Execute query
					$query  = Database::prepare(Database::get(), "SELECT thumbUrl FROM ? WHERE album = '?' ORDER BY star DESC, " . substr(Settings::get()['sortingPhotos'], 9) . " LIMIT 3", array(LYCHEE_TABLE_PHOTOS, $album['id']));
					$thumbs = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

					if ($thumbs===false) return false;

					// For each thumb
					$k = 0;
					while ($thumb = $thumbs->fetch_object()) {
						$album['thumbs'][$k] = LYCHEE_URL_UPLOADS_THUMB . $thumb->thumbUrl;
						$k++;
					}

			}

			// Add to return
			$return['albums'][] = $album;

		}

		// Num of albums
		$return['num'] = $albums->num_rows;

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return $return;

	}

	/**
	 * @return array|false Returns an array of smart albums or false on failure.
	 */
	private function getSmartAlbums() {

		// Initialize return var
		$return = array(
			'unsorted' => null,
			'public'   => null,
			'starred'  => null,
			'recent'   => null
		);

		/**
		 * Unsorted
		 */

		$query    = Database::prepare(Database::get(), 'SELECT thumbUrl FROM ? WHERE album = 0 ' . Settings::get()['sortingPhotos'], array(LYCHEE_TABLE_PHOTOS));
		$unsorted = Database::execute(Database::get(), $query, __METHOD__, __LINE__);
		$i        = 0;

		if ($unsorted===false) return false;

		$return['unsorted'] = array(
			'thumbs' => array(),
			'num'    => $unsorted->num_rows
		);

		while($row = $unsorted->fetch_object()) {
			if ($i<3) {
				$return['unsorted']['thumbs'][$i] = LYCHEE_URL_UPLOADS_THUMB . $row->thumbUrl;
				$i++;
			} else break;
		}

		/**
		 * Starred
		 */

		$query   = Database::prepare(Database::get(), 'SELECT thumbUrl FROM ? WHERE star = 1 ' . Settings::get()['sortingPhotos'], array(LYCHEE_TABLE_PHOTOS));
		$starred = Database::execute(Database::get(), $query, __METHOD__, __LINE__);
		$i       = 0;

		if ($starred===false) return false;

		$return['starred'] = array(
			'thumbs' => array(),
			'num'    => $starred->num_rows
		);

		while($row3 = $starred->fetch_object()) {
			if ($i<3) {
				$return['starred']['thumbs'][$i] = LYCHEE_URL_UPLOADS_THUMB . $row3->thumbUrl;
				$i++;
			} else break;
		}

		/**
		 * Public
		 */

		$query  = Database::prepare(Database::get(), 'SELECT thumbUrl FROM ? WHERE public = 1 ' . Settings::get()['sortingPhotos'], array(LYCHEE_TABLE_PHOTOS));
		$public = Database::execute(Database::get(), $query, __METHOD__, __LINE__);
		$i      = 0;

		if ($public===false) return false;

		$return['public'] = array(
			'thumbs' => array(),
			'num'    => $public->num_rows
		);

		while($row2 = $public->fetch_object()) {
			if ($i<3) {
				$return['public']['thumbs'][$i] = LYCHEE_URL_UPLOADS_THUMB . $row2->thumbUrl;
				$i++;
			} else break;
		}

		/**
		 * Recent
		 */

		$query  = Database::prepare(Database::get(), 'SELECT thumbUrl FROM ? WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) ' . Settings::get()['sortingPhotos'], array(LYCHEE_TABLE_PHOTOS));
		$recent = Database::execute(Database::get(), $query, __METHOD__, __LINE__);
		$i      = 0;

		if ($recent===false) return false;

		$return['recent'] = array(
			'thumbs' => array(),
			'num'    => $recent->num_rows
		);

		while($row3 = $recent->fetch_object()) {
			if ($i<3) {
				$return['recent']['thumbs'][$i] = LYCHEE_URL_UPLOADS_THUMB . $row3->thumbUrl;
				$i++;
			} else break;
		}

		// Return SmartAlbums
		return $return;

	}

}

?>