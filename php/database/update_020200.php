<?php

###
# @name			Update to version 2.2
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if(!$database->query("SELECT `visible` FROM `lychee_albums` LIMIT 1;")) {
	$result = $database->query("ALTER TABLE `lychee_albums` ADD `visible` TINYINT(1) NOT NULL DEFAULT 1");
	if (!$result) return false;
}

$result = $database->query("UPDATE lychee_settings SET value = '020200' WHERE `key` = 'version';");
if (!$result) return false;

?>