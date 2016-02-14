<?php

/**
 * Update to version 2.7.0
 */

use Lychee\Modules\Database;
use Lychee\Modules\Response;

// Add medium to photos
$query  = Database::prepare($connection, "SELECT `medium` FROM `?` LIMIT 1", array(LYCHEE_TABLE_PHOTOS));
$result = Database::execute($connection, $query, 'update_020700', __LINE__);

if ($result===false) {

	$query  = Database::prepare($connection, "ALTER TABLE `?` ADD `medium` TINYINT(1) NOT NULL DEFAULT 0", array(LYCHEE_TABLE_PHOTOS));
	$result = Database::execute($connection, $query, 'update_020700', __LINE__);

	if ($result===false) Response::error('Could not add medium-field to database!');

}

// Create medium folder
if (is_dir(LYCHEE_UPLOADS_MEDIUM)===false) {

	// Only create the folder when it is missing
	if (@mkdir(LYCHEE_UPLOADS_MEDIUM)===false) {
		Log::error($connection, 'update_020700', __LINE__, 'Could not create medium-folder');
		Response::error('Could not create medium-folder!');
	}

}

// Set version
if (Database::setVersion($connection, '020700')===false) Response::error('Could not update version of database!');

?>