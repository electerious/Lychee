<?php

/**
 * Update to version 3.1.0
 */

use Lychee\Modules\Database;
use Lychee\Modules\Response;

// Change length of album id field
$query  = Database::prepare($connection, "ALTER TABLE `?` CHANGE `id` `id` BIGINT(14) NOT NULL", array(LYCHEE_TABLE_ALBUMS));
$result = Database::execute($connection, $query, 'update_030100', __LINE__);

if ($result===false) Response::error('Could not adjust the length of the album id field!');

// Set version
if (Database::setVersion($connection, '030100')===false) Response::error('Could not update version of database!');

?>