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
	private $settings	= array();
	private $albumIDs	= array();

	public function __construct($database = null, $plugins = null, $settings = null, $albumIDs = array()) {

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
		$this->plugins->activate("Albums:$action", $args);

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

		if (!isset($public)) return false;

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

}