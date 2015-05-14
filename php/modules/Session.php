<?php

###
# @name			Session Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Session extends Module {

	private $settings = null;

	public function __construct($plugins, $settings) {

		# Init vars
		$this->plugins	= $plugins;
		$this->settings	= $settings;

		return true;

	}

	public function init($database, $dbName, $public, $version) {

		# Check dependencies
		self::dependencies(isset($this->settings, $public, $version));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Update
		if (!isset($this->settings['version'])||$this->settings['version']!==$version) {
			if (!Database::update($database, $dbName, @$this->settings['version'])) {
				Log::error($database, __METHOD__, __LINE__, 'Updating the database failed');
				exit('Error: Updating the database failed!');
			}
		}

		# Return settings
		$return['config'] = $this->settings;

		# Remove username and password from response
		unset($return['config']['username']);
		unset($return['config']['password']);

		# Remove identifier from response
		unset($return['config']['identifier']);

		# Path to Lychee for the server-import dialog
		$return['config']['location'] = LYCHEE;

		# Check if login credentials exist and login if they don't
		if ($this->noLogin()===true) {
			$public = false;
			$return['config']['login'] = false;
		} else {
			$return['config']['login'] = true;
		}

		if ($public===false) {

			# Logged in
			$return['status'] = LYCHEE_STATUS_LOGGEDIN;

		} else {

			# Logged out
			$return['status'] = LYCHEE_STATUS_LOGGEDOUT;

			# Unset unused vars
			unset($return['config']['thumbQuality']);
			unset($return['config']['sortingAlbums']);
			unset($return['config']['sortingPhotos']);
			unset($return['config']['dropboxKey']);
			unset($return['config']['login']);
			unset($return['config']['location']);
			unset($return['config']['imagick']);
			unset($return['config']['medium']);
			unset($return['config']['plugins']);

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $return;

	}

	public function login($username, $password) {

		# Check dependencies
		self::dependencies(isset($this->settings, $username, $password));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		$username = crypt($username, $this->settings['username']);
		$password = crypt($password, $this->settings['password']);

		# Check login with crypted hash
		if ($this->settings['username']===$username&&
			$this->settings['password']===$password) {
				$_SESSION['login']		= true;
				$_SESSION['identifier']	= $this->settings['identifier'];
				return true;
		}

		# No login
		if ($this->noLogin()===true) return true;

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return false;

	}

	private function noLogin() {

		# Check dependencies
		self::dependencies(isset($this->settings));

		# Check if login credentials exist and login if they don't
		if ($this->settings['username']===''&&
			$this->settings['password']==='') {
				$_SESSION['login']		= true;
				$_SESSION['identifier']	= $this->settings['identifier'];
				return true;
		}

		return false;

	}

	public function logout() {

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		$_SESSION['login']		= null;
		$_SESSION['identifier']	= null;

		session_destroy();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

}

?>