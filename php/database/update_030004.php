<?php

###
# @name			Update to version 3.04
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

# Add medium to photos
$query = Database::prepare($database, "SELECT `parent` FROM `?` LIMIT 1", array(LYCHEE_TABLE_ALBUMS));
if (!$database->query($query)) {
	$query	= Database::prepare($database, "ALTER TABLE `?` ADD `parent` INT(11) NOT NULL DEFAULT 0", array(LYCHEE_TABLE_ALBUMS));
	$result	= $database->query($query);
	if (!$result) {
		Log::error($database, 'update_020700', __LINE__, 'Could not update database (' . $database->error . ')');
		return false;
	}
}
# Set version
if (Database::setVersion($database, '030004')===false) return false;

?>
