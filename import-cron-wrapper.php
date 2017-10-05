<?php
namespace Lychee\Modules;

if (php_sapi_name() == "cli") { //Only for CLI

	require("/var/www/lychee/php/define.php");
	require("/var/www/lychee/php/Modules/Import.php");
	require("/var/www/lychee/php/Modules/Plugins.php");
	require("/var/www/lychee/php/Modules/Settings.php");
	require("/var/www/lychee/php/Modules/Database.php");
	require("/var/www/lychee/php/Modules/Config.php");
	require("/var/www/lychee/php/Modules/Validator.php");
	require("/var/www/lychee/php/Modules/Photo.php");
	require("/var/www/lychee/php/Modules/Log.php");
	require("/var/www/lychee/php/helpers/hasPermissions.php");
	require("/var/www/lychee/php/helpers/getExtension.php");
	require("/var/www/lychee/php/helpers/generateID.php");

	$import_location='/var/www/lychee/uploads/import/';

	if (isset($argv[1])) {
			$import_location=$argv[1];
	}

	$importer = new Import();
	$importer->server($import_location);
} else {
	// Let's act like we're not there
	http_response_code(404);
}
?>
