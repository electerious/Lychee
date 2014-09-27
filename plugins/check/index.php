<?php

###
# @name			Check Plugin
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
# @description	This file takes a look at your Lychee-configuration and displays all errors it can find.
###

# Location
$lychee = __DIR__ . '/../../';

# Load requirements
require($lychee . 'php/define.php');
require($lychee . 'php/autoload.php');
require($lychee . 'php/modules/misc.php');

# Set content
header('content-type: text/plain');

# Declare
$error = '';

# Load config
if (!file_exists(LYCHEE_CONFIG_FILE)) exit('Error 001: Configuration not found. Please install Lychee first.');
require(LYCHEE_CONFIG_FILE);

# Define the table prefix
if (!isset($dbTablePrefix)) $dbTablePrefix = '';
defineTablePrefix($dbTablePrefix);

# Show separator
echo('Diagnostics' . PHP_EOL);
echo('-----------' . PHP_EOL);

# Database
$database = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);
if (mysqli_connect_errno()!=0) $error .= ('Error 100: ' . mysqli_connect_errno() . ': ' . mysqli_connect_error() . '' . PHP_EOL);

# Load settings
$settings = new Settings($database);
$settings = $settings->get();

# PHP Version
if (floatval(phpversion())<5.2)		$error .= ('Error 200: Please upgrade to PHP 5.2 or higher!' . PHP_EOL);

# Extensions
if (!extension_loaded('exif'))		$error .= ('Error 300: PHP exif extension not activated' . PHP_EOL);
if (!extension_loaded('mbstring'))	$error .= ('Error 301: PHP mbstring extension not activated' . PHP_EOL);
if (!extension_loaded('gd'))		$error .= ('Error 302: PHP gd extension not activated' . PHP_EOL);
if (!extension_loaded('mysqli'))	$error .= ('Error 303: PHP mysqli extension not activated' . PHP_EOL);
if (!extension_loaded('json'))		$error .= ('Error 304: PHP json extension not activated' . PHP_EOL);
if (!extension_loaded('zip'))		$error .= ('Error 305: PHP zip extension not activated' . PHP_EOL);

# Config
if (!isset($dbName)||$dbName==='')	$error .= ('Error 400: No property for $dbName in config.php' . PHP_EOL);
if (!isset($dbUser)||$dbUser==='')	$error .= ('Error 401: No property for $dbUser in config.php' . PHP_EOL);
if (!isset($dbPassword))			$error .= ('Error 402: No property for $dbPassword in config.php' . PHP_EOL);
if (!isset($dbHost)||$dbHost==='')	$error .= ('Error 403: No property for $dbHost in config.php' . PHP_EOL);

# Settings
if (!isset($settings['username'])||$settings['username']=='')			$error .= ('Error 404: Username empty or not set in database' . PHP_EOL);
if (!isset($settings['password'])||$settings['password']=='')			$error .= ('Error 405: Password empty or not set in database' . PHP_EOL);
if (!isset($settings['thumbQuality'])||$settings['thumbQuality']=='')	$error .= ('Error 406: No or wrong property for thumbQuality in database' . PHP_EOL);
if (!isset($settings['sorting'])||$settings['sorting']=='')				$error .= ('Error 407: Wrong property for sorting in database' . PHP_EOL);
if (!isset($settings['plugins']))										$error .= ('Error 408: No property for plugins in database' . PHP_EOL);
if (!isset($settings['imagick'])||$settings['imagick']=='')				$error .= ('Error 409: No or wrong property for imagick in database' . PHP_EOL);
if (!isset($settings['checkForUpdates'])||($settings['checkForUpdates']!='0'&&$settings['checkForUpdates']!='1')) $error .= ('Error 410: No or wrong property for checkForUpdates in database' . PHP_EOL);

# Permissions
if (hasPermissions(LYCHEE_UPLOADS_BIG)===false)			$error .= ('Error 500: Wrong permissions for \'uploads/big\' (777 required)' . PHP_EOL);
if (hasPermissions(LYCHEE_UPLOADS_THUMB)===false)		$error .= ('Error 501: Wrong permissions for \'uploads/thumb\' (777 required)' . PHP_EOL);
if (hasPermissions(LYCHEE_UPLOADS_IMPORT)===false)		$error .= ('Error 502: Wrong permissions for \'uploads/import\' (777 required)' . PHP_EOL);
if (hasPermissions(LYCHEE_UPLOADS)===false)				$error .= ('Error 503: Wrong permissions for \'uploads/\' (777 required)' . PHP_EOL);
if (hasPermissions(LYCHEE_DATA)===false)				$error .= ('Error 504: Wrong permissions for \'data/\' (777 required)' . PHP_EOL);

# Check dropboxKey
if (!$settings['dropboxKey']) echo('Warning: Dropbox import not working. No property for dropboxKey.' . PHP_EOL);

# Check php.ini Settings
if (ini_get('max_execution_time')<200&&ini_set('upload_max_filesize', '20M')===false) echo('Warning: You may experience problems when uploading a large amount of photos. Take a look in the FAQ for details.' . PHP_EOL);

# Check mysql version
if ($database->server_version<50500) echo('Warning: Lychee uses the GBK charset to avoid sql injections on your MySQL version. Please update to MySQL 5.5 or higher to enable UTF-8 support.' . PHP_EOL);

# Output
if ($error=='') echo('No critical problems found. Lychee should work without problems!' . PHP_EOL);
else echo $error;

# Show separator
echo(PHP_EOL . PHP_EOL . 'System Information' . PHP_EOL);
echo('------------------' . PHP_EOL);

# Load json
$json = file_get_contents(LYCHEE_BUILD . 'package.json');
$json = json_decode($json, true);

$imagick = extension_loaded('imagick');
if ($imagick===false) $imagick = '-';

if ($imagick===true) $imagickVersion = @Imagick::getVersion();
if (!isset($imagickVersion, $imagickVersion['versionNumber'])||$imagickVersion==='') $imagickVersion = '-';
else $imagickVersion = $imagickVersion['versionNumber'];

$gdVersion = gd_info();

# Output system information
echo('Lychee Version:  ' . $json['version'] . PHP_EOL);
echo('DB Version:      ' . $settings['version'] . PHP_EOL);
echo('System:          ' . PHP_OS . PHP_EOL);
echo('PHP Version:     ' . floatval(phpversion()) . PHP_EOL);
echo('MySQL Version:   ' . $database->server_version . PHP_EOL);
echo('Imagick:         ' . $imagick . PHP_EOL);
echo('Imagick Active:  ' . $settings['imagick'] . PHP_EOL);
echo('Imagick Version: ' . $imagickVersion . PHP_EOL);
echo('GD Version:      ' . $gdVersion['GD Version'] . PHP_EOL);

?>