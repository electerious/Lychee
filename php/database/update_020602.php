<?php

###
# @name			Update to version 2.6.2
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

# Add a checksum
$query	= Database::prepare($database, "SELECT `id`, `url` FROM `?` WHERE `checksum` IS NULL", [LYCHEE_TABLE_PHOTOS]);
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020602', __LINE__, 'Could not find photos without checksum (' . $database->error . ')');
	return false;
}
while ($photo = $result->fetch_object()) {
	$checksum = sha1_file(LYCHEE_UPLOADS_BIG . $photo->url);
	if ($checksum!==false) {
		$query			= Database::prepare($database, "UPDATE `?` SET `checksum` = '?' WHERE `id` = '?'", [LYCHEE_TABLE_PHOTOS, $checksum, $photo->id]);
		$setChecksum	= $database->query($query);
		if (!$setChecksum) {
			Log::error($database, 'update_020602', __LINE__, 'Could not update checksum (' . $database->error . ')');
			return false;
		}
	} else {
		Log::error($database, 'update_020602', __LINE__, 'Could not calculate checksum for photo with id ' . $photo->id);
		return false;
	}
}

# Set version
$query	= Database::prepare($database, "UPDATE ? SET value = '020602' WHERE `key` = 'version'", [LYCHEE_TABLE_SETTINGS]);
$result = $database->query($query);
if (!$result) {
	Log::error($database, 'update_020602', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

?>