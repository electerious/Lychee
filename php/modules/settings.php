<?php

/**
 * @name		Settings Module
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function getSettings() {

	global $database;

	$result = $database->query('SELECT * FROM lychee_settings;');

	while($row = $result->fetch_object()) {
		$return[$row->key] = $row->value;
	}

	return $return;

}

function setLogin($oldPassword = '', $username, $password) {

	global $settings;

	if ($oldPassword==$settings['password']) {

		if (!setUsername($username)) exit('Error: Updating username failed!');
		if (!setPassword($password)) exit('Error: Updating password failed!');

		return true;

	}

	exit('Error: Current password entered incorrectly!');

}

function setUsername($username) {

	global $database;

	$username = htmlentities($username);
	if (strlen($username)>50) return false;

	$result = $database->query("UPDATE lychee_settings SET value = '$username' WHERE `key` = 'username';");

	if (!$result) return false;
	return true;

}

function setPassword($password) {

	global $database;

	if (strlen($password)<1||strlen($password)>50) return false;

	$result = $database->query("UPDATE lychee_settings SET value = '$password' WHERE `key` = 'password';");

	if (!$result) return false;
	return true;

}

function setDropboxKey($key) {

	global $database;

	if (strlen($key)<1||strlen($key)>50) return false;

	$result = $database->query("UPDATE lychee_settings SET value = '$key' WHERE `key` = 'dropboxKey';");

	if (!$result) return false;
	return true;

}

function setSorting($type, $order) {

	global $database;

	$sorting = 'ORDER BY ';

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

		case 'take':		$sorting .= 'UNIX_TIMESTAMP(STR_TO_DATE(CONCAT(takedate,"-",taketime),"%d.%m.%Y-%H:%i:%S"))';
							break;

		default:			exit('Error: Unknown type for sorting!');

	}

	$sorting .= ' ';

	switch ($order) {

		case 'ASC':		$sorting .= 'ASC';
						break;

		case 'DESC':	$sorting .= 'DESC';
						break;

		default:		exit('Error: Unknown order for sorting!');

	}

	$result = $database->query("UPDATE lychee_settings SET value = '$sorting' WHERE `key` = 'sorting';");

	if (!$result) return false;
	return true;

}

?>