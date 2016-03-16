<?php

function generateID() {

	// Generate id based on the current microtime
	$id = str_replace('.', '', microtime(true));

	// Ensure that the id has a length of 14 chars
	while(strlen($id)<14) $id .= 0;

	// Return id as a string (32bit php can't handle 14digit integers)
	return $id;

}

?>