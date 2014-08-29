<?php

###
# @name			Update to version 2.1
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

$query = Database::prepare($database, "SELECT `tags` FROM `?` LIMIT 1", [LYCHEE_TABLE_PHOTOS]);
if(!$database->query($query)) {
	$query = Database::prepare($database, "ALTER TABLE `?` ADD `tags` VARCHAR( 1000 ) NULL DEFAULT ''", [LYCHEE_TABLE_PHOTOS]);
	$result = $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020100', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

$query	= Database::prepare($database, "SELECT `key` FROM `?` WHERE `key` = 'dropboxKey' LIMIT 1", [LYCHEE_TABLE_SETTINGS]);
$result	= $database->query($query);
if ($result->num_rows===0) {
	$query	= Database::prepare($database, "INSERT INTO `?` (`key`, `value`) VALUES ('dropboxKey', '')", [LYCHEE_TABLE_SETTINGS]);
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020100', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

$query	= Database::prepare($database, "SELECT `key` FROM `?` WHERE `key` = 'version' LIMIT 1", [LYCHEE_TABLE_SETTINGS]);
$result	= $database->query($query);
if ($result->num_rows===0) {
	$query	= Database::prepare($database, "INSERT INTO `?` (`key`, `value`) VALUES ('version', '020100')", [LYCHEE_TABLE_SETTINGS]);
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020100', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
} else {
	$query	= Database::prepare($database, "UPDATE ? SET value = '020100' WHERE `key` = 'version'", [LYCHEE_TABLE_SETTINGS]);
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020100', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

?>