<?php

###
# @name			Update to version 2.2
# @copyright	2015 by Tobias Reich
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

# Set version
if (Database::setVersion($database, '020200')===false) return false;

?>