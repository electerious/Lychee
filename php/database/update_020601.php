<?php

###
# @name			Update to version 2.6.1
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

# Add `downloadable`
if (!$database->query("SELECT `downloadable` FROM `lychee_albums` LIMIT 1;")) {
	$result = $database->query("ALTER TABLE `lychee_albums` ADD `downloadable` TINYINT(1) NOT NULL DEFAULT 0");
	if (!$result) {
		Log::error($database, 'update_020601', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Set version
$result = $database->query("UPDATE lychee_settings SET value = '020601' WHERE `key` = 'version';");
if (!$result) {
	Log::error($database, 'update_020601', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

?>