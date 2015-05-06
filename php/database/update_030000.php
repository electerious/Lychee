<?php

###
# @name			Update to version 3.0.0
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

# Remove login
# Login now saved as crypt without md5. Legacy code has been removed.
$query			= Database::prepare($database, "UPDATE `?` SET `value` = '' WHERE `key` = 'username' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$resetUsername	= $database->query($query);
if (!$resetUsername) {
	Log::error($database, 'update_030000', __LINE__, 'Could not reset username (' . $database->error . ')');
	return false;
}
$query			= Database::prepare($database, "UPDATE `?` SET `value` = '' WHERE `key` = 'password' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$resetPassword	= $database->query($query);
if (!$resetPassword) {
	Log::error($database, 'update_030000', __LINE__, 'Could not reset password (' . $database->error . ')');
	return false;
}

# Make public albums private and reset password
# Password now saved as crypt without md5. Legacy code has been removed.
$query			= Database::prepare($database, "UPDATE `?` SET `public` = 0, `password` = NULL", array(LYCHEE_TABLE_ALBUMS));
$resetPublic	= $database->query($query);
if (!$resetPublic) {
	Log::error($database, 'update_030000', __LINE__, 'Could not reset public albums (' . $database->error . ')');
	return false;
}

# Set version
if (Database::setVersion($database, '030000')===false) return false;

?>