<?php

###
# @name			Album Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Album extends Module {

	private $database	= null;
        private $tablePrefix    = null;
	private $settings	= null;
	private $albumIDs	= null;

	public function __construct($database, $tablePrefix, $plugins, $settings, $albumIDs) {

		# Init vars
		$this->database     = $database;
                $this->tablePrefix  = $tablePrefix;
		$this->plugins      = $plugins;
		$this->settings     = $settings;
		$this->albumIDs     = $albumIDs;

		return true;

	}

	public function add($title = 'Untitled', $public = 0, $visible = 1) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Database
		$sysstamp	= time();
                $query = Database::prepareQuery("INSERT INTO {prefix}_albums (title, sysstamp, public, visible) VALUES ('$title', '$sysstamp', '$public', '$visible');", $this->tablePrefix);
		$result		= $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return $this->database->insert_id;

	}

	public function get() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->settings, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get album information
		switch ($this->albumIDs) {

			case 'f':	$return['public'] = false;
						$query = Database::prepareQuery("SELECT id, title, tags, public, star, album, thumbUrl, takestamp FROM {prefix}_photos WHERE star = 1 " . $this->settings['sorting'], $this->tablePrefix);
						break;

			case 's':	$return['public'] = false;
						$query = Database::prepareQuery("SELECT id, title, tags, public, star, album, thumbUrl, takestamp FROM {prefix}_photos WHERE public = 1 " . $this->settings['sorting'], $this->tablePrefix);
						break;

			case 'r':	$return['public'] = false;
						$query = Database::prepareQuery("SELECT id, title, tags, public, star, album, thumbUrl, takestamp FROM {prefix}_photos WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) " . $this->settings['sorting'], $this->tablePrefix);
						break;

			case '0':	$return['public'] = false;
						$query = Database::prepareQuery("SELECT id, title, tags, public, star, album, thumbUrl, takestamp FROM {prefix}_photos WHERE album = 0 " . $this->settings['sorting'], $this->tablePrefix);
						break;

			default:	$albums = $this->database->query(Database::prepareQuery("SELECT * FROM {prefix}_albums WHERE id = '$this->albumIDs' LIMIT 1;", $this->tablePrefix));
						$return = $albums->fetch_assoc();
						$return['sysdate']		= date('d M. Y', $return['sysstamp']);
						$return['password']		= ($return['password']=='' ? false : true);
						$query = Database::prepareQuery("SELECT id, title, tags, public, star, album, thumbUrl, takestamp FROM {prefix}_photos WHERE album = '$this->albumIDs' " . $this->settings['sorting'], $this->tablePrefix);
						break;

		}

		# Get photos
		$photos				= $this->database->query($query);
		$previousPhotoID	= '';
		while ($photo = $photos->fetch_assoc()) {

			# Parse
			$photo['sysdate']			= date('d F Y', substr($photo['id'], 0, -4));
			$photo['previousPhoto']		= $previousPhotoID;
			$photo['nextPhoto']			= '';
			$photo['thumbUrl']			= LYCHEE_URL_UPLOADS_THUMB . $photo['thumbUrl'];

			if (isset($photo['takestamp'])&&$photo['takestamp']!=='0') {
				$photo['cameraDate']	= 1;
				$photo['sysdate']		= date('d F Y', $photo['takestamp']);
			}

			if ($previousPhotoID!=='') $return['content'][$previousPhotoID]['nextPhoto'] = $photo['id'];
			$previousPhotoID = $photo['id'];

			# Add to return
			$return['content'][$photo['id']] = $photo;

		}

		if ($photos->num_rows===0) {

			# Album empty
			$return['content'] = false;

		} else {

			# Enable next and previous for the first and last photo
			$lastElement	= end($return['content']);
			$lastElementId	= $lastElement['id'];
			$firstElement	= reset($return['content']);
			$firstElementId	= $firstElement['id'];

			if ($lastElementId!==$firstElementId) {
				$return['content'][$lastElementId]['nextPhoto']			= $firstElementId;
				$return['content'][$firstElementId]['previousPhoto']	= $lastElementId;
			}

		}

		$return['id']	= $this->albumIDs;
		$return['num']	= $photos->num_rows;

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $return;

	}

	public function getAll($public) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->settings, $public));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get SmartAlbums
		if ($public===false) $return = $this->getSmartInfo();

		# Albums query
		$query = Database::prepareQuery('SELECT id, title, public, sysstamp, password FROM {prefix}_albums WHERE public = 1 AND visible <> 0', $this->tablePrefix);
		if ($public===false) $query = Database::prepareQuery('SELECT id, title, public, sysstamp, password FROM {prefix}_albums', $this->tablePrefix);

		# Execute query
		$albums = $this->database->query($query) OR exit('Error: ' . $this->database->error);

		# For each album
		while ($album = $albums->fetch_assoc()) {

			# Parse info
			$album['sysdate']	= date('F Y', $album['sysstamp']);
			$album['password']	= ($album['password'] != '');

			# Thumbs
			if (($public===true&&$album['password']===false)||($public===false)) {

				# Execute query
                                $query = Database::prepareQuery("SELECT thumbUrl FROM {prefix}_photos WHERE album = '" . $album['id'] . "' ORDER BY star DESC, " . substr($this->settings['sorting'], 9) . " LIMIT 3", $this->tablePrefix);
				$thumbs = $this->database->query($query);

				# For each thumb
				$k = 0;
				while ($thumb = $thumbs->fetch_object()) {
					$album["thumb$k"] = LYCHEE_URL_UPLOADS_THUMB . $thumb->thumbUrl;
					$k++;
				}

			}

			# Add to return
			$return['content'][$album['id']] = $album;

		}

		# Num of albums
		$return['num'] = $albums->num_rows;

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $return;

	}

	private function getSmartInfo() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->settings));

		# Unsorted
		$unsorted	= $this->database->query(Database::prepareQuery("SELECT thumbUrl FROM {prefix}_photos WHERE album = 0 " . $this->settings['sorting'], $this->tablePrefix));
		$i			= 0;
		while($row = $unsorted->fetch_object()) {
			if ($i<3) {
				$return["unsortedThumb$i"] = LYCHEE_URL_UPLOADS_THUMB . $row->thumbUrl;
				$i++;
			} else break;
		}
		$return['unsortedNum'] = $unsorted->num_rows;

		# Public
		$public	= $this->database->query(Database::prepareQuery("SELECT thumbUrl FROM {prefix}_photos WHERE public = 1 " . $this->settings['sorting'], $this->tablePrefix));
		$i			= 0;
		while($row2 = $public->fetch_object()) {
			if ($i<3) {
				$return["publicThumb$i"] = LYCHEE_URL_UPLOADS_THUMB . $row2->thumbUrl;
				$i++;
			} else break;
		}
		$return['publicNum'] = $public->num_rows;

		# Starred
		$starred	= $this->database->query(Database::prepareQuery("SELECT thumbUrl FROM {prefix}_photos WHERE star = 1 " . $this->settings['sorting'], $this->tablePrefix));
		$i			= 0;
		while($row3 = $starred->fetch_object()) {
			if ($i<3) {
				$return["starredThumb$i"] = LYCHEE_URL_UPLOADS_THUMB . $row3->thumbUrl;
				$i++;
			} else break;
		}
		$return['starredNum'] = $starred->num_rows;

		# Recent
		$recent		= $this->database->query(Database::prepareQuery("SELECT thumbUrl FROM {prefix}_photos WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) " . $this->settings['sorting'], $this->tablePrefix));
		$i			= 0;
		while($row3 = $recent->fetch_object()) {
			if ($i<3) {
				$return["recentThumb$i"] = LYCHEE_URL_UPLOADS_THUMB . $row3->thumbUrl;
				$i++;
			} else break;
		}
		$return['recentNum'] = $recent->num_rows;

		return $return;

	}

	public function getArchive() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Illicit chars
		$badChars =	array_merge(
						array_map('chr', range(0,31)),
						array("<", ">", ":", '"', "/", "\\", "|", "?", "*")
					);

		# Photos query
		switch($this->albumIDs) {
			case 's':
				$photos = Database::prepareQuery("SELECT title, url FROM {prefix}_photos WHERE public = '1';", $this->tablePrefix);
				$zipTitle = 'Public';
				break;
			case 'f':
				$photos = Database::prepareQuery("SELECT title, url FROM {prefix}_photos WHERE star = '1';", $this->tablePrefix);
				$zipTitle = 'Starred';
				break;
			case 'r':
				$photos = Database::prepareQuery("SELECT title, url FROM {prefix}_photos WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY));", $this->tablePrefix);
				$zipTitle = 'Recent';
				break;
			default:
				$photos = Database::prepareQuery("SELECT title, url FROM {prefix}_photos WHERE album = '$this->albumIDs';", $this->tablePrefix);
				$zipTitle = 'Unsorted';
		}

		# Set title
		$album = $this->database->query(Database::prepareQuery("SELECT title FROM {prefix}_albums WHERE id = '$this->albumIDs' LIMIT 1;", $this->tablePrefix));
		if ($this->albumIDs!=0&&is_numeric($this->albumIDs)) $zipTitle = $album->fetch_object()->title;

		# Parse title
		$zipTitle = str_replace($badChars, '', $zipTitle);

		$filename = LYCHEE_DATA . $zipTitle . '.zip';

		# Create zip
		$zip = new ZipArchive();
		if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, 'Could not create ZipArchive');
			return false;
		}

		# Execute query
		$photos = $this->database->query($photos);

		# Check if album empty
		if ($photos->num_rows==0) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, 'Could not create ZipArchive without images');
			return false;
		}

		# Parse each path
		$files = array();
		while ($photo = $photos->fetch_object()) {

			# Parse url
			$photo->url = LYCHEE_UPLOADS_BIG . $photo->url;

			# Parse title
			$photo->title = str_replace($badChars, '', $photo->title);
			if (!isset($photo->title)||$photo->title==='') $photo->title = 'Untitled';

			# Check if readable
			if (!@is_readable($photo->url)) continue;

			# Get extension of image
			$extension = getExtension($photo->url);

			# Set title for photo
			$zipFileName = $zipTitle . '/' . $photo->title . $extension;

			# Check for duplicates
			if (!empty($files)) {
				$i = 1;
				while (in_array($zipFileName, $files)) {

					# Set new title for photo
					$zipFileName = $zipTitle . '/' . $photo->title . '-' . $i . $extension;

					$i++;

				}
			}

			# Add to array
			$files[] = $zipFileName;

			# Add photo to zip
			$zip->addFile($photo->url, $zipFileName);

		}

		# Finish zip
		$zip->close();

		# Send zip
		header("Content-Type: application/zip");
		header("Content-Disposition: attachment; filename=\"$zipTitle.zip\"");
		header("Content-Length: " . filesize($filename));
		readfile($filename);

		# Delete zip
		unlink($filename);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	public function setTitle($title = 'Untitled') {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Execute query
		$result = $this->database->query(Database::prepareQuery("UPDATE {prefix}_albums SET title = '$title' WHERE id IN ($this->albumIDs);", $this->tablePrefix));

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function setDescription($description = '') {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		$description = htmlentities($description);
		if (strlen($description)>1000) $description = substr($description, 0, 1000);

		# Execute query
		$result = $this->database->query(Database::prepareQuery("UPDATE {prefix}_albums SET description = '$description' WHERE id IN ($this->albumIDs);", $this->tablePrefix));

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function getPublic() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		if ($this->albumIDs==='0'||$this->albumIDs==='s'||$this->albumIDs==='f') return false;

		# Execute query
		$albums	= $this->database->query(Database::prepareQuery("SELECT public FROM {prefix}_albums WHERE id = '$this->albumIDs' LIMIT 1;", $this->tablePrefix));
		$album	= $albums->fetch_object();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album->public==1) return true;
		return false;

	}

	public function setPublic($password, $visible) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get public
		$albums	= $this->database->query(Database::prepareQuery("SELECT id, public FROM {prefix}_albums WHERE id IN ('$this->albumIDs');", $this->tablePrefix));

		while ($album = $albums->fetch_object()) {

			# Invert public
			$public = ($album->public=='0' ? 1 : 0);

			# Convert visible
			$visible = ($visible==='true' ? 1 : 0);

			# Set public
			$result = $this->database->query(Database::prepareQuery("UPDATE {prefix}_albums SET public = '$public', visible = '$visible', password = NULL WHERE id = '$album->id';", $this->tablePrefix));
			if (!$result) {
				Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
				return false;
			}

			# Reset permissions for photos
			if ($public===1) {
				$result = $this->database->query(Database::prepareQuery("UPDATE {prefix}_photos SET public = 0 WHERE album = '$album->id';", $this->tablePrefix));
				if (!$result) {
					Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
					return false;
				}
			}

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		# Set password
		if (isset($password)&&strlen($password)>0) return $this->setPassword($password);

		return true;

	}

	private function setPassword($password) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		if (strlen($password)>0) {

			# Get hashed password
			$password = get_hashed_password($password);

			# Set hashed password
			$result = $this->database->query(Database::prepareQuery("UPDATE {prefix}_albums SET password = '$password' WHERE id IN ('$this->albumIDs');", $this->tablePrefix));

		} else {

			# Unset password
			$result = $this->database->query(Database::prepareQuery("UPDATE {prefix}_albums SET password = NULL WHERE id IN ('$this->albumIDs');", $this->tablePrefix));

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function checkPassword($password) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Execute query
		$albums	= $this->database->query(Database::prepareQuery("SELECT password FROM {prefix}_albums WHERE id = '$this->albumIDs' LIMIT 1;", $this->tablePrefix));
		$album	= $albums->fetch_object();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album->password=='') return true;
		else if ($album->password===$password||$album->password===crypt($password, $album->password)) return true;
		return false;

	}

	public function delete($albumIDs) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Init vars
		$error = false;

		# Execute query
		$photos = $this->database->query(Database::prepareQuery("SELECT id FROM {prefix}_photos WHERE album IN ($albumIDs);", $this->tablePrefix));

		# For each album delete photo
		while ($row = $photos->fetch_object()) {

			$photo = new Photo($this->database, $this->tablePrefix, $this->plugins, null, $row->id);
			if (!$photo->delete($row->id)) $error = true;

		}

		# Delete albums
		$result = $this->database->query(Database::prepareQuery("DELETE FROM {prefix}_albums WHERE id IN ($albumIDs);", $this->tablePrefix));

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($error) return false;
		if (!$result) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

}

?>