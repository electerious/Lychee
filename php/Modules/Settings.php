<?php

namespace Lychee\Modules;

final class Settings {

	private static $cache = null;

	/**
	 * @return array Returns the settings of Lychee.
	 */
	public static function get() {

		if (self::$cache) return self::$cache;

		// Execute query
		$query    = Database::prepare(Database::get(), "SELECT * FROM ?", array(LYCHEE_TABLE_SETTINGS));
		$settings = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		// Add each to return
		while ($setting = $settings->fetch_object()) $return[$setting->key] = $setting->value;

		// Convert plugins to array
		$return['plugins'] = explode(';', $return['plugins']);

		self::$cache = $return;

		return $return;

	}

	/**
	 * @return boolean Returns true when successful.
	 */
	private static function set($key, $value, $row = false) {

		if ($row===false) {

			$query = Database::prepare(Database::get(), "UPDATE ? SET value = '?' WHERE `key` = '?'", array(LYCHEE_TABLE_SETTINGS, $value, $key));

		} elseif ($row===true) {

			// Do not prepare $value because it has already been escaped or is a true statement
			$query = Database::prepare(Database::get(), "UPDATE ? SET value = '$value' WHERE `key` = '?'", array(LYCHEE_TABLE_SETTINGS, $key));

		} else {

			return false;

		}

		$result = Database::execute(Database::get(), $query, __METHOD__, __LINE__);

		if ($result===false) return false;
		return true;

	}

	/**
	 * Sets the username and password when current password is correct.
	 * Exits on error.
	 * @return true Returns true when successful.
	 */
	public static function setLogin($oldPassword = '', $username, $password) {

		if ($oldPassword===self::get()['password']||self::get()['password']===crypt($oldPassword, self::get()['password'])) {

			// Save username
			if (self::setUsername($username)===false) Response::error('Updating username failed!');

			// Save password
			if (self::setPassword($password)===false) Response::error('Updating password failed!');

			return true;

		}

		Response::error('Current password entered incorrectly!');

	}

	/**
	 * Sets a new username.
	 * @return boolean Returns true when successful.
	 */
	private static function setUsername($username) {

		// Check dependencies
		Validator::required(isset($username), __METHOD__);

		// Hash username
		$username = getHashedString($username);

		// Execute query
		// Do not prepare $username because it is hashed and save
		// Preparing (escaping) the username would destroy the hash
		if (self::set('username', $username, true)===false) return false;
		return true;

	}

	/**
	 * Sets a new username.
	 * @return boolean Returns true when successful.
	 */
	private static function setPassword($password) {

		// Check dependencies
		Validator::required(isset($password), __METHOD__);

		// Hash password
		$password = getHashedString($password);

		// Do not prepare $password because it is hashed and save
		// Preparing (escaping) the password would destroy the hash
		if (self::set('password', $password, true)===false) return false;
		return true;

	}

	/**
	 * Sets a new dropboxKey.
	 * @return boolean Returns true when successful.
	 */
	public static function setDropboxKey($dropboxKey) {

		if (strlen($dropboxKey)<1||strlen($dropboxKey)>50) {
			Log::notice(Database::get(), __METHOD__, __LINE__, 'Dropbox key is either too short or too long');
			return false;
		}

		if (self::set('dropboxKey', $dropboxKey)===false) return false;
		return true;

	}

	/**
	 * Sets a new sorting for the photos.
	 * @return boolean Returns true when successful.
	 */
	public static function setSortingPhotos($type, $order) {

		$sorting = 'ORDER BY ';

		// Set row
		switch ($type) {

			case 'id':          $sorting .= 'id'; break;
			case 'title':       $sorting .= 'title'; break;
			case 'description': $sorting .= 'description'; break;
			case 'public':      $sorting .= 'public'; break;
			case 'type':        $sorting .= 'type'; break;
			case 'star':        $sorting .= 'star'; break;
			case 'takestamp':   $sorting .= 'takestamp'; break;
			default:            Log::error(Database::get(), __METHOD__, __LINE__, 'Could not update settings. Unknown type for sorting.');
			                    return false;
			                    break;

		}

		$sorting .= ' ';

		// Set order
		switch ($order) {

			case 'ASC':  $sorting .= 'ASC'; break;
			case 'DESC': $sorting .= 'DESC'; break;
			default:     Log::error(Database::get(), __METHOD__, __LINE__, 'Could not update settings. Unknown order for sorting.');
			             return false;
			             break;

		}

		// Do not prepare $sorting because it is a true statement
		// Preparing (escaping) the sorting would destroy it
		// $sorting is save and can't contain user-input
		if (self::set('sortingPhotos', $sorting, true)===false) return false;
		return true;

	}

	/**
	 * Sets a new sorting for the albums.
	 * @return boolean Returns true when successful.
	 */
	public static function setSortingAlbums($type, $order) {

		$sorting = 'ORDER BY ';

		// Set row
		switch ($type) {

			case 'id':          $sorting .= 'id'; break;
			case 'title':       $sorting .= 'title'; break;
			case 'description': $sorting .= 'description'; break;
			case 'public':      $sorting .= 'public'; break;
			default:            Log::error(Database::get(), __METHOD__, __LINE__, 'Could not update settings. Unknown type for sorting.');
			                    return false;
			                    break;

		}

		$sorting .= ' ';

		// Set order
		switch ($order) {

			case 'ASC':  $sorting .= 'ASC'; break;
			case 'DESC': $sorting .= 'DESC'; break;
			default:     Log::error(Database::get(), __METHOD__, __LINE__, 'Could not update settings. Unknown order for sorting.');
			             return false;
			             break;

		}

		// Do not prepare $sorting because it is a true statement
		// Preparing (escaping) the sorting would destroy it
		// $sorting is save and can't contain user-input
		if (self::set('sortingAlbums', $sorting, true)===false) return false;
		return true;

	}

	/**
	 * @return array Returns the Imagick setting.
	 */
	public static function hasImagick() {
		return (bool)(extension_loaded('imagick') && self::get()['imagick'] === '1');
	}

}

?>