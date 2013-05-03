<?php

	define("LYCHEE", true);

	// Declare
	$error = "";

	// Include
	include("config.php");

	// PHP Version
	if (floatval(phpversion())<5.2) $error .= ("Error 100: Please upgrade to PHP 5.2 or higher!<br>\n");

	// Extensions
	if (!extension_loaded("exif")) $error .= ("Error 200: PHP exif extension not activated.<br>\n");
	if (!extension_loaded("mbstring")) $error .= ("Error 201: PHP mbstring extension not activated.<br>\n");
	if (!extension_loaded("gd")) $error .= ("Error 202: PHP gd extension not activated.<br>\n");
	if (!extension_loaded("mysqli")) $error .= ("Error 203: PHP mysqli extension not activated.<br>\n");

	// Config
	if (!$db||$db=="") $error .= ("Error 300: No property for \$db in config.php.<br>\n");
	if (!$dbUser||$dbUser=="") $error .= ("Error 301: No property for \$dbUser in config.php.<br>\n");
	if (!$dbPassword||$dbPassword=="") $error .= ("Error 302: No property for \$dbPassword in config.php.<br>\n");
	if (!$dbHost||$dbHost=="") $error .= ("Error 303: No property for \$dbHost in config.php.<br>\n");
	if (!$user||$user=="") $error .= ("Error 304: No property for \$user in config.php.<br>\n");
	if (!$password||$password=="") $error .= ("Error 305: No property for \$password in config.php.<br>\n");

	// Database
	$database = new mysqli($dbHost, $dbUser, $dbPassword, $db);
	if (mysqli_connect_errno()!=0) $error .= ("Error 400: " . mysqli_connect_errno() . ": " . mysqli_connect_error() . "<br>\n");

	// Permissions
	if (substr(sprintf('%o', fileperms("../uploads/big/")), -4) != "0777") $error .= ("Error 500: Wrong permissions for \"/uploads/big\" (777 required).<br>\n");
	if (substr(sprintf('%o', fileperms("../uploads/thumb/")), -4) != "0777") $error .= ("Error 501: Wrong permissions for \"/uploads/thumb\" (777 required).<br>\n");
	if (substr(sprintf('%o', fileperms("../uploads/import/")), -4) != "0777") $error .= ("Error 502: Wrong permissions for \"/uploads/import\" (777 required).<br>\n");

	if ($error == "") echo("Lychee is ready!"); else echo $error;

?>