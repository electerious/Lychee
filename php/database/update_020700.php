<?php

###
# @name			Update to version 2.6.2
# @copyright	2015 by Tobias Reich
###

# Add medium to photos
$query = Database::prepare($database, "SELECT `medium` FROM `?` LIMIT 1", array(LYCHEE_TABLE_PHOTOS));
if (!$database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` ADD `medium` TINYINT(1) NOT NULL DEFAULT 0", array(LYCHEE_TABLE_PHOTOS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020700', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Create medium folder
if (is_dir(LYCHEE_UPLOADS_MEDIUM)===false) {
	# Only create the folder when it is missing
	if (@mkdir(LYCHEE_UPLOADS_MEDIUM)===false)
		Log::error($database, 'update_020700', __LINE__, 'Could not create medium-folder');
}

# Add medium to settings
$query	= Database::prepare($database, "SELECT `key` FROM `?` WHERE `key` = 'medium' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if ($result->num_rows===0) {
	$query	= Database::prepare($database, "INSERT INTO `?` (`key`, `value`) VALUES ('medium', '1')", array(LYCHEE_TABLE_SETTINGS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020700', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Set version
if (Database::setVersion($database, '020700')===false) return false;

?>