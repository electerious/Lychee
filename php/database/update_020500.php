<?php

###
# @name			Update to version 2.5
# @copyright	2015 by Tobias Reich
###

# Add `plugins`
$query	= Database::prepare($database, "SELECT `key` FROM `?` WHERE `key` = 'plugins' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if ($result->num_rows===0) {
	$query	= Database::prepare($database, "INSERT INTO `?` (`key`, `value`) VALUES ('plugins', '')", array(LYCHEE_TABLE_SETTINGS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Add `takestamp`
$query = Database::prepare($database, "SELECT `takestamp` FROM `?` LIMIT 1;", array(LYCHEE_TABLE_PHOTOS));
if (!$database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` ADD `takestamp` INT(11) DEFAULT NULL", array(LYCHEE_TABLE_PHOTOS));
	$result = $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Convert to `takestamp`
$query = Database::prepare($database, "SELECT `takedate`, `taketime` FROM `?` LIMIT 1;", array(LYCHEE_TABLE_PHOTOS));
if ($database->query($query)) {
	$query	= Database::prepare($database, "SELECT `id`, `takedate`, `taketime` FROM `?` WHERE `takedate` <> '' AND `taketime` <> ''", array(LYCHEE_TABLE_PHOTOS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
	while ($photo = $result->fetch_object()) {
		$takestamp	= strtotime($photo->takedate . $photo->taketime);
		$query		= Database::prepare($database, "UPDATE `?` SET `takestamp` = '?' WHERE `id` = '?'", array(LYCHEE_TABLE_PHOTOS, $takestamp, $photo->id));
		$database->query($query);
	}
	$query	= Database::prepare($database, "ALTER TABLE `?` DROP COLUMN `takedate`;", array(LYCHEE_TABLE_PHOTOS));
	$result	= $database->query($query);
	$query	= Database::prepare($database, "ALTER TABLE `?` DROP COLUMN `taketime`", array(LYCHEE_TABLE_PHOTOS));
	$result	= $database->query($query);
}

# Remove `import_name`
$query = Database::prepare($database, "SELECT `import_name` FROM `?` LIMIT 1", array(LYCHEE_TABLE_PHOTOS));
if ($database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` DROP COLUMN `import_name`", array(LYCHEE_TABLE_PHOTOS));
	$result	= $database->query($query);
}

# Remove `sysdate` and `systime`
$query = Database::prepare($database, "SELECT `sysdate`, `systime` FROM `?` LIMIT 1", array(LYCHEE_TABLE_PHOTOS));
if ($database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` DROP COLUMN `sysdate`", array(LYCHEE_TABLE_PHOTOS));
	$result	= $database->query($query);
	$query	= Database::prepare($database, "ALTER TABLE `?` DROP COLUMN `systime`", array(LYCHEE_TABLE_PHOTOS));
	$result	= $database->query($query);
}

# Add `sysstamp`
$query = Database::prepare($database, "SELECT `sysstamp` FROM `?` LIMIT 1", array(LYCHEE_TABLE_ALBUMS));
if (!$database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` ADD `sysstamp` INT(11) DEFAULT NULL", array(LYCHEE_TABLE_ALBUMS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Convert to `sysstamp`
$query = Database::prepare($database, "SELECT `sysdate` FROM `?` LIMIT 1", array(LYCHEE_TABLE_ALBUMS));
if ($database->query($query)) {
	$query	= Database::prepare($database, "SELECT `id`, `sysdate` FROM `?`", array(LYCHEE_TABLE_ALBUMS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
	while ($album = $result->fetch_object()) {
		$sysstamp	= strtotime($album->sysdate);
		$query		= Database::prepare($database, "UPDATE `?` SET `sysstamp` = '?' WHERE `id` = '?'", array(LYCHEE_TABLE_ALBUMS, $sysstamp, $album->id));
		$database->query($query);
	}
	$query	= Database::prepare($database, "ALTER TABLE `?` DROP COLUMN `sysdate`", array(LYCHEE_TABLE_ALBUMS));
	$result	= $database->query($query);
}

# Set character of database
$result = $database->query("ALTER DATABASE $dbName CHARACTER SET utf8 COLLATE utf8_general_ci;");
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set character
$query	= Database::prepare($database, "ALTER TABLE `?` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci", array(LYCHEE_TABLE_ALBUMS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set character
$query	= Database::prepare($database, "ALTER TABLE `?` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci", array(LYCHEE_TABLE_PHOTOS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set character
$query	= Database::prepare($database, "ALTER TABLE `?` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set album password length to 100 (for longer hashes)
$query	= Database::prepare($database, "ALTER TABLE `?` CHANGE `password` `password` VARCHAR(100)", array(LYCHEE_TABLE_ALBUMS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set make length to 50
$query	= Database::prepare($database, "ALTER TABLE `?` CHANGE `make` `make` VARCHAR(50)", array(LYCHEE_TABLE_PHOTOS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Reset sorting
$query	= Database::prepare($database, "UPDATE ? SET value = 'ORDER BY takestamp DESC' WHERE `key` = 'sorting' AND `value` LIKE '%UNIX_TIMESTAMP%'", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set version
if (Database::setVersion($database, '020500')===false) return false;

?>