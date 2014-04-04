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

		if (!isset($this->database)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Database
		$sysdate	= date('d.m.Y');
		$result		= $this->database->query("INSERT INTO lychee_albums (title, sysdate, public, visible) VALUES ('$title', '$sysdate', '$public', '$visible');");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return $this->database->insert_id;

	}

	public function get() {

		if (!isset($this->database, $this->settings, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get album information
		switch($this->albumIDs) {

			case 'f':	$return['public'] = false;
						$query = "SELECT id, title, tags, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE star = 1 " . $this->settings['sorting'];
						break;

			case 's':	$return['public'] = false;
						$query = "SELECT id, title, tags, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE public = 1 " . $this->settings['sorting'];
						break;

			case '0':	$return['public'] = false;
						$query = "SELECT id, title, tags, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE album = 0 " . $this->settings['sorting'];
						break;

			default:	$albums = $this->database->query("SELECT * FROM lychee_albums WHERE id = '$this->albumIDs' LIMIT 1;");
						$return = $albums->fetch_assoc();
						$return['sysdate']		= date('d M. Y', strtotime($return['sysdate']));
						$return['password']		= ($return['password']=='' ? false : true);
						$query = "SELECT id, title, tags, sysdate, public, star, album, thumbUrl FROM lychee_photos WHERE album = '$this->albumIDs' " . $this->settings['sorting'];
						break;

		}

		# Get photos
		$photos				= $this->database->query($query);
		$previousPhotoID	= '';
		while($photo = $photos->fetch_assoc()) {

			# Parse
			$photo['sysdate']			= date('d F Y', strtotime($photo['sysdate']));
			$photo['previousPhoto']		= $previousPhotoID;
			$photo['nextPhoto']		= '';

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

		if (!isset($this->database, $this->settings, $public)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get SmartAlbums
		if ($public===false) $return = $this->getSmartInfo();

		# Albums query
		$query = 'SELECT id, title, public, sysdate, password FROM lychee_albums WHERE public = 1 AND visible <> 0';
		if ($public===false) $query = 'SELECT id, title, public, sysdate, password FROM lychee_albums';

		# Execute query
		$albums = $this->database->query($query) OR exit('Error: ' . $this->database->error);

		# For each album
		while ($album = $albums->fetch_assoc()) {

			# Parse info
			$album['sysdate']	= date('F Y', strtotime($album['sysdate']));
			$album['password']	= ($album['password'] != '');

			# Thumbs
			if (($public===true&&$album['password']===false)||($public===false)) {

				# Execute query
				$thumbs = $this->database->query("SELECT thumbUrl FROM lychee_photos WHERE album = '" . $album['id'] . "' ORDER BY star DESC, " . substr($this->settings['sorting'], 9) . " LIMIT 0, 3");

				# For each thumb
				$k = 0;
				while ($thumb = $thumbs->fetch_object()) {
					$album["thumb$k"] = $thumb->thumbUrl;
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

		if (!isset($this->database, $this->settings)) return false;

		# Unsorted
		$unsorted	= $this->database->query("SELECT thumbUrl FROM lychee_photos WHERE album = 0 " . $this->settings['sorting']);
		$i			= 0;
		while($row = $unsorted->fetch_object()) {
			if ($i<3) {
				$return["unsortedThumb$i"] = $row->thumbUrl;
				$i++;
			} else break;
		}
		$return['unsortedNum'] = $unsorted->num_rows;

		# Public
		$public	= $this->database->query("SELECT thumbUrl FROM lychee_photos WHERE public = 1 " . $this->settings['sorting']);
		$i			= 0;
		while($row2 = $public->fetch_object()) {
			if ($i<3) {
				$return["publicThumb$i"] = $row2->thumbUrl;
				$i++;
			} else break;
		}
		$return['publicNum'] = $public->num_rows;

		# Starred
		$starred	= $this->database->query("SELECT thumbUrl FROM lychee_photos WHERE star = 1 " . $this->settings['sorting']);
		$i			= 0;
		while($row3 = $starred->fetch_object()) {
			if ($i<3) {
				$return["starredThumb$i"] = $row3->thumbUrl;
				$i++;
			} else break;
		}
		$return['starredNum'] = $starred->num_rows;

		return $return;

	}

	public function getArchive() {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Photos query
		switch($this->albumIDs) {
			case 's':
				$photos = "SELECT url FROM lychee_photos WHERE public = '1';";
				$zipTitle = 'Public';
				break;
			case 'f':
				$photos = "SELECT url FROM lychee_photos WHERE star = '1';";
				$zipTitle = 'Starred';
				break;
			default:
				$photos = "SELECT url FROM lychee_photos WHERE album = '$this->albumIDs';";
				$zipTitle = 'Unsorted';
		}

		# Execute query
		$photos = $this->database->query($photos);

		# Init vars
		$zip	= new ZipArchive();
		$files	= array();
		$i		= 0;

		# Parse each url
		while ($photo = $photos->fetch_object()) {
			$files[$i] = '../uploads/big/' . $photo->url;
			$i++;
		}

		# Set title
		$album = $this->database->query("SELECT title FROM lychee_albums WHERE id = '$this->albumIDs' LIMIT 1;");
		if ($this->albumIDs!=0&&is_numeric($this->albumIDs)) $zipTitle = $album->fetch_object()->title;

		# Create zip
		$filename = "../data/$zipTitle.zip";
		if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE) return false;

		# Add each photo
		foreach ($files AS $file) {
			$newFile = explode('/', $file);
			$newFile = array_reverse($newFile);
			$zip->addFile($file, $zipTitle . '/' . $newFile[0]);
		}

		# Finish zip
		$zip->close();

		# Send zip
		header("Content-Type: application/zip");
		header("Content-Disposition: attachment; filename=\"$zipTitle.zip\"");
		header("Content-Length: ".filesize($filename));
		readfile($filename);

		# Delete zip
		unlink($filename);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	public function setTitle($title = 'Untitled') {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Execute query
		$result = $this->database->query("UPDATE lychee_albums SET title = '$title' WHERE id IN ($this->albumIDs);");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	public function setDescription($description = '') {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		$description = htmlentities($description);
		if (strlen($description)>1000) return false;

		# Execute query
		$result = $this->database->query("UPDATE lychee_albums SET description = '$description' WHERE id IN ($this->albumIDs);");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	public function setPublic($password) {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get public
		$albums	= $this->database->query("SELECT id, public FROM lychee_albums WHERE id IN ('$this->albumIDs');");

		while ($album = $albums->fetch_object()) {

			# Invert public
			$public = ($album->public=='0' ? 1 : 0);

			# Set public
			$result = $this->database->query("UPDATE lychee_albums SET public = '$public', password = NULL WHERE id = '$album->id';");
			if (!$result) return false;

			# Reset permissions for photos
			if ($public===1) {
				$result = $this->database->query("UPDATE lychee_photos SET public = 0 WHERE album = '$album->id';");
				if (!$result) return false;
			}

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		# Set password
		if (isset($password)&&strlen($password)>0) return $this->setPassword($password);

		return true;

	}

	public function getPublic() {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		if ($this->albumIDs==='0'||$this->albumIDs==='s'||$this->albumIDs==='f') return false;

		# Execute query
		$albums	= $this->database->query("SELECT public FROM lychee_albums WHERE id = '$this->albumIDs' LIMIT 1;");
		$album	= $albums->fetch_object();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album->public==1) return true;
		return false;

	}

	public function setPassword($password) {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins('setPassword:before', func_get_args());

		# Execute query
		$result = $this->database->query("UPDATE lychee_albums SET password = '$password' WHERE id IN ('$this->albumIDs');");

		# Call plugins
		$this->plugins('setPassword:after', func_get_args());

		if (!$result) return false;
		return true;

	}

	public function checkPassword($password) {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Execute query
		$albums	= $this->database->query("SELECT password FROM lychee_albums WHERE id = '$this->albumIDs' LIMIT 1;");
		$album	= $albums->fetch_object();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($album->password=='') return true;
		else if ($album->password===$password) return true;
		return false;

	}

	public function delete($albumIDs) {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Init vars
		$error = false;

		# Execute query
		$result = $this->database->query("SELECT id FROM lychee_photos WHERE album IN ($albumIDs);");

		# For each album delete photo
		while ($row = $result->fetch_object())
			if (!deletePhoto($row->id)) $error = true;

		# Delete albums
		$result = $this->database->query("DELETE FROM lychee_albums WHERE id IN ($albumIDs);");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($error||!$result) return false;
		return true;

	}

}