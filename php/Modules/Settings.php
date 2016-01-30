<?php

namespace Lychee\Modules;

final class Settings {

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

	private static function set($key, $value, $row = false) {

		if ($row===false) {

			$query	= Database::prepare(Database::get(), "UPDATE ? SET value = '?' WHERE `key` = '?'", array(LYCHEE_TABLE_SETTINGS, $value, $key));

		} elseif ($row===true) {

			# Do not prepare $value because it has already been escaped or is a true statement
			$query	= Database::prepare(Database::get(), "UPDATE ? SET value = '$value' WHERE `key` = '?'", array(LYCHEE_TABLE_SETTINGS, $key));

		} else {

			return false;

		}

		$result = Database::get()->query($query);

		if (!$result) return false;
		return true;

	}

	public static function setLogin($oldPassword = '', $username, $password) {

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
		Validator::required(isset($username), __METHOD__);

		# Hash username
		$username = getHashedString($username);

		# Execute query
		# Do not prepare $username because it is hashed and save
		# Preparing (escaping) the username would destroy the hash
		if (self::set('username', $username, true)===false) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

	private static function setPassword($password) {

		# Check dependencies
		Validator::required(isset($password), __METHOD__);

		# Hash password
		$password = getHashedString($password);

		# Do not prepare $password because it is hashed and save
		# Preparing (escaping) the password would destroy the hash
		if (self::set('password', $password, true)===false) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

	public static function setDropboxKey($dropboxKey) {

		if (strlen($dropboxKey)<1||strlen($dropboxKey)>50) {
			Log::notice(__METHOD__, __LINE__, 'Dropbox key is either too short or too long');
			return false;
		}

		if (self::set('dropboxKey', $dropboxKey)===false) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

	public static function setSortingPhotos($type, $order) {

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

		# Do not prepare $sorting because it is a true statement
		# Preparing (escaping) the sorting would destroy it
		# $sorting is save and can't contain user-input
		if (self::set('sortingPhotos', $sorting, true)===false) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

	public static function setSortingAlbums($type, $order) {

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

		# Do not prepare $sorting because it is a true statement
		# Preparing (escaping) the sorting would destroy it
		# $sorting is save and can't contain user-input
		if (self::set('sortingAlbums', $sorting, true)===false) {
			Log::error(__METHOD__, __LINE__, Database::get()->error);
			return false;
		}
		return true;

	}

}

?>