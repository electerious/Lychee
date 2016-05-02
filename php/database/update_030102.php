<?php

/**
 * Update to version 3.1.2
 */

use Lychee\Modules\Database;
use Lychee\Modules\Response;

// Change type of the album id field
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `album` `album` BIGINT UNSIGNED NOT NULL", [LYCHEE_TABLE_PHOTOS]);
$result = Database::execute($connection, $query, 'update_030102', __LINE__);
if ($result===false) Response::error('Could not change type of the album id field!');

// Add index to the album id field
$query  = Database::prepare($connection, "ALTER TABLE `?` ADD INDEX `Index_album` (`album`)", [LYCHEE_TABLE_PHOTOS]);
$result = Database::execute($connection, $query, 'update_030102', __LINE__);
if ($result===false) Response::error('Could not add index to the album id field!');

// Add index to the star field
$query  = Database::prepare($connection, "ALTER TABLE `?` ADD INDEX `Index_star` (`star`)", [LYCHEE_TABLE_PHOTOS]);
$result = Database::execute($connection, $query, 'update_030102', __LINE__);
if ($result===false) Response::error('Could not add index to the star field!');

// Change type of the checksum field
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `checksum` `checksum` CHAR(40) NULL DEFAULT NULL", [LYCHEE_TABLE_PHOTOS]);
$result = Database::execute($connection, $query, 'update_030102', __LINE__);
if ($result===false) Response::error('Could not change type of the checksum field!');

// Change type of the thumbUrl field
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `thumbUrl` `thumbUrl` CHAR(37) NOT NULL", [LYCHEE_TABLE_PHOTOS]);
$result = Database::execute($connection, $query, 'update_030102', __LINE__);
if ($result===false) Response::error('Could not change type of the thumbUrl field!');

// Change type of the id field
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `id` `id` BIGINT(14) UNSIGNED NOT NULL", [LYCHEE_TABLE_PHOTOS]);
$result = Database::execute($connection, $query, 'update_030102', __LINE__);
if ($result===false) Response::error('Could not change type of the id field!');

// Change type of the id field
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `id` `id` BIGINT(14) UNSIGNED NOT NULL", [LYCHEE_TABLE_ALBUMS]);
$result = Database::execute($connection, $query, 'update_030102', __LINE__);
if ($result===false) Response::error('Could not change type of the id field!');

// Set version
//if (Database::setVersion($connection, '030102')===false) Response::error('Could not update version of database!');

?>