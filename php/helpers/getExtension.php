<?php

# Returns the extension of the filename (path or URI) or an empty string
function getExtension($filename, $isURI = false) {

    # If $filename is an URI, get only the path component
    if ($isURI)
        $filename = parse_url($filename, PHP_URL_PATH);

	$extension = pathinfo($filename, PATHINFO_EXTENSION);

    if (!empty($extension))
        $extension = '.' . $extension;

	return $extension;
}

?>