<?php

###
# @name			Update to version 2.5
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

# Add `plugins`
$result = $database->query("SELECT `key` FROM `lychee_settings` WHERE `key` = 'plugins' LIMIT 1;");
if ($result->num_rows===0) {
	$result = $database->query("INSERT INTO `lychee_settings` (`key`, `value`) VALUES ('plugins', '')");
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Add `takestamp`
if (!$database->query("SELECT `takestamp` FROM `lychee_photos` LIMIT 1;")) {
	$result = $database->query("ALTER TABLE `lychee_photos` ADD `takestamp` INT(11) DEFAULT NULL");
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Convert to `takestamp`
if ($database->query("SELECT `takedate`, `taketime` FROM `lychee_photos` LIMIT 1;")) {
	$result = $database->query("SELECT `id`, `takedate`, `taketime` FROM `lychee_photos` WHERE `takedate` <> '' AND `taketime` <> '';");
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
	while ($photo = $result->fetch_object()) {
		$takestamp = strtotime($photo->takedate . $photo->taketime);
		$database->query("UPDATE `lychee_photos` SET `takestamp` = '$takestamp' WHERE `id` = '$photo->id';");
	}
	$result = $database->query("ALTER TABLE `lychee_photos` DROP COLUMN `takedate`;");
	$result = $database->query("ALTER TABLE `lychee_photos` DROP COLUMN `taketime`;");
}

# Remove `import_name`
if ($database->query("SELECT `import_name` FROM `lychee_photos` LIMIT 1;")) {
	$result = $database->query("ALTER TABLE `lychee_photos` DROP COLUMN `import_name`;");
}

# Remove `sysdate` and `systime`
if ($database->query("SELECT `sysdate`, `systime` FROM `lychee_photos` LIMIT 1;")) {
	$result = $database->query("ALTER TABLE `lychee_photos` DROP COLUMN `sysdate`;");
	$result = $database->query("ALTER TABLE `lychee_photos` DROP COLUMN `systime`;");
}

# Add `sysstamp`
if (!$database->query("SELECT `sysstamp` FROM `lychee_albums` LIMIT 1;")) {
	$result = $database->query("ALTER TABLE `lychee_albums` ADD `sysstamp` INT(11) DEFAULT NULL");
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Convert to `sysstamp`
if ($database->query("SELECT `sysdate` FROM `lychee_albums` LIMIT 1;")) {
	$result = $database->query("SELECT `id`, `sysdate` FROM `lychee_albums`;");
	if (!$result) {
		Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
	while ($album = $result->fetch_object()) {
		$sysstamp = strtotime($album->sysdate);
		$database->query("UPDATE `lychee_albums` SET `sysstamp` = '$sysstamp' WHERE `id` = '$album->id';");
	}
	$result = $database->query("ALTER TABLE `lychee_albums` DROP COLUMN `sysdate`;");
}

# Set character of database
$result = $database->query("ALTER DATABASE $dbName CHARACTER SET utf8 COLLATE utf8_general_ci;");
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set character
$result = $database->query("ALTER TABLE `lychee_albums` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;");
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set character
$result = $database->query("ALTER TABLE `lychee_photos` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;");
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set character
$result = $database->query("ALTER TABLE `lychee_settings` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;");
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set album password length to 100 (for longer hashes)
$result = $database->query("ALTER TABLE `lychee_albums` CHANGE `password` `password` VARCHAR(100);");
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set make length to 50
$result = $database->query("ALTER TABLE `lychee_photos` CHANGE `make` `make` VARCHAR(50);");
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Reset sorting
$result = $database->query("UPDATE lychee_settings SET value = 'ORDER BY takestamp DESC' WHERE `key` = 'sorting' AND `value` LIKE '%UNIX_TIMESTAMP%';");
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set version
$result = $database->query("UPDATE lychee_settings SET value = '020500' WHERE `key` = 'version';");
if (!$result) {
	Log::error($database, 'update_020500', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

?>