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

		# Check dependencies
		$this->dependencies(isset($this->database));

		# Execute query
		$settings = $this->database->query('SELECT * FROM lychee_settings;');

		# Add each to return
		while ($setting = $settings->fetch_object()) $return[$setting->key] = $setting->value;

		# Fallback for versions below v2.5
		if (!isset($return['plugins'])) $return['plugins'] = '';

		return $return;

	}

	public function setLogin($oldPassword = '', $username, $password) {

		# Check dependencies
		$this->dependencies(isset($this->database));

		# Load settings
		$settings = $this->get();

		if ($oldPassword===$settings['password']||$settings['password']===crypt($oldPassword, $settings['password'])) {

			# Save username
			if (!$this->setUsername($username)) exit('Error: Updating username failed!');

			# Save password
			if (!$this->setPassword($password)) exit('Error: Updating password failed!');

			return true;

		}

		exit('Error: Current password entered incorrectly!');

	}

	private function setUsername($username) {

		# Check dependencies
		$this->dependencies(isset($this->database));

		# Parse
		$username = htmlentities($username);
		if (strlen($username)>50) return false;

		# Execute query
		$result = $this->database->query("UPDATE lychee_settings SET value = '$username' WHERE `key` = 'username';");

		if (!$result) return false;
		return true;

	}

	private function setPassword($password) {

		# Check dependencies
		$this->dependencies(isset($this->database));

		$password = get_hashed_password($password);

		# Execute query
		$result = $this->database->query("UPDATE lychee_settings SET value = '$password' WHERE `key` = 'password';");

		if (!$result) return false;
		return true;

	}

	public function setDropboxKey($key) {

		# Check dependencies
		$this->dependencies(isset($this->database, $key));

		if (strlen($key)<1||strlen($key)>50) return false;

		# Execute query
		$result = $this->database->query("UPDATE lychee_settings SET value = '$key' WHERE `key` = 'dropboxKey';");

		if (!$result) return false;
		return true;

	}

	public function setSorting($type, $order) {

		# Check dependencies
		$this->dependencies(isset($this->database, $type, $order));

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

			case 'take':		$sorting .= 'takestamp';
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