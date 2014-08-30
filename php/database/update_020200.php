<?php

###
# @name			Update to version 2.2
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

$query = Database::prepare($database, "SELECT `visible` FROM `?` LIMIT 1", array(LYCHEE_TABLE_ALBUMS));
if (!$database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` ADD `visible` TINYINT(1) NOT NULL DEFAULT 1", array(LYCHEE_TABLE_ALBUMS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020200', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

$query	= Database::prepare($database, "UPDATE ? SET value = '020200' WHERE `key` = 'version'", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020200', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

?>