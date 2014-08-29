<?php

###
# @name			Update to version 2.5.5
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

# Add `checksum`
$query = Database::prepare($database, "SELECT `checksum` FROM `?` LIMIT 1", [LYCHEE_TABLE_PHOTOS]);
if (!$database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` ADD `checksum` VARCHAR(100) DEFAULT NULL", [LYCHEE_TABLE_PHOTOS]);
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020505', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Set version
$query	= Database::prepare($database, "UPDATE ? SET value = '020505' WHERE `key` = 'version'", [LYCHEE_TABLE_SETTINGS]);
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020505', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

?>