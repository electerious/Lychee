<?php

###
# @name			Update to version 3.0.3
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

# Add skipDuplicates to settings
$query	= Database::prepare($database, "SELECT `key` FROM `?` WHERE `key` = 'skipDuplicates' LIMIT 1", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if ($result->num_rows===0) {
	$query	= Database::prepare($database, "INSERT INTO `?` (`key`, `value`) VALUES ('skipDuplicates', '0')", array(LYCHEE_TABLE_SETTINGS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_030003', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}

# Set version
if (Database::setVersion($database, '030003')===false) return false;

?>