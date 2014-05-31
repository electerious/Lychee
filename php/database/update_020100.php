<?php

###
# @name			Update to version 2.1
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if(!$database->query("SELECT `tags` FROM `lychee_photos` LIMIT 1;")) {
	$result = $database->query("ALTER TABLE `lychee_photos` ADD `tags` VARCHAR( 1000 ) NULL DEFAULT ''");
	if (!$result) {
		Log::error($database, 'update_020100', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

$result = $database->query("SELECT `key` FROM `lychee_settings` WHERE `key` = 'dropboxKey' LIMIT 1;");
if ($result->num_rows===0) {
	$result = $database->query("INSERT INTO `lychee_settings` (`key`, `value`) VALUES ('dropboxKey', '')");
	if (!$result) {
		Log::error($database, 'update_020100', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

$result = $database->query("SELECT `key` FROM `lychee_settings` WHERE `key` = 'version' LIMIT 1;");
if ($result->num_rows===0) {
	$result = $database->query("INSERT INTO `lychee_settings` (`key`, `value`) VALUES ('version', '020100')");
	if (!$result) {
		Log::error($database, 'update_020100', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
} else {
	$result = $database->query("UPDATE lychee_settings SET value = '020100' WHERE `key` = 'version';");
	if (!$result) {
		Log::error($database, 'update_020100', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

?>