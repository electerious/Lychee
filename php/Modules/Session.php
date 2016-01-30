<?php

namespace Lychee\Modules;

final class Session extends Module {

	public function init($public = true) {

		# Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		# Return settings
		$return['config'] = Settings::get();

		# Path to Lychee for the server-import dialog
		$return['config']['location'] = LYCHEE;

		# Remove username and password from response
		unset($return['config']['username']);
		unset($return['config']['password']);

		# Remove identifier from response
		unset($return['config']['identifier']);

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
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return $return;

	}

	public function login($username, $password) {

		# Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		$username = crypt($username, Settings::get()['username']);
		$password = crypt($password, Settings::get()['password']);

		# Check login with crypted hash
		if (Settings::get()['username']===$username&&
			Settings::get()['password']===$password) {
				$_SESSION['login']		= true;
				$_SESSION['identifier']	= Settings::get()['identifier'];
				return true;
		}

		# No login
		if ($this->noLogin()===true) return true;

		# Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return false;

	}

	private function noLogin() {

		# Check if login credentials exist and login if they don't
		if (Settings::get()['username']===''&&
			Settings::get()['password']==='') {
				$_SESSION['login']		= true;
				$_SESSION['identifier']	= Settings::get()['identifier'];
				return true;
		}

		return false;

	}

	public function logout() {

		# Call plugins
		Plugins::get()->activate(__METHOD__, 0, func_get_args());

		$_SESSION['login']		= null;
		$_SESSION['identifier']	= null;

		session_destroy();

		# Call plugins
		Plugins::get()->activate(__METHOD__, 1, func_get_args());

		return true;

	}

}

?>