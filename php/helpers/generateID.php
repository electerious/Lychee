<?php

function generateID() {

	// Generate id based on the current microtime
	$id = str_replace('.', '', microtime(true));

	// Ensure that the id has a length of 14 chars
	while(strlen($id)<14) $id .= 0;

	// Return the integer value of the id
	return intval($id);

}

?>