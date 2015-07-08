<?php

###
# @name			Session Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Session extends Module {

	private $settings = null;

	public function __construct($database, $dbname, $plugins, $settings) {

		# Init vars
		$this->plugins	= $plugins;
		$this->settings	= $settings;
		$this->database = $database;
		$this->dbname	= $dbname;

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

		# Clear expired sessions
		$query = Database::prepare($this->database, "DELETE FROM ? WHERE expires < UNIX_TIMESTAMP(NOW())", array(LYCHEE_TABLE_SESSIONS));
		$this->database->query($query);

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

		# Check login with crypted hash
		if(isset( $_COOKIE['SESSION']) && $this->sessionExists($_COOKIE['SESSION']) ){
			$_SESSION['login']		= true;
			$_SESSION['identifier']	= $this->settings['identifier'];
			$public = false;
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

		if ($this->settings['username']===$username&&
			$this->settings['password']===$password) {
				$_SESSION['login']		= true;
				$_SESSION['identifier']	= $this->settings['identifier'];

				$expire = time() + 60 * $this->settings['sessionLength'];
				$hash = hash("sha1", $expire.$this->settings['identifier'].$this->settings['username'].$this->settings['password']);
				$query = Database::prepare($this->database, "INSERT INTO ? (value, expires) VALUES ('?', ?)", array(LYCHEE_TABLE_SESSIONS, $hash, $expire));
				$result = $this->database->query($query);

				setcookie("SESSION", $hash, $expire, "/","", false, true);

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
		if($this->settings['username']==='' && $this->settings['password']==='') {
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

		# Delete the session from the database
		if(isset($_COOKIE['SESSION'])){
		  $query = Database::prepare($this->database, "DELETE FROM ? WHERE value = '?'", array(LYCHEE_TABLE_SESSIONS, $_COOKIE['SESSION']));
		  $this->database->query($query);
		}

		session_destroy();

		# Call plugins
		$this->plugins(__METHOD__, 1, func_get_args());

		return true;

	}

	private function sessionExists($sessionId){
	      $query = Database::prepare($this->database, "SELECT * FROM ? WHERE value = '?'", array(LYCHEE_TABLE_SESSIONS, $sessionId));
	      $result = $this->database->query($query);
	      return $result->num_rows === 1;
	}

}

?>
