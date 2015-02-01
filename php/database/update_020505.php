<?php

###
# @name			Update to version 2.5.5
# @copyright	2015 by Tobias Reich
###

# Add `checksum`
$query = Database::prepare($database, "SELECT `checksum` FROM `?` LIMIT 1", array(LYCHEE_TABLE_PHOTOS));
if (!$database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` ADD `checksum` VARCHAR(100) DEFAULT NULL", array(LYCHEE_TABLE_PHOTOS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020505', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Set version
if (Database::setVersion($database, '020505')===false) return false;

?>