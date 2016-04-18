<?php

/**
 * Returns the normalized coordinate from EXIF array.
 * @return string Normalized coordinate as float number (degrees).
 */
function getGPSCoordinate($coordinate, $ref) {

	$degrees = count($coordinate) > 0 ? formattedToFloatGPS($coordinate[0]) : 0;
	$minutes = count($coordinate) > 1 ? formattedToFloatGPS($coordinate[1]) : 0;
	$seconds = count($coordinate) > 2 ? formattedToFloatGPS($coordinate[2]) : 0;

	$flip = ($ref == 'W' || $ref == 'S') ? -1 : 1;

	return $flip * ($degrees + (float)$minutes / 60 + (float)$seconds / 3600);

}

function formattedToFloatGPS($coordinate) {

	$parts = explode('/', $coordinate, 2);

	if (count($parts) <= 0) return 0;
	if (count($parts) == 1) return $parts[0];

	return (float)$parts[0] / $parts[1];

}

?>