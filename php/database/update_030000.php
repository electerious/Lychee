<?php

/**
 * Update to version 3.0.0
 */

namespace Lychee\Database;

use Lychee\Modules\Database;

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

// Remove login
// Login now saved as crypt without md5. Legacy code has been removed.
$query         = Database::prepare($connection, "UPDATE `?` SET `value` = '' WHERE `key` = 'username' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$resetUsername = $connection->query($query);
if (!$resetUsername) {
	Log::error('update_030000', __LINE__, 'Could not reset username (' . $connection->error . ')');
	return false;
}
$query         = Database::prepare($connection, "UPDATE `?` SET `value` = '' WHERE `key` = 'password' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$resetPassword = $connection->query($query);
if (!$resetPassword) {
	Log::error('update_030000', __LINE__, 'Could not reset password (' . $connection->error . ')');
	return false;
}

// Make public albums private and reset password
// Password now saved as crypt without md5. Legacy code has been removed.
$query       = Database::prepare($connection, "UPDATE `?` SET `public` = 0, `password` = NULL", array(LYCHEE_TABLE_ALBUMS));
$resetPublic = $connection->query($query);
if (!$resetPublic) {
	Log::error('update_030000', __LINE__, 'Could not reset public albums (' . $connection->error . ')');
	return false;
}

// Set version
if (Database::setVersion($connection, '030000')===false) return false;

?>