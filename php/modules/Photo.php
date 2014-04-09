<?php

###
# @name		Photo Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Photo extends Module {

	private $database	= null;
	private $photoIDs	= null;

	public function __construct($database, $plugins, $photoIDs) {

		# Init vars
		$this->database	= $database;
		$this->plugins	= $plugins;
		$this->photoIDs	= $photoIDs;

		return true;

	}

	public function get($albumID) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photo
		$photos	= $this->database->query("SELECT * FROM lychee_photos WHERE id = '$this->photoIDs' LIMIT 1;");
		$photo	= $photos->fetch_assoc();

		# Parse photo
		$photo['sysdate'] = date('d M. Y', substr($photo['id'], 0, -4));
		if (strlen($photo['takedate'])>0) $photo['takedate'] = date('d M. Y', strtotime($photo['takedate']));

		if ($albumID!='false') {

			if ($photo['album']!=0) {

				# Get album
				$albums = $this->database->query("SELECT public FROM lychee_albums WHERE id = '" . $photo['album'] . " LIMIT 1';");
				$album = $albums->fetch_assoc();

				# Parse album
				$photo['public'] = ($album['public']=='1' ? '2' : $photo['public']);

			}

			$photo['original_album']	= $photo['album'];
			$photo['album']			= $albumID;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $photo;

	}

	public function getArchive() {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photo
		$photos	= $this->database->query("SELECT title, url FROM lychee_photos WHERE id = '$this->photoIDs' LIMIT 1;");
		$photo	= $photos->fetch_object();

		# Get extension
		$extension = array_reverse(explode('.', $photo->url));

		# Parse title
		if ($photo->title=='') $photo->title = 'Untitled';

		# Set headers
		header("Content-Type: application/octet-stream");
		header("Content-Disposition: attachment; filename=\"$photo->title.$extension[0]\"");
		header("Content-Length: " . filesize(__DIR__ . '/../../uploads/big/' . $photo->url));

		# Send file
		readfile(__DIR__ . '/../../uploads/big/' . $photo->url);

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	function setTitle($title) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		if (strlen($title)>50) $title = substr($title, 0, 50);

		# Set title
		$result = $this->database->query("UPDATE lychee_photos SET title = '$title' WHERE id IN ($this->photoIDs);");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	function setDescription($description) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse
		$description = htmlentities($description);
		if (strlen($description)>1000) $description = substr($description, 0, 1000);

		# Set description
		$result = $this->database->query("UPDATE lychee_photos SET description = '$description' WHERE id IN ('$this->photoIDs');");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	public function setStar() {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Init vars
		$error	= false;

		# Get photos
		$photos	= $this->database->query("SELECT id, star FROM lychee_photos WHERE id IN ($this->photoIDs);");

		# For each photo
		while ($photo = $photos->fetch_object()) {

			# Invert star
			$star = ($photo->star==0 ? 1 : 0);

			# Set star
			$star = $this->database->query("UPDATE lychee_photos SET star = '$star' WHERE id = '$photo->id';");
			if (!$star) $error = true;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if ($error) return false;
		return true;

	}

	function getPublic($password) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photo
		$photos	= $this->database->query("SELECT public, album FROM lychee_photos WHERE id = '$this->photoIDs' LIMIT 1;");
		$photo	= $photos->fetch_object();

		# Check if public
		if ($photo->public==1) return true;
		else {
			$album	= new Album($this->database, null, null, $photo->album);
			$acP		= $album->checkPassword($password);
			$agP		= $album->getPublic();
			if ($acP===true&&$agP===true) return true;
		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return false;

	}

	public function setPublic() {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get public
		$photos	= $this->database->query("SELECT public FROM lychee_photos WHERE id = '$this->photoIDs' LIMIT 1;");
		$photo	= $photos->fetch_object();

		# Invert public
		$public = ($photo->public==0 ? 1 : 0);

		# Set public
		$result = $this->database->query("UPDATE lychee_photos SET public = '$public' WHERE id = '$this->photoIDs';");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	function setAlbum($albumID) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Set album
		$result = $this->database->query("UPDATE lychee_photos SET album = '$albumID' WHERE id IN ($this->photoIDs);");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	public function setTags($tags) {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Parse tags
		$tags = preg_replace('/(\ ,\ )|(\ ,)|(,\ )|(,{1,}\ {0,})|(,$|^,)/', ',', $tags);
		$tags = preg_replace('/,$|^,/', ',', $tags);
		if (strlen($tags)>1000) return false;

		# Set tags
		$result = $this->database->query("UPDATE lychee_photos SET tags = '$tags' WHERE id IN ($this->photoIDs);");

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$result) return false;
		return true;

	}

	public function delete() {

		if (!isset($this->database, $this->photoIDs)) return false;

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Get photos
		$photos = $this->database->query("SELECT id, url, thumbUrl FROM lychee_photos WHERE id IN ($this->photoIDs);");

		# For each photo
		while ($photo = $photos->fetch_object()) {

			# Get retina thumb url
			$thumbUrl2x = explode(".", $photo->thumbUrl);
			$thumbUrl2x = $thumbUrl2x[0] . '@2x.' . $thumbUrl2x[1];

			# Delete files
			if (!unlink(__DIR__ . '/../../uploads/big/' . $photo->url))			return false;
			if (!unlink(__DIR__ . '/../../uploads/thumb/' . $photo->thumbUrl))	return false;
			if (!unlink(__DIR__ . '/../../uploads/thumb/' . $thumbUrl2x))		return false;

			# Delete db entry
			$delete = $this->database->query("DELETE FROM lychee_photos WHERE id = '$photo->id';");
			if (!$delete) return false;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		if (!$photos) return false;
		return true;

	}

}

?>