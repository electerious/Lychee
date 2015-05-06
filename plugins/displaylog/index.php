<?php

###
# @name			Display Log Plugin
# @author		Tobias Reich
# @copyright	2015 by Tobias Reich
# @description	This file queries the database for log messages and displays them if present.
###

# Location
$lychee = __DIR__ . '/../../';

# Load requirements
require($lychee . 'php/define.php');
require($lychee . 'php/autoload.php');
require($lychee . 'php/modules/misc.php');

# Set content
header('content-type: text/plain');

# Load config
if (!file_exists(LYCHEE_CONFIG_FILE)) exit('Error 001: Configuration not found. Please install Lychee first.');
require(LYCHEE_CONFIG_FILE);

# Define the table prefix
if (!isset($dbTablePrefix)) $dbTablePrefix = '';
defineTablePrefix($dbTablePrefix);

# Declare
$result = '';

# Database
$database = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);

if (mysqli_connect_errno()!=0) {
	echo 'Error 100: ' . mysqli_connect_errno() . ': ' . mysqli_connect_error() . '' . PHP_EOL;
	exit();
}

# Result
$query	= Database::prepare($database, "SELECT FROM_UNIXTIME(time), type, function, line, text FROM ?", array(LYCHEE_TABLE_LOG));
$result	= $database->query($query);

# Output
if ($result->num_rows===0) {

	echo('Everything looks fine, Lychee has not reported any problems!' . PHP_EOL . PHP_EOL);

} else {

	while($row = $result->fetch_row()) {

		# Encode result before printing
		$row = array_map("htmlentities", $row);

		# Format: time TZ - type - function(line) - text
		printf ("%s %s - %s - %s (%s) \t- %s\n", $row[0], date_default_timezone_get(), $row[1], $row[2], $row[3], $row[4]);

	}

}

?>
