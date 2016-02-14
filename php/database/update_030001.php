<?php

/**
 * Update to version 3.0.1
 */

use Lychee\Modules\Database;
use Lychee\Modules\Response;

// Change length of photo title
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `title` `title` VARCHAR( 100 ) NOT NULL DEFAULT ''", array(LYCHEE_TABLE_PHOTOS));
$result = Database::execute($connection, $query, 'update_030001', __LINE__);

if ($result===false) Response::error('Could not change length of photo title in database!');

// Change length of album title
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `title` `title` VARCHAR( 100 ) NOT NULL DEFAULT ''", array(LYCHEE_TABLE_ALBUMS));
$result = Database::execute($connection, $query, 'update_030001', __LINE__);

if ($result===false) Response::error('Could not change length of album title in database!');

// Add album sorting to settings
$query  = Database::prepare($connection, "SELECT `key` FROM `?` WHERE `key` = 'sortingAlbums' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = Database::execute($connection, $query, 'update_030001', __LINE__);

if ($result===false) Response::error('Could not get current album sorting from database!');

if ($result->num_rows===0) {

	$query  = Database::prepare($connection, "INSERT INTO `?` (`key`, `value`) VALUES ('sortingAlbums', 'ORDER BY id DESC')", array(LYCHEE_TABLE_SETTINGS));
	$result = Database::execute($connection, $query, 'update_030001', __LINE__);

	if ($result===false) Response::error('Could not add album sorting to database!');

}

// Rename sorting to sortingPhotos
$query  = Database::prepare($connection, "UPDATE ? SET `key` = 'sortingPhotos' WHERE `key` = 'sorting' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = Database::execute($connection, $query, 'update_030001', __LINE__);

if ($result===false) Response::error('Could not rename photo sorting row in database!');

// Add identifier to settings
$query  = Database::prepare($connection, "SELECT `key` FROM `?` WHERE `key` = 'identifier' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = Database::execute($connection, $query, 'update_030001', __LINE__);

if ($result===false) Response::error('Could not get current identifier from database!');

if ($result->num_rows===0) {

	$identifier = md5(microtime(true));
	$query      = Database::prepare($connection, "INSERT INTO `?` (`key`, `value`) VALUES ('identifier', '?')", array(LYCHEE_TABLE_SETTINGS, $identifier));
	$result     = Database::execute($connection, $query, 'update_030001', __LINE__);

	if ($result===false) Response::error('Could not add identifier to database!');

}

// Set version
if (Database::setVersion($connection, '030001')===false) Response::error('Could not update version of database!');

?>