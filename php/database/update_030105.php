<?php

/**
 * Update to version 3.1.5
 */

use Lychee\Modules\Database;
use Lychee\Modules\Response;

// Add skipDuplicates to settings
$query  = Database::prepare($connection, "SELECT `key` FROM `?` WHERE `key` = 'fullscreenTiming' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = Database::execute($connection, $query, 'update_030105', __LINE__);

if ($result===false) Response::error('Could not get current fullscreenTiming from database!');

if ($result->num_rows===0) {

	$query  = Database::prepare($connection, "INSERT INTO `?` (`key`, `value`) VALUES ('fullscreenTiming', '3')", array(LYCHEE_TABLE_SETTINGS));
	$result = Database::execute($connection, $query, 'update_030105', __LINE__);

	if ($result===false) Response::error('Could not add fullscreenTiming to database!');

}

// Set version
if (Database::setVersion($connection, '030105')===false) Response::error('Could not update version of database!');

?>