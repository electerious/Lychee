<?php

###
# @name			Album Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Album extends Module {

	private $database	= null;
	private $settings	= null;
	private $albumIDs	= null;

	public function __construct($database, $plugins, $settings, $albumIDs) {

		# Init vars
		$this->database	= $database;
		$this->plugins	= $plugins;
		$this->settings	= $settings;
		$this->albumIDs	= $albumIDs;

		return true;

	}

	public function add($title = 'Untitled', $public = 0, $visible = 1) {

		# Check dependencies
		self::dependencies(isset($this->database));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Database
		$sysstamp	= time();
		$query		= Database::prepare($this->database, "INSERT INTO ? (title, sysstamp, public, visible) VALUES ('?', '?', '?', '?')", array(LYCHEE_TABLE_ALBUMS, $title, $sysstamp, $public, $visible));
		$result		= $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return $this->database->insert_id;

	}

	public function get() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->settings, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get album information
		switch ($this->albumIDs) {

			case 'f':	$return['public'] = false;
						$query = Database::prepare($this->database, "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ? WHERE star = 1 " . $this->settings['sorting'], array(LYCHEE_TABLE_PHOTOS));
						break;

			case 's':	$return['public'] = false;
						$query = Database::prepare($this->database, "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ? WHERE public = 1 " . $this->settings['sorting'], array(LYCHEE_TABLE_PHOTOS));
						break;

			case 'r':	$return['public'] = false;
						$query = Database::prepare($this->database, "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ? WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) " . $this->settings['sorting'], array(LYCHEE_TABLE_PHOTOS));
						break;

			case '0':	$return['public'] = false;
						$query = Database::prepare($this->database, "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ? WHERE album = 0 " . $this->settings['sorting'], array(LYCHEE_TABLE_PHOTOS));
						break;

			default:	$query	= Database::prepare($this->database, "SELECT * FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
						$albums = $this->database->query($query);
						$return = $albums->fetch_assoc();
						$return['sysdate']	= date('d M. Y', $return['sysstamp']);
						$return['password']	= ($return['password']=='' ? false : true);
						$query	= Database::prepare($this->database, "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ? WHERE album = '?' " . $this->settings['sorting'], array(LYCHEE_TABLE_PHOTOS, $this->albumIDs));
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

			# Parse url
			$photo['url'] = LYCHEE_URL_UPLOADS_BIG . $photo['url'];

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
		self::dependencies(isset($this->database, $this->settings, $public));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get SmartAlbums
		if ($public===false) $return = $this->getSmartInfo();

		# Albums query
		$query = Database::prepare($this->database, 'SELECT id, title, public, sysstamp, password FROM ? WHERE public = 1 AND visible <> 0', array(LYCHEE_TABLE_ALBUMS));
		if ($public===false) $query = Database::prepare($this->database, 'SELECT id, title, public, sysstamp, password FROM ?', array(LYCHEE_TABLE_ALBUMS));

		# Execute query
		$albums = $this->database->query($query);
		if (!$albums) {
			Log::error($database, __METHOD__, __LINE__, 'Could not get all albums (' . $database->error . ')');
			exit('Error: ' . $this->database->error);
		}

		# For each album
		while ($album = $albums->fetch_assoc()) {

			# Parse info
			$album['sysdate']	= date('F Y', $album['sysstamp']);
			$album['password']	= ($album['password'] != '');

			# Thumbs
			if (($public===true&&$album['password']===false)||($public===false)) {

				# Execute query
				$query	= Database::prepare($this->database, "SELECT thumbUrl FROM ? WHERE album = '?' ORDER BY star DESC, " . substr($this->settings['sorting'], 9) . " LIMIT 3", array(LYCHEE_TABLE_PHOTOS, $album['id']));
				$thumbs	= $this->database->query($query);

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
		self::dependencies(isset($this->database, $this->settings));

		# Unsorted
		$query		= Database::prepare($this->database, 'SELECT thumbUrl FROM ? WHERE album = 0 ' . $this->settings['sorting'], array(LYCHEE_TABLE_PHOTOS));
		$unsorted	= $this->database->query($query);
		$i			= 0;
		while($row = $unsorted->fetch_object()) {
			if ($i<3) {
				$return["unsortedThumb$i"] = LYCHEE_URL_UPLOADS_THUMB . $row->thumbUrl;
				$i++;
			} else break;
		}
		$return['unsortedNum'] = $unsorted->num_rows;

		# Public
		$query		= Database::prepare($this->database, 'SELECT thumbUrl FROM ? WHERE public = 1 ' . $this->settings['sorting'], array(LYCHEE_TABLE_PHOTOS));
		$public		= $this->database->query($query);
		$i			= 0;
		while($row2 = $public->fetch_object()) {
			if ($i<3) {
				$return["publicThumb$i"] = LYCHEE_URL_UPLOADS_THUMB . $row2->thumbUrl;
				$i++;
			} else break;
		}
		$return['publicNum'] = $public->num_rows;

		# Starred
		$query		= Database::prepare($this->database, 'SELECT thumbUrl FROM ? WHERE star = 1 ' . $this->settings['sorting'], array(LYCHEE_TABLE_PHOTOS));
		$starred	= $this->database->query($query);
		$i			= 0;
		while($row3 = $starred->fetch_object()) {
			if ($i<3) {
				$return["starredThumb$i"] = LYCHEE_URL_UPLOADS_THUMB . $row3->thumbUrl;
				$i++;
			} else break;
		}
		$return['starredNum'] = $starred->num_rows;

		# Recent
		$query		= Database::prepare($this->database, 'SELECT thumbUrl FROM ? WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) ' . $this->settings['sorting'], array(LYCHEE_TABLE_PHOTOS));
		$recent		= $this->database->query($query);
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
		self::dependencies(isset($this->database, $this->albumIDs));

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
				$photos		= Database::prepare($this->database, 'SELECT title, url FROM ? WHERE public = 1', array(LYCHEE_TABLE_PHOTOS));
				$zipTitle	= 'Public';
				break;
			case 'f':
				$photos		= Database::prepare($this->database, 'SELECT title, url FROM ? WHERE star = 1', array(LYCHEE_TABLE_PHOTOS));
				$zipTitle	= 'Starred';
				break;
			case 'r':
				$photos		= Database::prepare($this->database, 'SELECT title, url FROM ? WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) GROUP BY checksum', array(LYCHEE_TABLE_PHOTOS));
				$zipTitle	= 'Recent';
				break;
			default:
				$photos		= Database::prepare($this->database, "SELECT title, url FROM ? WHERE album = '?'", array(LYCHEE_TABLE_PHOTOS, $this->albumIDs));
				$zipTitle	= 'Unsorted';
		}

		# Set title
		if ($this->albumIDs!=0&&is_numeric($this->albumIDs)) {
			$query = Database::prepare($this->database, "SELECT title FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
			$album = $this->database->query($query);
			$zipTitle = $album->fetch_object()->title;
		}

		# Escape title
		$zipTitle = str_replace($badChars, '', $zipTitle);

		$filename = LYCHEE_DATA . $zipTitle . '.zip';

		# Create zip
		$zip = new ZipArchive();
		if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE) {
			Log::error($this->database, __METHOD__, __LINE__, 'Could not create ZipArchive');
			return false;
		}

		# Execute query
		$photos = $this->database->query($photos);

		# Check if album empty
		if ($photos->num_rows==0) {
			Log::error($this->database, __METHOD__, __LINE__, 'Could not create ZipArchive without images');
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
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Execute query
		$query	= Database::prepare($this->database, "UPDATE ? SET title = '?' WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $title, $this->albumIDs));
		$result = $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function setDescription($description = '') {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		$description = htmlentities($description, ENT_COMPAT | ENT_HTML401, 'UTF-8');
		if (strlen($description)>1000) $description = substr($description, 0, 1000);

		# Execute query
		$query	= Database::prepare($this->database, "UPDATE ? SET description = '?' WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $description, $this->albumIDs));
		$result	= $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function getPublic() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		if ($this->albumIDs==='0'||$this->albumIDs==='s'||$this->albumIDs==='f') return false;

		# Execute query
		$query	= Database::prepare($this->database, "SELECT public FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
		$albums	= $this->database->query($query);
		$album	= $albums->fetch_object();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album->public==1) return true;
		return false;

	}

	public function getDownloadable() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		if ($this->albumIDs==='0'||$this->albumIDs==='s'||$this->albumIDs==='f'||$this->albumIDs==='r') return false;

		# Execute query
		$query	= Database::prepare($this->database, "SELECT downloadable FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
		$albums	= $this->database->query($query);
		$album	= $albums->fetch_object();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album->downloadable==1) return true;
		return false;

	}

	public function setPublic($password, $visible, $downloadable) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get public
		$query	= Database::prepare($this->database, "SELECT id, public FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
		$albums	= $this->database->query($query);

		while ($album = $albums->fetch_object()) {

			# Invert public
			$public = ($album->public=='0' ? 1 : 0);

			# Convert visible
			$visible = ($visible==='true' ? 1 : 0);

			# Convert downloadable
			$downloadable = ($downloadable==='true' ? 1 : 0);

			# Set public
			$query	= Database::prepare($this->database, "UPDATE ? SET public = '?', visible = '?', downloadable = '?', password = NULL WHERE id = '?'", array(LYCHEE_TABLE_ALBUMS, $public, $visible, $downloadable, $album->id));
			$result	= $this->database->query($query);
			if (!$result) {
				Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
				return false;
			}

			# Reset permissions for photos
			if ($public===1) {
				$query	= Database::prepare($this->database, "UPDATE ? SET public = 0 WHERE album = '?'", array(LYCHEE_TABLE_PHOTOS, $album->id));
				$result	= $this->database->query($query);
				if (!$result) {
					Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
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
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		if (strlen($password)>0) {

			# Get hashed password
			$password = get_hashed_password($password);

			# Set hashed password
			# Do not prepare $password because it is hashed and save
			# Preparing (escaping) the password would destroy the hash
			$query	= Database::prepare($this->database, "UPDATE ? SET password = '$password' WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
			$result	= $this->database->query($query);

		} else {

			# Unset password
			$query	= Database::prepare($this->database, "UPDATE ? SET password = NULL WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
			$result	= $this->database->query($query);

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function checkPassword($password) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Execute query
		$query	= Database::prepare($this->database, "SELECT password FROM ? WHERE id = '?' LIMIT 1", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
		$albums	= $this->database->query($query);
		$album	= $albums->fetch_object();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album->password=='') return true;
		else if ($album->password===$password||$album->password===crypt($password, $album->password)) return true;
		return false;

	}

	public function delete() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Init vars
		$error = false;

		# Execute query
		$query	= Database::prepare($this->database, "SELECT id FROM ? WHERE album IN (?)", array(LYCHEE_TABLE_PHOTOS, $this->albumIDs));
		$photos = $this->database->query($query);

		# For each album delete photo
		while ($row = $photos->fetch_object()) {

			$photo = new Photo($this->database, $this->plugins, null, $row->id);
			if (!$photo->delete($row->id)) $error = true;

		}

		# Delete albums
		$query	= Database::prepare($this->database, "DELETE FROM ? WHERE id IN (?)", array(LYCHEE_TABLE_ALBUMS, $this->albumIDs));
		$result	= $this->database->query($query);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($error) return false;
		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

}

?>