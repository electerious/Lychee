<?php

###
# @name		Settings Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Settings extends Module {

	private $database = null;

	public function __construct($database) {

		# Init vars
		$this->database = $database;

		return true;

	}

	public function get() {

		if (!isset($this->database)) return false;

		# Execute query
		$settings = $this->database->query('SELECT * FROM lychee_settings;');

		# Add each to return
		while ($setting = $settings->fetch_object()) $return[$setting->key] = $setting->value;

		return $return;

	}

	public function setLogin($oldPassword = '', $username, $password) {

		if (!isset($this->database)) return false;

		# Load settings
		$settings = $this->get();

		if ($oldPassword==$settings['password']) {

			# Save username
			if (!$this->setUsername($username)) exit('Error: Updating username failed!');

			# Save password
			if (!$this->setPassword($password)) exit('Error: Updating password failed!');

			return true;

		}

		exit('Error: Current password entered incorrectly!');

	}

	private function setUsername($username) {

		if (!isset($this->database)) return false;

		# Parse
		$username = htmlentities($username);
		if (strlen($username)>50) return false;

		# Execute query
		$result = $this->database->query("UPDATE lychee_settings SET value = '$username' WHERE `key` = 'username';");

		if (!$result) return false;
		return true;

	}

	private function setPassword($password) {

		if (!isset($this->database)) return false;

		if (strlen($password)<1||strlen($password)>50) return false;

		# Execute query
		$result = $this->database->query("UPDATE lychee_settings SET value = '$password' WHERE `key` = 'password';");

		if (!$result) return false;
		return true;

	}

	public function setDropboxKey($key) {

		if (!isset($this->database, $key)) return false;

		if (strlen($key)<1||strlen($key)>50) return false;

		# Execute query
		$result = $this->database->query("UPDATE lychee_settings SET value = '$key' WHERE `key` = 'dropboxKey';");

		if (!$result) return false;
		return true;

	}

	public function setSorting($type, $order) {

		if (!isset($this->database, $type, $order)) return false;

		$sorting = 'ORDER BY ';

		# Set row
		switch ($type) {

			case 'id':			$sorting .= 'id';
								break;

			case 'title':		$sorting .= 'title';
								break;

			case 'description':	$sorting .= 'description';
								break;

			case 'public':		$sorting .= 'public';
								break;

			case 'type':		$sorting .= 'type';
								break;

			case 'star':		$sorting .= 'star';
								break;

			case 'take':		$sorting .= 'UNIX_TIMESTAMP(STR_TO_DATE(CONCAT(takedate,"-",taketime),"%d.%m.%Y-%H:%i:%S"))';
								break;

			default:			exit('Error: Unknown type for sorting!');

		}

		$sorting .= ' ';

		# Set order
		switch ($order) {

			case 'ASC':		$sorting .= 'ASC';
							break;

			case 'DESC':	$sorting .= 'DESC';
							break;

			default:		exit('Error: Unknown order for sorting!');

		}

		# Execute query
		$result = $this->database->query("UPDATE lychee_settings SET value = '$sorting' WHERE `key` = 'sorting';");

		if (!$result) return false;
		return true;

	}

}

?>