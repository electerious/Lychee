<?php

/**
 * Update to version 3.1.3
 */

use Lychee\Modules\Database;
use Lychee\Modules\Response;

// Add parent field to albums
$query = Database::prepare($connection, "SELECT `parent` FROM `?` LIMIT 1", array(LYCHEE_TABLE_ALBUMS));
if (!Database::execute($connection, $query, "update_030103", __LINE__)) {
   $query  = Database::prepare($connection, "ALTER TABLE `?` ADD `parent` BIGINT(14) NOT NULL DEFAULT 0", array(LYCHEE_TABLE_ALBUMS));
   $result = Database::execute($connection, $query, "update_030103", __LINE__);
   if (!$result) {
       Log::error($database, 'update_030103', __LINE__, 'Could not update database (' . $database->error . ')');
       return false;
   }
}

// Set version
if (Database::setVersion($connection, '030103')===false) Response::error('Could not update version of database!');

?>