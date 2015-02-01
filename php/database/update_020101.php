<?php

###
# @name			Update to version 2.1.1
# @copyright	2015 by Tobias Reich
###

$query	= Database::prepare($database, "ALTER TABLE `?` CHANGE `value` `value` VARCHAR( 200 ) NULL DEFAULT ''", array(LYCHEE_TABLE_SETTINGS));
$result	= $database->query($query);
if (!$result) {
	Log::error($database, 'update_020101', __LINE__, 'Could not update database (' . $database->error . ')');
	return false;
}

# Set version
if (Database::setVersion($database, '020101')===false) return false;

?>