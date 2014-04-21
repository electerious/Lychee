<?php

###
# @name		Session Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
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
		$this->dependencies(isset($this->settings, $public, $version));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Update
		if (!isset($this->settings['version'])||$this->settings['version']!==$version)
			if (!Database::update($database, $dbName, @$this->settings['version'])) exit('Error: Updating the database failed!');

		# Return settings
		$return['config'] = $this->settings;
		unset($return['config']['password']);

		# No login
		if ($this->settings['username']===''&&$this->settings['password']==='') $return['config']['login'] = false;
		else $return['config']['login'] = true;

		if ($public===false) {

			# Logged in
			$return['loggedIn'] = true;

		} else {

			# Unset unused vars
			unset($return['config']['username']);
			unset($return['config']['thumbQuality']);
			unset($return['config']['sorting']);
			unset($return['config']['dropboxKey']);
			unset($return['config']['login']);

			# Logged out
			$return['loggedIn'] = false;

		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return $return;

	}

	public function login($username, $password) {

		# Check dependencies
		$this->dependencies(isset($this->settings, $username, $password));

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		# Check login with MD5 hash
		if ($username===$this->settings['username']&&$password===$this->settings['password']) {
			$_SESSION['login'] = true;
			return true;
		}

		# Check login with crypted hash
		if ($username===$this->settings['username']&&$this->settings['password']===crypt($password, $this->settings['password'])) {
			$_SESSION['login'] = true;
			return true;
		}

		# No login
		if ($this->settings['username']===''&&$this->settings['password']==='') {
			$_SESSION['login'] = true;
			return true;
		}

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return false;

	}

	public function logout() {

		# Call plugins
		$this->plugins(__METHOD__, 0, func_get_args());

		session_destroy();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

}

?>