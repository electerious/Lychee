<?php

function hasPermissions($path) {

	// Check if the given path is readable and writable
	// Both functions are also verifying that the path exists
	if (is_readable($path)===true&&is_writeable($path)===true) return true;

	return false;

}

?>