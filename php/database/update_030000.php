<?php

/**
 * Update to version 3.0.0
 */

use Lychee\Modules\Database;

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

// Remove login
// Login now saved as crypt without md5. Legacy code has been removed.
$query  = Database::prepare($connection, "UPDATE `?` SET `value` = '' WHERE `key` = 'username' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = Database::execute($connection, $query, 'update_030000', __LINE__);

if ($result===false) return false;

$query  = Database::prepare($connection, "UPDATE `?` SET `value` = '' WHERE `key` = 'password' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result = Database::execute($connection, $query, 'update_030000', __LINE__);

if ($result===false) return false;

// Make public albums private and reset password
// Password now saved as crypt without md5. Legacy code has been removed.
$query  = Database::prepare($connection, "UPDATE `?` SET `public` = 0, `password` = NULL", array(LYCHEE_TABLE_ALBUMS));
$result = Database::execute($connection, $query, 'update_030000', __LINE__);

if ($result===false) return false;

// Set version
if (Database::setVersion($connection, '030000')===false) return false;

?>