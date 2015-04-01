<?php

###
# @name			Settings Module
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
		self::dependencies(isset($this->database));

		# Execute query
		$query		= Database::prepare($this->database, "SELECT * FROM ?", array(LYCHEE_TABLE_SETTINGS));
		$settings	= $this->database->query($query);

		# Add each to return
		while ($setting = $settings->fetch_object()) $return[$setting->key] = $setting->value;

		# Fallback for versions below v2.5
		if (!isset($return['plugins'])) $return['plugins'] = '';

		return $return;

	}

	public function setLogin($oldPassword = '', $username, $password) {

		# Check dependencies
		self::dependencies(isset($this->database));

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
		self::dependencies(isset($this->database));

		# Parse
		$username = htmlentities($username);
		if (strlen($username)>50) {
			Log::notice($this->database, __METHOD__, __LINE__, 'Username is longer than 50 chars');
			return false;
		}

		# Execute query
		$query	= Database::prepare($this->database, "UPDATE ? SET value = '?' WHERE `key` = 'username'", array(LYCHEE_TABLE_SETTINGS, $username));
		$result	= $this->database->query($query);

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	private function setPassword($password) {

		# Check dependencies
		self::dependencies(isset($this->database));

		$password = get_hashed_password($password);

		# Execute query
		# Do not prepare $password because it is hashed and save
		# Preparing (escaping) the password would destroy the hash
		$query	= Database::prepare($this->database, "UPDATE ? SET value = '$password' WHERE `key` = 'password'", array(LYCHEE_TABLE_SETTINGS));
		$result	= $this->database->query($query);

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function setDropboxKey($key) {

		# Check dependencies
		self::dependencies(isset($this->database, $key));

		if (strlen($key)<1||strlen($key)>50) {
			Log::notice($this->database, __METHOD__, __LINE__, 'Dropbox key is either too short or too long');
			return false;
		}

		# Execute query
		$query	= Database::prepare($this->database, "UPDATE ? SET value = '?' WHERE `key` = 'dropboxKey'", array(LYCHEE_TABLE_SETTINGS, $key));
		$result = $this->database->query($query);

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function setSorting($type, $order) {

		# Check dependencies
		self::dependencies(isset($this->database, $type, $order));

		$sorting = 'ORDER BY ';

		# Set row
		switch ($type) {

			case 'id':			$sorting .= 'id';
								break;

			case 'title':		$sorting .= 'LENGTH(title), title';
								break;

			case 'description':	$sorting .= 'description';
								break;

			case 'public':		$sorting .= 'public';
								break;

			case 'type':		$sorting .= 'type';
								break;

			case 'star':		$sorting .= 'star';
								break;

			case 'takestamp':	$sorting .= 'takestamp';
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
		# Do not prepare $sorting because it is a true statement
		# Preparing (escaping) the sorting would destroy it
		$query	= Database::prepare($this->database, "UPDATE ? SET value = '$sorting' WHERE `key` = 'sorting'", array(LYCHEE_TABLE_SETTINGS));
		$result	= $this->database->query($query);

		if (!$result) {
			Log::error($this->database, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

}

?>
