<?php

###
# @name		Settings Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Settings extends Module {

	private $database = null;
        private $tablePrefix = null;

	public function __construct($database, $dbTablePrefix) {

		# Init vars
		$this->database = $database;
                $this->tablePrefix = $dbTablePrefix;

		return true;

	}

	public function get() {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix));

		# Execute query
                $query = Database::prepareQuery('SELECT * FROM {prefix}_settings;', $this->tablePrefix);

		$settings = $this->database->query($query);

		# Add each to return
		while ($setting = $settings->fetch_object()) $return[$setting->key] = $setting->value;

		# Fallback for versions below v2.5
		if (!isset($return['plugins'])) $return['plugins'] = '';

		return $return;

	}

	public function setLogin($oldPassword = '', $username, $password) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix));

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
		self::dependencies(isset($this->database, $this->tablePrefix));

		# Parse
		$username = htmlentities($username);
		if (strlen($username)>50) {
			Log::notice($this->database, $this->tablePrefix, __METHOD__, __LINE__, 'Username is longer than 50 chars');
			return false;
		}

		# Execute query
                $query = Database::prepareQuery("UPDATE {prefix}_settings SET value = '$username' WHERE `key` = 'username';", $this->tablePrefix);
		$result = $this->database->query($query);

		if (!$result) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	private function setPassword($password) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix));

		$password = get_hashed_password($password);

		# Execute query
                $query = Database::prepareQuery("UPDATE {prefix}_settings SET value = '$password' WHERE `key` = 'password';", $this->tablePrefix);
		$result = $this->database->query($query);

		if (!$result) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function setDropboxKey($key) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $key));

		if (strlen($key)<1||strlen($key)>50) {
			Log::notice($this->database, $this->tablePrefix, __METHOD__, __LINE__, 'Dropbox key is either too short or too long');
			return false;
		}

		# Execute query
                $query = Database::prepareQuery("UPDATE {prefix}_settings SET value = '$key' WHERE `key` = 'dropboxKey';", $this->tablePrefix);
		$result = $this->database->query($query);

		if (!$result) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

	public function setSorting($type, $order) {

		# Check dependencies
		self::dependencies(isset($this->database, $this->tablePrefix, $type, $order));

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
                $query = Database::prepareQuery("UPDATE {prefix}_settings SET value = '$sorting' WHERE `key` = 'sorting';", $this->tablePrefix);
		$result = $this->database->query($query);

		if (!$result) {
			Log::error($this->database, $this->tablePrefix, __METHOD__, __LINE__, $this->database->error);
			return false;
		}
		return true;

	}

}

?>