<?php

###
# @name			Update to version 2.1.1
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

$result = $database->query("ALTER TABLE `lychee_settings` CHANGE `value` `value` VARCHAR( 200 ) NULL DEFAULT ''");
if (!$result) return false;

$result = $database->query("UPDATE lychee_settings SET value = '020101' WHERE `key` = 'version';");
if (!$result) return false;

?>