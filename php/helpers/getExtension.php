<?php

/**
 * Returns the extension of the filename (path or URI) or an empty string.
 * @return string Extension of the filename starting with a dot.
 */
function getExtension($filename, $isURI = false) {

	// If $filename is an URI, get only the path component
	if ($isURI===true) $filename = parse_url($filename, PHP_URL_PATH);

	$extension = pathinfo($filename, PATHINFO_EXTENSION);

	// Special cases
	// https://github.com/electerious/Lychee/issues/482
	list($extension) = explode(':', $extension, 2);

	if (empty($extension)===false) $extension = '.' . $extension;

	return $extension;

}

?>