<?php

/**
 * @name		Installation Access
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');
if (!defined('LYCHEE_ACCESS_INSTALLATION')) exit('Error: You are not allowed to access this area!');

switch ($_POST['function']) {

	case 'dbCreateConfig':	if (isset($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['version']))
								echo dbCreateConfig($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['version']);
							break;

	default:				echo 'Warning: No configuration!';
							break;

}

?>