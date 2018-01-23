<?php

/**
 * Update to version [jnsnkrllive]
 */

use Lychee\Modules\Database;
use Lychee\Modules\Response;

// Add 'fullscreen' column to album table
$query1  = Database::prepare($connection, "ALTER TABLE `?` ADD `fullscreen` tinyint(1) NOT NULL DEFAULT '0'", array(LYCHEE_TABLE_ALBUMS));
$result1 = Database::execute($connection, $query1, 'update_jnsnkrllive', __LINE__);
if ($result1===false) Response::error('Could not add fullscreen column to album table!');

// Add 'shareable' column to album table
$query2  = Database::prepare($connection, "ALTER TABLE `?` ADD `shareable` tinyint(1) NOT NULL DEFAULT '0'", array(LYCHEE_TABLE_ALBUMS));
$result2 = Database::execute($connection, $query2, 'update_jnsnkrllive', __LINE__);
if ($result2===false) Response::error('Could not add shareable column to album table!');

// Set version
if (Database::setVersion($connection, 'jnsnkrllive')===false) Response::error('Could not update version of database!');

?>
