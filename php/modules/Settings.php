<?php

###
# @name			Settings Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

final class Settings extends Module {

	private static $cache = null;

	public static function get() {

		if (self::$cache) return self::$cache;

		# Execute query
		$query		= Database::prepare(Database::get(), "SELECT * FROM ?", array(LYCHEE_TABLE_SETTINGS));
		$settings	= Database::get()->query($query);

		# Add each to return
		while ($setting = $settings->fetch_object()) $return[$setting->key] = $setting->value;

		# Convert plugins to array
		$return['plugins'] = explode(';', $return['plugins']);

		self::$cache = $return;

		return $return;

	}

	public static function setLogin($oldPassword = '', $username, $password) {

		# Check dependencies
		self::dependencies(isset($oldPassword, $username, $password));

		if ($oldPassword===self::get()['password']||self::get()['password']===crypt($oldPassword, self::get()['password'])) {

			# Save username
			if (self::setUsername($username)!==true) exit('Error: Updating username failed!');

			# Save password
			if (self::setPassword($password)!==true) exit('Error: Updating password failed!');

			return true;

		}

		exit('Error: Current password entered incorrectly!');

	}

	private static function setUsername($username) {

		# Check dependencies
		self::dependencies(isset($username));

		# Hash username
		$username = getHashedString($username);

		# Execute query
		# Do not prepare $username because it is hashed and save
		# Preparing (escaping) the username would destroy the hash
		$query	= Database::prepare(Database::get(), "UPDATE ? SET value = '$username' WHERE `key` = 'username'", array(LYCHEE_TABLE_SETTINGS));
		$result	= Database::get()->query($query);

		if (!$result) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

	private static function setPassword($password) {

		# Check dependencies
		self::dependencies(isset($password));

		# Hash password
		$password = getHashedString($password);

		# Execute query
		# Do not prepare $password because it is hashed and save
		# Preparing (escaping) the password would destroy the hash
		$query	= Database::prepare(Database::get(), "UPDATE ? SET value = '$password' WHERE `key` = 'password'", array(LYCHEE_TABLE_SETTINGS));
		$result	= Database::get()->query($query);

		if (!$result) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

	public static function setDropboxKey($key) {

		# Check dependencies
		self::dependencies(isset($key));

		if (strlen($key)<1||strlen($key)>50) {
			Log::notice(__METHOD__, __LINE__, 'Dropbox key is either too short or too long');
			return false;
		}

		# Execute query
		$query	= Database::prepare(Database::get(), "UPDATE ? SET value = '?' WHERE `key` = 'dropboxKey'", array(LYCHEE_TABLE_SETTINGS, $key));
		$result = Database::get()->query($query);

		if (!$result) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

	public static function setSortingPhotos($type, $order) {

		# Check dependencies
		self::dependencies(isset($type, $order));

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
		# Do not prepare $sorting because it is a true statement
		# Preparing (escaping) the sorting would destroy it
		# $sorting is save and can't contain user-input
		$query	= Database::prepare(Database::get(), "UPDATE ? SET value = '$sorting' WHERE `key` = 'sortingPhotos'", array(LYCHEE_TABLE_SETTINGS));
		$result	= Database::get()->query($query);

		if (!$result) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

	public static function setSortingAlbums($type, $order) {

		# Check dependencies
		self::dependencies(isset($type, $order));

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
		# $sorting is save and can't contain user-input
		$query	= Database::prepare(Database::get(), "UPDATE ? SET value = '$sorting' WHERE `key` = 'sortingAlbums'", array(LYCHEE_TABLE_SETTINGS));
		$result	= Database::get()->query($query);

		if (!$result) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

}

?>