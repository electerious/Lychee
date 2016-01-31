<?php

/**
 * Update to version 3.0.3
 */

use Lychee\Modules\Database;

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

// Add skipDuplicates to settings
$query  = Database::prepare($connection, "SELECT `key` FROM `?` WHERE `key` = 'skipDuplicates' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = Database::execute($connection, $query, 'update_030003', __LINE__);

if ($result===false) return false;

if ($result->num_rows===0) {

	$query  = Database::prepare($connection, "INSERT INTO `?` (`key`, `value`) VALUES ('skipDuplicates', '0')", array(LYCHEE_TABLE_SETTINGS));
	$result = Database::execute($connection, $query, 'update_030003', __LINE__);

	if ($result===false) return false;

}

// Set version
if (Database::setVersion($connection, '030003')===false) return false;

?>