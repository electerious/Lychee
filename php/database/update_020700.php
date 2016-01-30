<?php

/**
 * Update to version 2.7.0
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

// Add medium to photos
$query = Database::prepare($connection, "SELECT `medium` FROM `?` LIMIT 1", array(LYCHEE_TABLE_PHOTOS));
if (!$connection->query($query)) {
	$query  = Database::prepare($connection, "ALTER TABLE `?` ADD `medium` TINYINT(1) NOT NULL DEFAULT 0", array(LYCHEE_TABLE_PHOTOS));
	$result = $connection->query($query);
	if (!$result) {
		Log::error('update_020700', __LINE__, 'Could not update database (' . $connection->error . ')');
		return false;
	}
}

// Create medium folder
if (is_dir(LYCHEE_UPLOADS_MEDIUM)===false) {
	// Only create the folder when it is missing
	if (@mkdir(LYCHEE_UPLOADS_MEDIUM)===false) {
		Log::error('update_020700', __LINE__, 'Could not create medium-folder');
	}
}

// Add medium to settings
$query  = Database::prepare($connection, "SELECT `key` FROM `?` WHERE `key` = 'medium' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = $connection->query($query);
if ($result->num_rows===0) {
	$query  = Database::prepare($connection, "INSERT INTO `?` (`key`, `value`) VALUES ('medium', '1')", array(LYCHEE_TABLE_SETTINGS));
	$result = $connection->query($query);
	if (!$result) {
		Log::error('update_020700', __LINE__, 'Could not update database (' . $connection->error . ')');
		return false;
	}
}

// Set version
if (Database::setVersion($connection, '020700')===false) return false;

?>