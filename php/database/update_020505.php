<?php

###
# @name			Update to version 2.5.5
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

# Add `checksum`
if (!$database->query("SELECT `checksum` FROM `lychee_photos` LIMIT 1;")) {
	$result = $database->query("ALTER TABLE `lychee_photos` ADD `checksum` VARCHAR(100) DEFAULT NULL");
	if (!$result) {
		Log::error($database, 'update_020505', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Set version
$result = $database->query("UPDATE lychee_settings SET value = '020505' WHERE `key` = 'version';");
if (!$result) {
	Log::error($database, 'update_020505', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

?>