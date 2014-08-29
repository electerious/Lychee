<?php

###
# @name			Update to version 2.1.1
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

$query	= Database::prepare($database, "ALTER TABLE `?` CHANGE `value` `value` VARCHAR( 200 ) NULL DEFAULT ''", [LYCHEE_TABLE_SETTINGS]);
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020101', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

$query	= Database::prepare($database, "UPDATE ? SET value = '020101' WHERE `key` = 'version'", [LYCHEE_TABLE_SETTINGS]);
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020101', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

?>