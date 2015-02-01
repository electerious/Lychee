<?php

###
# @name			Update to version 2.6.1
# @copyright	2015 by Tobias Reich
###

# Add `downloadable`
$query = Database::prepare($database, "SELECT `downloadable` FROM `?` LIMIT 1", array(LYCHEE_TABLE_ALBUMS));
if (!$database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` ADD `downloadable` TINYINT(1) NOT NULL DEFAULT 1", array(LYCHEE_TABLE_ALBUMS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020601', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Set version
if (Database::setVersion($database, '020601')===false) return false;

?>