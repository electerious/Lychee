<?php

###
# @name			Album Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Album {

	private $database	= null;
	private $plugins	= null;
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

	private function plugins($action, $args) {

		if (!isset($this->plugins, $action, $args)) return false;

		# Call plugins
		$this->plugins->activate("Album:$action", $args);

		return true;

	}

	public function add($title = 'Untitled', $public = 0, $visible = 1) {

		if (!isset($this->database)) return false;

		# Call plugins
		$this->plugins('add:before', func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Database
		$sysdate	= date('d.m.Y');
		$result		= $this->database->query("INSERT INTO lychee_albums (title, sysdate, public, visible) VALUES ('$title', '$sysdate', '$public', '$visible');");

		# Call plugins
		$this->plugins('add:after', func_get_args());

		if (!$result) return false;
		return $this->database->insert_id;

	}

	public function getAll($public) {

		if (!isset($this->database, $this->settings, $public)) return false;

		# Call plugins
		$this->plugins('getAll:before', func_get_args());

		# Get SmartAlbums
		if ($public===false) $return = getSmartInfo();

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
		$this->plugins('getAll:after', func_get_args());

		return $return;

	}

	public function setTitle($title = 'Untitled') {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins('setTitle:before', func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Execute query
		$result = $this->database->query("UPDATE lychee_albums SET title = '$title' WHERE id IN ($this->albumIDs);");

		# Call plugins
		$this->plugins('setTitle:after', func_get_args());

		if (!$result) return false;
		return true;

	}

	public function setDescription($description = '') {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins('setDescription:before', func_get_args());

		# Parse
		$description = htmlentities($description);
		if (strlen($description)>1000) return false;

		# Execute query
		$result = $this->database->query("UPDATE lychee_albums SET description = '$description' WHERE id IN ($this->albumIDs);");

		# Call plugins
		$this->plugins('setDescription:after', func_get_args());

		if (!$result) return false;
		return true;

	}

	public function setPublic($password) {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins('setPublic:before', func_get_args());

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
		$this->plugins('setPublic:after', func_get_args());

		# Set password
		if (isset($password)&&strlen($password)>0) return $this->setPassword($password);

		return true;

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

	public function delete($albumIDs) {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins('delete:before', func_get_args());

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
		$this->plugins('delete:after', func_get_args());

		if ($error||!$result) return false;
		return true;

	}

	public function getArchive() {

		if (!isset($this->database, $this->albumIDs)) return false;

		# Call plugins
		$this->plugins('getArchive:before', func_get_args());

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
		$this->plugins('getArchive:after', func_get_args());

		return true;

	}

}