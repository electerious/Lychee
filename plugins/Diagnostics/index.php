<?php

/**
 * @author      Tobias Reich
 * @copyright   2015 by Tobias Reich
 * @description This file takes a look at your Lychee-configuration and displays all errors it can find.
 */

namespace Diagnostics;

use Mysqli;
use Imagick;
use Lychee\Modules\Settings;

$lychee = __DIR__ . '/../../';

require($lychee . 'php/define.php');
require($lychee . 'php/autoload.php');

require($lychee . 'php/helpers/hasPermissions.php');

// Start the session
session_start();

// Set content
header('content-type: text/plain');

// Declare
$error = '';

// Show separator
echo('Diagnostics' . PHP_EOL);
echo('-----------' . PHP_EOL);

// PHP Version
if (floatval(phpversion())<5.5)    $error .= ('Error: Upgrade to PHP 5.5 or higher' . PHP_EOL);

// Extensions
if (!extension_loaded('session'))  $error .= ('Error: PHP session extension not activated' . PHP_EOL);
if (!extension_loaded('exif'))     $error .= ('Error: PHP exif extension not activated' . PHP_EOL);
if (!extension_loaded('mbstring')) $error .= ('Error: PHP mbstring extension not activated' . PHP_EOL);
if (!extension_loaded('gd'))       $error .= ('Error: PHP gd extension not activated' . PHP_EOL);
if (!extension_loaded('mysqli'))   $error .= ('Error: PHP mysqli extension not activated' . PHP_EOL);
if (!extension_loaded('json'))     $error .= ('Error: PHP json extension not activated' . PHP_EOL);
if (!extension_loaded('zip'))      $error .= ('Error: PHP zip extension not activated' . PHP_EOL);

// Permissions
if (hasPermissions(LYCHEE_UPLOADS_BIG)===false)    $error .= ('Error: \'uploads/big\' is missing or has insufficient read/write privileges' . PHP_EOL);
if (hasPermissions(LYCHEE_UPLOADS_MEDIUM)===false) $error .= ('Error: \'uploads/medium\' is missing or has insufficient read/write privileges' . PHP_EOL);
if (hasPermissions(LYCHEE_UPLOADS_THUMB)===false)  $error .= ('Error: \'uploads/thumb\' is missing or has insufficient read/write privileges' . PHP_EOL);
if (hasPermissions(LYCHEE_UPLOADS_IMPORT)===false) $error .= ('Error: \'uploads/import\' is missing or has insufficient read/write privileges' . PHP_EOL);
if (hasPermissions(LYCHEE_UPLOADS)===false)        $error .= ('Error: \'uploads/\' is missing or has insufficient read/write privileges' . PHP_EOL);
if (hasPermissions(LYCHEE_DATA)===false)           $error .= ('Error: \'data/\' is missing or has insufficient read/write privileges' . PHP_EOL);

// About GD
$gdVersion = array('GD Version' => '-');
if (function_exists('gd_info')) {
	$gdVersion = gd_info();
	if (!$gdVersion['JPEG Support'])                                          $error .= ('Error: PHP gd extension without jpeg support' . PHP_EOL);
	if (!$gdVersion['PNG Support'])                                           $error .= ('Error: PHP gd extension without png support' . PHP_EOL);
	if (!$gdVersion['GIF Read Support'] || !$gdVersion['GIF Create Support']) $error .= ('Error: PHP gd extension without full gif support' . PHP_EOL);
}

// Load config
if (!file_exists(LYCHEE_CONFIG_FILE)) exit('Error: Configuration not found. Please install Lychee for additional tests');
require(LYCHEE_CONFIG_FILE);

// Database
$database = new Mysqli($dbHost, $dbUser, $dbPassword, $dbName);
if (mysqli_connect_errno()!=0) $error .= ('Error: ' . mysqli_connect_errno() . ': ' . mysqli_connect_error() . '' . PHP_EOL);

// Config
if (!isset($dbName)||$dbName==='') $error .= ('Error: No property for $dbName in config.php' . PHP_EOL);
if (!isset($dbUser)||$dbUser==='') $error .= ('Error: No property for $dbUser in config.php' . PHP_EOL);
if (!isset($dbPassword))           $error .= ('Error: No property for $dbPassword in config.php' . PHP_EOL);
if (!isset($dbHost)||$dbHost==='') $error .= ('Error: No property for $dbHost in config.php' . PHP_EOL);

// Load settings
$settings = Settings::get();

// Settings
if (!isset($settings['username'])||$settings['username']=='')             $error .= ('Error: Username empty or not set in database' . PHP_EOL);
if (!isset($settings['password'])||$settings['password']=='')             $error .= ('Error: Password empty or not set in database' . PHP_EOL);
if (!isset($settings['sortingPhotos'])||$settings['sortingPhotos']=='')   $error .= ('Error: Wrong property for sortingPhotos in database' . PHP_EOL);
if (!isset($settings['sortingAlbums'])||$settings['sortingAlbums']=='')   $error .= ('Error: Wrong property for sortingAlbums in database' . PHP_EOL);
if (!isset($settings['plugins']))                                         $error .= ('Error: No property for plugins in database' . PHP_EOL);
if (!isset($settings['imagick'])||$settings['imagick']=='')               $error .= ('Error: No or wrong property for imagick in database' . PHP_EOL);
if (!isset($settings['identifier'])||$settings['identifier']=='')         $error .= ('Error: No or wrong property for identifier in database' . PHP_EOL);
if (!isset($settings['skipDuplicates'])||$settings['skipDuplicates']=='') $error .= ('Error: No or wrong property for skipDuplicates in database' . PHP_EOL);
if (!isset($settings['checkForUpdates'])||($settings['checkForUpdates']!='0'&&$settings['checkForUpdates']!='1')) $error .= ('Error: No or wrong property for checkForUpdates in database' . PHP_EOL);

// Check dropboxKey
if (!$settings['dropboxKey']) echo('Warning: Dropbox import not working. No property for dropboxKey.' . PHP_EOL);

// Check php.ini Settings
if (ini_get('max_execution_time')<200&&ini_set('upload_max_filesize', '20M')===false) echo('Warning: You may experience problems when uploading a large amount of photos. Take a look in the FAQ for details.' . PHP_EOL);
if (empty(ini_get('allow_url_fopen'))) echo('Warning: You may experience problems with the Dropbox- and URL-Import. Edit your php.ini and set allow_url_fopen to 1.' . PHP_EOL);

// Check mysql version
if ($database->server_version<50500) echo('Warning: Lychee uses the GBK charset to avoid sql injections on your MySQL version. Please update to MySQL 5.5 or higher to enable UTF-8 support.' . PHP_EOL);

// Output
if ($error==='') echo('No critical problems found. Lychee should work without problems!' . PHP_EOL);
else             echo $error;

// Show separator
echo(PHP_EOL . PHP_EOL . 'System Information' . PHP_EOL);
echo('------------------' . PHP_EOL);

// Ensure that user is logged in
if ((isset($_SESSION['login'])&&$_SESSION['login']===true)&&
	(isset($_SESSION['identifier'])&&$_SESSION['identifier']===$settings['identifier'])) {

	// Load json
	$json = file_get_contents(LYCHEE_SRC . 'package.json');
	$json = json_decode($json, true);

	// About imagick
	$imagick = extension_loaded('imagick');
	if ($imagick===true) $imagickVersion = @Imagick::getVersion();
	else                 $imagick = '-';
	if (!isset($imagickVersion, $imagickVersion['versionNumber'])||$imagickVersion==='') $imagickVersion = '-';
	else                                                                                 $imagickVersion = $imagickVersion['versionNumber'];

	// Output system information
	echo('Lychee Version:  ' . $json['version'] . PHP_EOL);
	echo('DB Version:      ' . $settings['version'] . PHP_EOL);
	echo('System:          ' . PHP_OS . PHP_EOL);
	echo('PHP Version:     ' . floatval(phpversion()) . PHP_EOL);
	echo('MySQL Version:   ' . $database->server_version . PHP_EOL);
	echo('Imagick:         ' . $imagick . PHP_EOL);
	echo('Imagick Active:  ' . $settings['imagick'] . PHP_EOL);
	echo('Imagick Version: ' . $imagickVersion . PHP_EOL);
	echo('GD Version:      ' . $gdVersion['GD Version'] . PHP_EOL);
	echo('Plugins:         ' . implode($settings['plugins'], ', ') . PHP_EOL);

} else {

	// Don't go further if the user is not logged in
	exit('You have to be logged in to see more information.');

}

?>