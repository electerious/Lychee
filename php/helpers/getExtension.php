<?php

function getExtension($filename) {

	$extension = strpos($filename, '.') !== false
		? strrchr($filename, '.')
		: '';

	return $extension;

}

?>