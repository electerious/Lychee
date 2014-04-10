<?php

###
# @name			Update to version 2.5
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!$database->query("SELECT `takestamp` FROM `lychee_photos` LIMIT 1;")) {
	$result = $database->query("ALTER TABLE `lychee_photos` ADD `takestamp` INT(11) DEFAULT NULL");
	if (!$result) return false;
}

if ($database->query("SELECT `takedate`, `taketime` FROM `lychee_photos` LIMIT 1;")) {
	$result = $database->query("SELECT `id`, `takedate`, `taketime` FROM `lychee_photos` WHERE `takedate` <> '' AND `taketime` <> '';");
	if (!$result) return false;
	while ($photo = $result->fetch_object()) {
		$takestamp = strtotime($photo->takedate . $photo->taketime);
		$database->query("UPDATE lychee_photos SET takestamp = '$takestamp' WHERE `id` = '$photo->id';");
	}
	$result = $database->query("ALTER TABLE `lychee_photos` DROP COLUMN `takedate`;");
	$result = $database->query("ALTER TABLE `lychee_photos` DROP COLUMN `taketime`;");
}

$result = $database->query("UPDATE lychee_settings SET value = '020500' WHERE `key` = 'version';");
if (!$result) return false;

?>