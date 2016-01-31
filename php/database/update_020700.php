<?php

/**
 * Update to version 2.7.0
 */

use Lychee\Modules\Database;

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

// Add medium to photos
$query  = Database::prepare($connection, "SELECT `medium` FROM `?` LIMIT 1", array(LYCHEE_TABLE_PHOTOS));
$result = Database::execute($connection, $query, 'update_020700', __LINE__);

if ($result===false) {

	$query  = Database::prepare($connection, "ALTER TABLE `?` ADD `medium` TINYINT(1) NOT NULL DEFAULT 0", array(LYCHEE_TABLE_PHOTOS));
	$result = Database::execute($connection, $query, 'update_020700', __LINE__);

	if ($result===false) return false;

}

// Create medium folder
if (is_dir(LYCHEE_UPLOADS_MEDIUM)===false) {

	// Only create the folder when it is missing
	if (@mkdir(LYCHEE_UPLOADS_MEDIUM)===false) {
		Log::error($connection, 'update_020700', __LINE__, 'Could not create medium-folder');
	}

}

// Add medium to settings
$query  = Database::prepare($connection, "SELECT `key` FROM `?` WHERE `key` = 'medium' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = Database::execute($connection, $query, 'update_020700', __LINE__);

if ($result->num_rows===0) {

	$query  = Database::prepare($connection, "INSERT INTO `?` (`key`, `value`) VALUES ('medium', '1')", array(LYCHEE_TABLE_SETTINGS));
	$result = Database::execute($connection, $query, 'update_020700', __LINE__);

	if ($result===false) return false;

}

// Set version
if (Database::setVersion($connection, '020700')===false) return false;

?>