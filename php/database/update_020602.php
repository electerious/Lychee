<?php

###
# @name			Update to version 2.6.2
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

# Add a checksum
$result = $database->query("SELECT `id`, `url` FROM `lychee_photos` WHERE `checksum` IS NULL;");
if (!$result) {
	Log::error($database, 'update_020602', __LINE__, 'Could not find photos without checksum (' . $database->error . ')');
	return false;
}
while ($photo = $result->fetch_object()) {
	$checksum = sha1_file(LYCHEE_UPLOADS_BIG . $photo->url);
	if ($checksum!==false) {
		$setChecksum = $database->query("UPDATE `lychee_photos` SET `checksum` = '$checksum' WHERE `id` = '$photo->id';");
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
$result = $database->query("UPDATE lychee_settings SET value = '020602' WHERE `key` = 'version';");
if (!$result) {
	Log::error($database, 'update_020602', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

?>