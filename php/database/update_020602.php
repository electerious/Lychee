<?php

###
# @name			Update to version 2.6.2
# @copyright	2015 by Tobias Reich
###

# Add a checksum
$query	= Database::prepare($database, "SELECT `id`, `url` FROM `?` WHERE `checksum` IS NULL", array(LYCHEE_TABLE_PHOTOS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020602', __LINE__, 'Could not find photos without checksum (' . $database->error . ')');
	return false;
}
while ($photo = $result->fetch_object()) {
	$checksum = sha1_file(LYCHEE_UPLOADS_BIG . $photo->url);
	if ($checksum!==false) {
		$query			= Database::prepare($database, "UPDATE `?` SET `checksum` = '?' WHERE `id` = '?'", array(LYCHEE_TABLE_PHOTOS, $checksum, $photo->id));
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

# Add Imagick
$query	= Database::prepare($database, "SELECT `key` FROM `?` WHERE `key` = 'imagick' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if ($result->num_rows===0) {
	$query	= Database::prepare($database, "INSERT INTO `?` (`key`, `value`) VALUES ('imagick', '1')", array(LYCHEE_TABLE_SETTINGS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020602', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Set version
if (Database::setVersion($database, '020602')===false) return false;

?>