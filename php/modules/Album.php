<?php

###
# @name			Album Module
# @copyright	2015 by Tobias Reich
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
		$stmt = $this->database->prepare("INSERT INTO ".LYCHEE_TABLE_ALBUMS.
				" (title, sysstamp, public, visible) 
				VALUES (:title, :sysstamp, :public, :visible)");
		$stmt->bindValue('title', $title, PDO::PARAM_STR);
		$stmt->bindValue('sysstamp', $sysstamp, PDO::PARAM_INT);
		$stmt->bindValue('public', $public, PDO::PARAM_BOOL);
		$stmt->bindValue('visible', $visible, PDO::PARAM_BOOL);
		$result = $stmt->execute();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
			return false;
		}

	}

	public static function prepareData($data) {

		# This function requires the following album-attributes and turns them
		# into a front-end friendly format: id, title, public, sysstamp, password
		# Note that some attributes remain unchanged

		# Check dependencies
		self::dependencies(isset($data));

		# Init
		$album = null;

		# Set unchanged attributes
		$album['id']		= $data['id'];
		$album['title']		= $data['title'];
		$album['public']	= $data['public'];

		# Parse date
		$album['sysdate'] = date('F Y', $data['sysstamp']);

		# Parse password
		$album['password'] = ($data['password']=='' ? '0' : '1');

		# Set placeholder for thumbs
		$album['thumbs'] = array();

		return $album;

	}

	public function get() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->settings, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get album information
		switch ($this->albumIDs) {

			case 'f':	$return['public'] = false;
						$sql = "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ".LYCHEE_TABLE_PHOTOS." WHERE star = true " . $this->settings['sortingPhotos'];
						break;

			case 's':	$return['public'] = false;
						$sql = "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ".LYCHEE_TABLE_PHOTOS." WHERE public = true " . $this->settings['sortingPhotos'];
						break;

			case 'r':	$return['public'] = false;
						switch ($this->database->getAttribute(PDO::ATTR_DRIVER_NAME)) {
							case 'mysql':
								$sql = "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ".LYCHEE_TABLE_PHOTOS." WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) " . $this->settings['sortingPhotos'];
								break;
							case 'pgsql':
								$sql = "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ".LYCHEE_TABLE_PHOTOS." WHERE sysstamp >= NOW()-INTERVAL '1 DAY' " . $this->settings['sortingPhotos'];
								break;
							}
						break;

			case '0':	$return['public'] = false;
						$sql = "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ".LYCHEE_TABLE_PHOTOS." WHERE album = '0' " . $this->settings['sortingPhotos'];
						break;

			default:	
						$stmt = $this->database->prepare("SELECT * FROM ".LYCHEE_TABLE_ALBUMS." WHERE id = :albumids LIMIT 1");
						$stmt->bindValue('albumids', $this->albumIDs, PDO::PARAM_INT);
						$result = $stmt->execute();
						$return = $stmt->fetch();
						$return['sysdate']	= date('d M. Y', $return['sysstamp']);
						$return['password']	= ($return['password']=='' ? false : true);
						$sql = "SELECT id, title, tags, public, star, album, thumbUrl, takestamp, url FROM ".LYCHEE_TABLE_PHOTOS." WHERE album = :albumids " . $this->settings['sortingPhotos'];
						break;

		}

		# Get photos
		$stmt = $this->database->prepare($sql);
		$stmt->bindValue('albumids', $this->albumIDs, PDO::PARAM_INT);
		$result = $stmt->execute();
		$previousPhotoID	= '';
		while ($photo = $stmt->fetch()) {

			# Turn data from the database into a front-end friendly format
			$photo = Photo::prepareData($photo);

			# Set previous and next photoID for navigation purposes
			$photo['previousPhoto'] = $previousPhotoID;
			$photo['nextPhoto']		= '';

			# Set current photoID as nextPhoto of previous photo
			if ($previousPhotoID!=='') $return['content'][$previousPhotoID]['nextPhoto'] = $photo['id'];
			$previousPhotoID = $photo['id'];

			# Add to return
			$return['content'][$photo['id']] = $photo;

		}

		if ($stmt->rowCount()===0) {

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
		$return['num']	= $stmt->rowCount();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $return;

	}

	public function getAll($public) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->settings, $public));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Initialize return var
		$return = array(
			'smartalbums'	=> null,
			'albums'		=> null,
			'num'			=> 0
		);

		# Get SmartAlbums
		if ($public===false) $return['smartalbums'] = $this->getSmartInfo();

		# Albums query
		$sql = 'SELECT id, title, public, sysstamp, password FROM '.LYCHEE_TABLE_ALBUMS.' WHERE public = true AND visible <> false ' . $this->settings['sortingAlbums'];
		if ($public===false) {
			$sql = 'SELECT id, title, public, sysstamp, password FROM '.LYCHEE_TABLE_ALBUMS.' '.$this->settings['sortingAlbums'];
		}

		# Execute query
		$albums = $this->database->query($sql);
		if (!$albums) {
			Log::error($database, __METHOD__, __LINE__, 'Could not get all albums (' . $database->errorInfo() . ')');
			exit('Error: ' . $this->database->errorInfo());
		}

		# For each album
		while ($album = $albums->fetch()) {

			# Turn data from the database into a front-end friendly format
			$album = Album::prepareData($album);

			# Thumbs
			if (($public===true&&$album['password']===false)||($public===false)) {

				# Execute query
				$stmt = $this->database->prepare("SELECT thumbUrl FROM ".LYCHEE_TABLE_PHOTOS." WHERE album = :albumid ORDER BY star DESC, " . substr($this->settings['sortingPhotos'], 9) . " LIMIT 3");
				$stmt->bindValue('albumid', $album['id'], PDO::PARAM_STR);
				$stmt->execute();

				# For each thumb
				$k = 0;
				while ($thumb = $stmt->fetch()) {
					$album["thumb"][$k] = LYCHEE_URL_UPLOADS_THUMB . $thumb['thumbUrl'];
					$k++;
				}

			}

			# Add to return
			$return['albums'][] = $album;

		}

		# Num of albums
		$return['num'] = $albums->rowCount();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $return;

	}

	private function getSmartInfo() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->settings));

		# Initialize return var
		$return = array(
			'unsorted'	=> null,
			'public'	=> null,
			'starred'	=> null,
			'recent'	=> null
		);

		###
		# Unsorted
		###

		$sql = "SELECT thumbUrl FROM ".LYCHEE_TABLE_PHOTOS." WHERE album = '0' " . $this->settings['sortingPhotos'];
		$unsorted	= $this->database->query($sql);
		$i			= 0;

		$return['unsorted'] = array(
			'thumbs'	=> array(),
			'num'		=> $unsorted->rowCount()
		);

		while($row = $unsorted->fetch()) {
			if ($i<3) {
				$return['unsorted']['thumbs'][$i] = LYCHEE_URL_UPLOADS_THUMB . $row['thumbUrl'];
				$i++;
			} else break;
		}

		###
		# Starred
		###

		$sql = 'SELECT thumbUrl FROM '.LYCHEE_TABLE_PHOTOS.' WHERE star = true ' . $this->settings['sortingPhotos'];
		$starred	= $this->database->query($sql);
		$i			= 0;

		$return['starred'] = array(
			'thumbs'	=> array(),
			'num'		=> $starred->rowCount()
		);

		while($row3 = $starred->fetch()) {
			if ($i<3) {
				$return['starred']['thumbs'][$i] = LYCHEE_URL_UPLOADS_THUMB . $row3['thumbUrl'];
				$i++;
			} else break;
		}

		###
		# Public
		###

		$sql = 'SELECT thumbUrl FROM '.LYCHEE_TABLE_PHOTOS.' WHERE public = true ' . $this->settings['sortingPhotos'];
		$public	= $this->database->query($sql);
		$i			= 0;

		$return['public'] = array(
			'thumbs'	=> array(),
			'num'		=> $public->rowCount()
		);

		while($row2 = $public->fetch()) {
			if ($i<3) {
				$return['public']['thumbs'][$i] = LYCHEE_URL_UPLOADS_THUMB . $row2['thumbUrl'];
				$i++;
			} else break;
		}

		###
		# Recent
		###

		switch ($this->database->getAttribute(PDO::ATTR_DRIVER_NAME)) {
			case 'mysql':
				$sql = 'SELECT thumbUrl FROM '.LYCHEE_TABLE_PHOTOS.' WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) ' . $this->settings['sortingPhotos'];
				break;
			case 'pgsql':
				$sql = "SELECT thumbUrl FROM ".LYCHEE_TABLE_PHOTOS." WHERE sysstamp >= NOW()-INTERVAL '1 DAY' " . $this->settings['sortingPhotos'];
				break;
		}
		$recent	= $this->database->query($sql);
		$i			= 0;

		$return['recent'] = array(
			'thumbs'	=> array(),
			'num'		=> $recent->rowCount()
		);

		while($row3 = $recent->fetch()) {
			if ($i<3) {
				$return['recent']['thumbs'][$i] = LYCHEE_URL_UPLOADS_THUMB . $row3['thumbUrl'];
				$i++;
			} else break;
		}

		# Return SmartAlbums
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
				$sql = 'SELECT title, url FROM '.LYCHEE_TABLE_PHOTOS.' WHERE public = true';
				$zipTitle	= 'Public';
				break;
			case 'f':
				$sql ='SELECT title, url FROM '.LYCHEE_TABLE_PHOTOS.' WHERE star = true';
				$zipTitle	= 'Starred';
				break;
			case 'r':
				switch ($this->database->getAttribute(PDO::ATTR_DRIVER_NAME)) {
					case 'mysql':
						$sql ='SELECT title, url FROM '.LYCHEE_TABLE_PHOTOS.' WHERE LEFT(id, 10) >= unix_timestamp(DATE_SUB(NOW(), INTERVAL 1 DAY)) GROUP BY checksum';
						break;
					case 'pgsql':
						$sql ="SELECT title, url FROM '.LYCHEE_TABLE_PHOTOS.' WHERE sysstamp >= NOW() - INTERVAL '1 DAY' GROUP BY checksum";
						break;
				}
				$zipTitle	= 'Recent';
				break;
			default:
				$sql = "SELECT title, url FROM ".LYCHEE_TABLE_PHOTOS." WHERE album = :albumids";
				$zipTitle	= 'Unsorted';
		}

		# Get title from database when album is not a SmartAlbum
		if ($this->albumIDs!=0&&is_numeric($this->albumIDs)) {

			$stmt = $this->database->prepare("SELECT title FROM ".LYCHEE_TABLE_ALBUMS." WHERE id = :albumids LIMIT 1");
			$stmt->bindValue('albumids', $this->albumIDs, PDO::PARAM_INT);
			$stmt->execute();

			# Error in database query
			if (!$album) {
				Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
				return false;
			}

			# Fetch object
			$album = $stmt->fetch();

			# Photo not found
			if ($album===null) {
				Log::error($this->database, __METHOD__, __LINE__, 'Album not found. Cannot start download.');
				return false;
			}

			# Set title
			$zipTitle = $album['title'];

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
		$photosStmt = $this->database->prepare($sql);
		$photosStmt->bindValue('albumids', $this->albumIDs, PDO::PARAM_STR);
		$photos = $photosStmt->execute();

		# Check if album empty
		if ($photosStmt->rowCount()==0) {
			Log::error($this->database, __METHOD__, __LINE__, 'Could not create ZipArchive without images');
			return false;
		}

		# Parse each path
		$files = array();
		while ($photo = $photosStmt->fetch()) {

			# Parse url
			$photo['url'] = LYCHEE_UPLOADS_BIG . $photo['url'];

			# Parse title
			$photo['title'] = str_replace($badChars, '', $photo['title']);
			if (!isset($photo['title'])||$photo['title']==='') $photo['title'] = 'Untitled';

			# Check if readable
			if (!@is_readable($photo['url'])) continue;

			# Get extension of image
			$extension = getExtension($photo['url']);

			# Set title for photo
			$zipFileName = $zipTitle . '/' . $photo['title'] . $extension;

			# Check for duplicates
			if (!empty($files)) {
				$i = 1;
				while (in_array($zipFileName, $files)) {

					# Set new title for photo
					$zipFileName = $zipTitle . '/' . $photo['title'] . '-' . $i . $extension;

					$i++;

				}
			}

			# Add to array
			$files[] = $zipFileName;

			# Add photo to zip
			$zip->addFile($photo['url'], $zipFileName);

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

		# Execute query
		$inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));
		$stmt =  $this->database->prepare("UPDATE ".LYCHEE_TABLE_ALBUMS." SET title = ? WHERE id IN (".$inAlbums.")");
		$stmt->bindValue(1, $title, PDO::PARAM_STR);
		if (count($this->albumIDs)===1) {
			$stmt->bindValue(2, $albumId, PDO::PARAM_INT);
		} else {
			foreach ($this->albumIDs as $k => $albumId)
				$stmt->bindValue(($k+2), $albumId, PDO::PARAM_INT);
		}
		$result = $stmt->execute();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
			return false;
		}
		return true;

	}

	public function setDescription($description = '') {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Execute query
                $inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));
		$stmt =  $this->database->prepare("UPDATE ".LYCHEE_TABLE_ALBUMS." SET description = :description WHERE id IN (".$inAlbums.")");
		$stmt->bindValue('description', $description, PDO::PARAM_STR);
		if (count($this->albumIDs)===1) {
			$stmt->bindValue(2, $albumId, PDO::PARAM_INT);
		} else {
	                foreach ($this->albumIDs as $k => $albumId)
        	                $stmt->bindValue(($k+2), $albumId, PDO::PARAM_INT);
		}
		$result = $stmt->execute();
		
		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
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
		$stmt =  $this->database->prepare("SELECT public FROM ".LYCHEE_TABLE_ALBUMS." WHERE id = :albumids LIMIT 1");
		$stmt->bindValue('albumids', $this->albumIDs, PDO::PARAM_INT);
		$result = $stmt->execute();
		$album = $stmt->fetch();
		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album['public']==1) return true;
		return false;

	}

	public function getDownloadable() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		if ($this->albumIDs==='0'||$this->albumIDs==='s'||$this->albumIDs==='f'||$this->albumIDs==='r') return false;

		# Execute query
		$stmt =  $this->database->prepare("SELECT downloadable FROM ".LYCHEE_TABLE_ALBUMS." WHERE id = :albumids LIMIT 1");
		$stmt->bindValue('albumids', $this->albumIDs, PDO::PARAM_INT);
		$result = $stmt->execute();
		$album = $stmt->fetch();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album['downloadable']==1) return true;
		return false;

	}

	public function setPublic($public, $password, $visible, $downloadable) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Convert values
		$public			= ($public==='1' ? 1 : 0);
		$visible		= ($visible==='1' ? 1 : 0);
		$downloadable	= ($downloadable==='1' ? 1 : 0);

		# Set public
                $inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));
		$stmt =  $this->database->prepare("UPDATE ".LYCHEE_TABLE_ALBUMS." SET public = ?, visible = ?, downloadable = ?, password = NULL WHERE id IN (".$inAlbums.")");
		$stmt->bindValue(1, $public, PDO::PARAM_BOOL);
		$stmt->bindValue(2, $visible, PDO::PARAM_BOOL);
		$stmt->bindValue(3, $downloadable, PDO::PARAM_BOOL);
		if (count($this->albumIDs)===1) {
			$stmt->bindValue(4, $albumId, PDO::PARAM_INT);
		} else {
	                foreach ($this->albumIDs as $k => $albumId)
        	                $stmt->bindValue(($k+4), $albumId, PDO::PARAM_INT);
		}
		$result = $stmt->execute();

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
			return false;
		}

		# Reset permissions for photos
		if ($public===1) {
			$inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));
			$stmt =  $this->database->prepare("UPDATE ".LYCHEE_TABLE_PHOTOS." SET public = false WHERE album IN (".$inAlbums.")");
			if (count($this->albumIDs)===1) {
				$stmt->bindValue(1, $albumId, PDO::PARAM_INT);
			} else {
				foreach ($this->albumIDs as $k => $albumId)
					$stmt->bindValue(($k+1), $albumId, PDO::PARAM_INT);
			}
			$result = $stmt->execute();
			if (!$result) {
				Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
				return false;
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
			$password = getHashedString($password);

			# Set hashed password
			# Do not prepare $password because it is hashed and save
			# Preparing (escaping) the password would destroy the hash
	                $inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));
			$stmt = $this->database->prepare("UPDATE ".LYCHEE_TABLE_ALBUMS." SET password = '$password' WHERE id IN (".$inAlbums.")");
			if (count($this->albumIDs)===1) {
				$stmt->bindValue(1, $albumId, PDO::PARAM_INT);
			} else {
	        	        foreach ($this->albumIDs as $k => $albumId)
        	        	        $stmt->bindValue(($k+1), $albumId, PDO::PARAM_INT);
			}

		} else {

			# Unset password
                        $inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));			
			$stmt = $this->database->prepare("UPDATE ".LYCHEE_TABLE_ALBUMS." SET password = NULL WHERE id IN (".$inAlbums.")");
			if (count($this->albumIDs)===1) {
				$stmt->bindValue(1, $albumId, PDO::PARAM_INT);
			} else {
                        	foreach ($this->albumIDs as $k => $albumId)
					$stmt->bindValue(($k+1), $albumId, PDO::PARAM_INT);
			}

		}

		# Execute query
		$result = $stmt->execute();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
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
		$stmt = $this->database->prepare("SELECT password FROM ".LYCHEE_TABLE_ALBUMS." WHERE id = :albumids LIMIT 1");
		$stmt->bindValue('albumids', $this->albumIDs, PDO::PARAM_INT);
		$result = $stmt->execute();
		$album	= $stmt->fetch();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album['password']=='') return true;
		else if ($album['password']===crypt($password, $album['password'])) return true;
		return false;

	}

	public function merge() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Convert to array
		$albumIDs = explode(',', $this->albumIDs);

		# Get first albumID
		$albumID = array_splice($albumIDs, 0, 1);
		$albumID = $albumID[0];

		$inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));			
		$stmt = $this->database->prepare("UPDATE ".LYCHEE_TABLE_ALBUMS." SET album = ? WHERE album IN (".$inAlbums.")");
		$stmt->bindValue(1, $albumID, PDO::PARAM_INT);
		if (count($this->albumIDs)===1) {
			$stmt->bindValue(2, $albumId, PDO::PARAM_INT);
		} else {
                        foreach ($this->albumIDs as $k => $albumId)
				$stmt->bindValue(($k+2), $albumId, PDO::PARAM_INT);
		}
		$result = $stmt->execute();

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
			return false;
		}

		# $albumIDs contains all IDs without the first albumID
		# Convert to string
		$filteredIDs = implode(',', $albumIDs);

		$inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));			
		$stmt = $this->database->prepare("DELETE FROM ".LYCHEE_TABLE_ALBUMS." WHERE id IN (".$inAlbums.")");
		if (count($this->albumIDs)===1) {
			$stmt->bindValue(1, $albumId, PDO::PARAM_INT);
		} else {
                        foreach ($this->albumIDs as $k => $albumId)
				$stmt->bindValue(($k+1), $albumId, PDO::PARAM_INT);
		}
		$result = $stmt->execute();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
			return false;
		}
		return true;

	}

	public function delete() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->albumIDs));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Init vars
		$error = false;

		# Execute query
		$inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));
		$stmt = $this->database->prepare("SELECT id FROM ".LYCHEE_TABLE_PHOTOS." WHERE album IN (".$inAlbums.")");
		if (count($this->albumIDs)===1) {
			$stmt->bindValue(1, $albumId, PDO::PARAM_INT);
		} else {
			foreach ($this->albumIDs as $k => $albumId)
				$stmt->bindValue(($k+1), $albumId, PDO::PARAM_INT);
		}
		$result = $stmt->execute();
		
		# For each album delete photo
		while ($row = $stmt->fetch()) {

			$photo = new Photo($this->database, $this->plugins, null, $row['id']);
			if (!$photo->delete($row['id'])) $error = true;

		}

		# Delete albums
		$inAlbums = implode(',', array_fill(0, count($this->albumIDs), '?'));
		$stmt = $this->database->prepare("DELETE FROM ".LYCHEE_TABLE_PHOTOS." WHERE id IN (".$inAlbums.")");
		if (count($this->albumIDs)===1) {
			$stmt->bindValue(1, $albumId, PDO::PARAM_INT);
		} else {
			foreach ($this->albumIDs as $k => $albumId)
				$stmt->bindValue(($k+1), $albumId, PDO::PARAM_INT);
		}
		$result = $stmt->execute();
		
		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($error) return false;
		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->errorInfo());
			return false;
		}
		return true;

	}

}

?>
