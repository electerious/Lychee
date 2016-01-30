<?php

/**
 * Update to version 3.0.1
 */

use Lychee\Modules\Database;

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

// Change length of photo title
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `title` `title` VARCHAR( 100 ) NOT NULL DEFAULT ''", array(LYCHEE_TABLE_PHOTOS));
$result = $connection->query($query);
if (!$result) {
	Log::error('update_030001', __LINE__, 'Could not update database (' . $connection->error . ')');
	return false;
}

// Change length of album title
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `title` `title` VARCHAR( 100 ) NOT NULL DEFAULT ''", array(LYCHEE_TABLE_ALBUMS));
$result = $connection->query($query);
if (!$result) {
	Log::error('update_030001', __LINE__, 'Could not update database (' . $connection->error . ')');
	return false;
}

// Add album sorting to settings
$query  = Database::prepare($connection, "SELECT `key` FROM `?` WHERE `key` = 'sortingAlbums' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = $connection->query($query);
if ($result->num_rows===0) {
	$query  = Database::prepare($connection, "INSERT INTO `?` (`key`, `value`) VALUES ('sortingAlbums', 'ORDER BY id DESC')", array(LYCHEE_TABLE_SETTINGS));
	$result = $connection->query($query);
	if (!$result) {
		Log::error('update_030001', __LINE__, 'Could not update database (' . $connection->error . ')');
		return false;
	}
}

// Rename sorting to sortingPhotos
$query  = Database::prepare($connection, "UPDATE ? SET `key` = 'sortingPhotos' WHERE `key` = 'sorting' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = $connection->query($query);
if (!$result) {
	Log::error('update_030001', __LINE__, 'Could not update database (' . $connection->error . ')');
	return false;
}

// Add identifier to settings
$query  = Database::prepare($connection, "SELECT `key` FROM `?` WHERE `key` = 'identifier' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = $connection->query($query);
if ($result->num_rows===0) {
	$identifier = md5(microtime(true));
	$query      = Database::prepare($connection, "INSERT INTO `?` (`key`, `value`) VALUES ('identifier', '?')", array(LYCHEE_TABLE_SETTINGS, $identifier));
	$result     = $connection->query($query);
	if (!$result) {
		Log::error('update_030001', __LINE__, 'Could not update database (' . $connection->error . ')');
		return false;
	}
}

// Set version
if (Database::setVersion($connection, '030001')===false) return false;

?>