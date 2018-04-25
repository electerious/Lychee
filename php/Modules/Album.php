<?php

namespace Lychee\Modules;

use ZipArchive;

final class Album {

	private $albumIDs = null;

	/**
	 * @return boolean Returns true when successful.
	 */
	public function __construct($albumIDs) {

		// Init vars
		$this->albumIDs = $albumIDs;

		return true;

	}

	/**
	 * @return string|false ID of the created album.
	 */
	public function add($title = 'Untitled') {

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Properties
		$id       = generateID();
		$sysstamp = time();
		$public   = 0;
		$visible  = 1;

		// Database
		$query  = Database::prepare(Database::get(), "INSERT INTO ? (id, title, sysstamp, public, visible) VALUES ('?', '?', '?', '?', '?')", array(LYCHEE_TABLE_ALBUMS, $id, $title, $sysstamp, $public, $visible));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return $id;

	}

	/**
	 * Rurns album-attributes into a front-end friendly format. Note that some attributes remain unchanged.
	 * @return array Returns album-attributes in a normalized structure.
	 */
	public static function prepareData(array $data) {

		// This function requires the following album-attributes and turns them
		// into a front-end friendly format: id, title, public, sysstamp, password
		// Note that some attributes remain unchanged

		// Init
		$album = null;

		// Set unchanged attributes
		$album['id']     = $data['id'];
		$album['title']  = $data['title'];
		$album['public'] = $data['public'];

		// Additional attributes
		// Only part of $album when available
		if (isset($data['description']))  $album['description'] = $data['description'];
		if (isset($data['visible']))      $album['visible'] = $data['visible'];
		if (isset($data['downloadable'])) $album['downloadable'] = $data['downloadable'];

		// Parse date
		$album['sysdate'] = strftime('%B %Y', $data['sysstamp']);

		// Parse password
		$album['password'] = ($data['password']=='' ? '0' : '1');

		// Parse thumbs or set default value
		$album['thumbs'] = (isset($data['thumbs']) ? explode(',', $data['thumbs']) : array());

		return $album;

	}

	/**
	 * @return array|false Returns an array of photos and album information or false on failure.
	 */
	public function get() {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Get album information
		switch ($this->albumIDs) {

			case 'f':
				$return['public'] = '0';
				$query = Database::prepare(Database::get(), "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url, medium FROM ? WHERE star = 1 " . Settings::get()['sortingPhotos'], array(LYCHEE_TABLE_PHOTOS));
				break;

			case 's':
				$return['public'] = '0';
				$query = Database::prepare(Database::get(), "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url, medium FROM ? WHERE public = 1 " . Settings::get()['sortingPhotos'], array(LYCHEE_TABLE_PHOTOS));
				break;

			case 'r':
				$return['public'] = '0';
				$query = Database::prepare(Database::get(), "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url, medium FROM ? WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) " . Settings::get()['sortingPhotos'], array(LYCHEE_TABLE_PHOTOS));
				break;

			case '0':
				$return['public'] = '0';
				$query = Database::prepare(Database::get(), "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url, medium FROM ? WHERE album = 0 " . Settings::get()['sortingPhotos'], array(LYCHEE_TABLE_PHOTOS));
				break;

			default:
				$query  = Database::prepare(Database::get(), "SELECT * FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
				$albums = Database::execute(Database::get(), $query, __METHOD__, __LINE__);
				$return = $albums->fetch_assoc();
				$return = Album::prepareData($return);
				$query  = Database::prepare(Database::get(), "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url, medium FROM ? WHERE album = '?' " . Settings::get()['sortingPhotos'], array(LYCHEE_TABLE_PHOTOS, $this->albumIDs));
				break;

		}

		// Get photos
		$photos          = Database::execute(Database::get(), $query, __METHOD__, __LINE__);
		$previousPhotoID = '';

		if ($photos===false) return false;

		while ($photo = $photos->fetch_assoc()) {

			// Turn data from the database into a front-end friendly format
			$photo = Photo::prepareData($photo);

			// Set previous and next photoID for navigation purposes
			$photo['previousPhoto'] = $previousPhotoID;
			$photo['nextPhoto']     = '';

			// Set current photoID as nextPhoto of previous photo
			if ($previousPhotoID!=='') $return['content'][$previousPhotoID]['nextPhoto'] = $photo['id'];
			$previousPhotoID = $photo['id'];

			// Add to return
			$return['content'][$photo['id']] = $photo;

		}

		if ($photos->num_rows===0) {

			// Album empty
			$return['content'] = false;

		} else {

			// Enable next and previous for the first and last photo
			$lastElement    = end($return['content']);
			$lastElementId  = $lastElement['id'];
			$firstElement   = reset($return['content']);
			$firstElementId = $firstElement['id'];

			if ($lastElementId!==$firstElementId) {
				$return['content'][$lastElementId]['nextPhoto']      = $firstElementId;
				$return['content'][$firstElementId]['previousPhoto'] = $lastElementId;
			}

		}

		$return['id']  = $this->albumIDs;
		$return['num'] = $photos->num_rows;

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return $return;

	}

	/**
	 * Starts a download of an album.
	 * @return resource|boolean Sends a ZIP-file or returns false on failure.
	 */
	public function getArchive() {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Illicit chars
		$badChars =	array_merge(
			array_map('chr', range(0,31)),
			array("<", ">", ":", '"', "/", "\\", "|", "?", "*")
		);

		// Photos query
		switch($this->albumIDs) {
			case 's':
				$photos   = Database::prepare(Database::get(), 'SELECT title, url FROM ? WHERE public = 1', array(LYCHEE_TABLE_PHOTOS));
				$zipTitle = 'Public';
				break;
			case 'f':
				$photos   = Database::prepare(Database::get(), 'SELECT title, url FROM ? WHERE star = 1', array(LYCHEE_TABLE_PHOTOS));
				$zipTitle = 'Starred';
				break;
			case 'r':
				$photos   = Database::prepare(Database::get(), 'SELECT title, url FROM ? WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) GROUP BY checksum', array(LYCHEE_TABLE_PHOTOS));
				$zipTitle = 'Recent';
				break;
			default:
				$photos   = Database::prepare(Database::get(), "SELECT title, url FROM ? WHERE album = '?'", array(LYCHEE_TABLE_PHOTOS, $this->albumIDs));
				$zipTitle = 'Unsorted';
		}

		// Get title from database when album is not a SmartAlbum
		if ($this->albumIDs!=0&&is_numeric($this->albumIDs)) {

			$query = Database::prepare(Database::get(), "SELECT title FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
			$album = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

			if ($album===false) return false;

			// Get album object
			$album = $album->fetch_object();

			// Album not found?
			if ($album===null) {
				Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find specified album');
				return false;
			}

			// Set title
			$zipTitle = $album->title;

		}

		// Escape title
		$zipTitle = str_replace($badChars, '', $zipTitle);

		$filename = LYCHEE_DATA . $zipTitle . '.zip';

		// Create zip
		$zip = new ZipArchive();
		if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not create ZipArchive');
			return false;
		}

		// Execute query
		$photos = Database::execute(Database::get(), $photos, __METHOD__, __LINE__);

		// Check if album empty
		if ($photos->num_rows==0) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not create ZipArchive without images');
			return false;
		}

		// Parse each path
		$files = array();
		while ($photo = $photos->fetch_object()) {

			// Parse url
			$photo->url = LYCHEE_UPLOADS_BIG . $photo->url;

			// Parse title
			$photo->title = str_replace($badChars, '', $photo->title);
			if (!isset($photo->title)||$photo->title==='') $photo->title = 'Untitled';

			// Check if readable
			if (!@is_readable($photo->url)) continue;

			// Get extension of image
			$extension = getExtension($photo->url, false);

			// Set title for photo
			$zipFileName = $zipTitle . '/' . $photo->title . $extension;

			// Check for duplicates
			if (!empty($files)) {
				$i = 1;
				while (in_array($zipFileName, $files)) {

					// Set new title for photo
					$zipFileName = $zipTitle . '/' . $photo->title . '-' . $i . $extension;

					$i++;

				}
			}

			// Add to array
			$files[] = $zipFileName;

			// Add photo to zip
			$zip->addFile($photo->url, $zipFileName);

		}

		// Finish zip
		$zip->close();

		// Send zip
		header("Content-Type: application/zip");
		header("Content-Disposition: attachment; filename=\"$zipTitle.zip\"");
		header("Content-Length: " . filesize($filename));
		readfile($filename);

		// Delete zip
		unlink($filename);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return true;

	}

	/**
	 * @return boolean Returns true when successful.
	 */
	public function setTitle($title = 'Untitled') {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Execute query
		$query  = Database::prepare(Database::get(), "UPDATE ? SET title = '?' WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $title, $this->albumIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

	public function setPosition(){
		// Check dependencies
		Validator::required(isset($_POST['photoOrder']), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		$id_list = implode(',', $_POST['photoOrder']);
		$indices = [];
		$size = count(explode(',',$id_list));
		for($i = 0; $i < $size; $i++){
			$indices[$i] = $i;
		}

		$whens = implode(
			"  ",
			array_map(
				function ($id, $value) {
					return "WHEN {$id} THEN {$value}";
				},
				explode(',',$id_list),
				$indices
			)
		);

		$query  = Database::prepare(Database::get(), "UPDATE ? SET position = CASE id ? END WHERE id IN (?)", array(LYCHEE_TABLE_PHOTOS, $whens, $id_list));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;
	}

	/**
	 * @return boolean Returns true when successful.
	 */
	public function setDescription($description = '') {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Execute query
		$query  = Database::prepare(Database::get(), "UPDATE ? SET description = '?' WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $description, $this->albumIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

	/**
	 * @return boolean Returns true when the album is public.
	 */
	public function getPublic() {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		if ($this->albumIDs==='0'||$this->albumIDs==='s'||$this->albumIDs==='f') return false;

		// Execute query
		$query  = Database::prepare(Database::get(), "SELECT public FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
		$albums = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($albums===false) return false;

		// Get album object
		$album = $albums->fetch_object();

		// Album not found?
		if ($album===null) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find specified album');
			return false;
		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($album->public==1) return true;
		return false;

	}

	/**
	 * @return boolean Returns true when the album is downloadable.
	 */
	public function getDownloadable() {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		if ($this->albumIDs==='0'||$this->albumIDs==='s'||$this->albumIDs==='f'||$this->albumIDs==='r') return false;

		// Execute query
		$query  = Database::prepare(Database::get(), "SELECT downloadable FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
		$albums = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($albums===false) return false;

		// Get album object
		$album = $albums->fetch_object();

		// Album not found?
		if ($album===null) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find specified album');
			return false;
		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($album->downloadable==1) return true;
		return false;

	}

	/**
	 * @return boolean Returns true when successful.
	 */
	public function setPublic($public, $password, $visible, $downloadable) {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Convert values
		$public       = ($public==='1' ? 1 : 0);
		$visible      = ($visible==='1' ? 1 : 0);
		$downloadable = ($downloadable==='1' ? 1 : 0);

		// Set public
		$query  = Database::prepare(Database::get(), "UPDATE ? SET public = '?', visible = '?', downloadable = '?', password = NULL WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $public, $visible, $downloadable, $this->albumIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($result===false) return false;

		// Reset permissions for photos
		if ($public===1) {

			$query  = Database::prepare(Database::get(), "UPDATE ? SET public = 0 WHERE album IN (?)", array(LYCHEE_TABLE_PHOTOS, $this->albumIDs));
			$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

			if ($result===false) return false;

		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		// Set password
		if (isset($password)&&strlen($password)>0) return $this->setPassword($password);
		return true;

	}

	/**
	 * @return boolean Returns true when successful.
	 */
	private function setPassword($password) {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		if (strlen($password)>0) {

			// Get hashed password
			$password = getHashedString($password);

			// Set hashed password
			// Do not prepare $password because it is hashed and save
			// Preparing (escaping) the password would destroy the hash
			$query = Database::prepare(Database::get(), "UPDATE ? SET password = '$password' WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));

		} else {

			// Unset password
			$query = Database::prepare(Database::get(), "UPDATE ? SET password = NULL WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));

		}

		// Execute query
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

	/**
	 * @return boolean Returns when album is public.
	 */
	public function checkPassword($password) {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Execute query
		$query  = Database::prepare(Database::get(), "SELECT password FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
		$albums = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($albums===false) return false;

		// Get album object
		$album = $albums->fetch_object();

		// Album not found?
		if ($album===null) {
			Log::error(Database::get(), __METHOD__, __LINE__, 'Could not find specified album');
			return false;
		}

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		// Check if password is correct
		if ($album->password=='') return true;
		if ($album->password===crypt($password, $album->password)) return true;
		return false;

	}

	/**
	 * @return boolean Returns true when successful.
	 */
	public function merge() {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Convert to array
		$albumIDs = explode(',', $this->albumIDs);

		// Get first albumID
		$albumID = array_splice($albumIDs, 0, 1);
		$albumID = $albumID[0];

		$query  = Database::prepare(Database::get(), "UPDATE ? SET album = ? WHERE album IN (?)", array(LYCHEE_TABLE_PHOTOS, $albumID, $this->albumIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($result===false) return false;

		// $albumIDs contains all IDs without the first albumID
		// Convert to string
		$filteredIDs = implode(',', $albumIDs);

		$query  = Database::prepare(Database::get(), "DELETE FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $filteredIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

	/**
	 * @return boolean Returns true when successful.
	 */
	public function delete() {

		// Check dependencies
		Validator::required(isset($this->albumIDs), __METHOD__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		// Init vars
		$photoIDs = array();

		// Execute query
		$query  = Database::prepare(Database::get(), "SELECT id FROM ? WHERE album IN (?)", array(LYCHEE_TABLE_PHOTOS, $this->albumIDs));
		$photos = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($photos===false) return false;

		// Only delete photos when albums contain photos
		if ($photos->num_rows>0) {

			// Add each id to photoIDs
			while ($row = $photos->fetch_object()) $photoIDs[] = $row->id;

			// Convert photoIDs to a string
			$photoIDs = implode(',', $photoIDs);

			// Delete all photos
			$photo = new Photo($photoIDs);
			if ($photo->delete()!==true) return false;

		}

		// Delete albums
		$query  = Database::prepare(Database::get(), "DELETE FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		if ($result===false) return false;
		return true;

	}

}

?>