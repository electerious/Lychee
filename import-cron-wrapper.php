<?php
namespace Lychee\Modules;

if (php_sapi_name() == "cli") { //Only for CLI

	require ( __DIR__ . "/php/define.php");
	require ( LYCHEE . "php/Modules/Album.php");
	require ( LYCHEE . "php/Modules/Import.php");
	require ( LYCHEE . "php/Modules/Plugins.php");
	require ( LYCHEE . "php/Modules/Settings.php");
	require ( LYCHEE . "php/Modules/Database.php");
	require ( LYCHEE . "php/Modules/Config.php");
	require ( LYCHEE . "php/Modules/Validator.php");
	require ( LYCHEE . "php/Modules/Photo.php");
	require ( LYCHEE . "php/Modules/Log.php");
	require ( LYCHEE . "php/helpers/hasPermissions.php");
	require ( LYCHEE . "php/helpers/getExtension.php");
	require ( LYCHEE . "php/helpers/generateID.php");

	$import_location=LYCHEE_UPLOADS_IMPORT;

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
