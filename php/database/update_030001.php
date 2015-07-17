<?php

###
# @name			Update to version 3.0.1
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

# Change length of photo title
$query	= Database::prepare($database, "ALTER TABLE `?` CHANGE `title` `title` VARCHAR( 100 ) NOT NULL DEFAULT ''", array(LYCHEE_TABLE_PHOTOS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_030001', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Change length of album title
$query	= Database::prepare($database, "ALTER TABLE `?` CHANGE `title` `title` VARCHAR( 100 ) NOT NULL DEFAULT ''", array(LYCHEE_TABLE_ALBUMS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_030001', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Add album sorting to settings
$query	= Database::prepare($database, "SELECT `key` FROM `?` WHERE `key` = 'sortingAlbums' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if ($result->num_rows===0) {
	$query	= Database::prepare($database, "INSERT INTO `?` (`key`, `value`) VALUES ('sortingAlbums', 'ORDER BY id DESC')", array(LYCHEE_TABLE_SETTINGS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_030001', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Rename sorting to sortingPhotos
$query	= Database::prepare($database, "UPDATE ? SET `key` = 'sortingPhotos' WHERE `key` = 'sorting' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_030001', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Add identifier to settings
$query	= Database::prepare($database, "SELECT `key` FROM `?` WHERE `key` = 'identifier' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if ($result->num_rows===0) {
	$identifier	= md5(microtime(true));
	$query		= Database::prepare($database, "INSERT INTO `?` (`key`, `value`) VALUES ('identifier', '?')", array(LYCHEE_TABLE_SETTINGS, $identifier));
	$result		= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_030001', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Set version
if (Database::setVersion($database, '030001')===false) return false;

?>