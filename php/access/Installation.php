<?php

###
# @name			Installation Access
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');
if (!defined('LYCHEE_ACCESS_INSTALLATION')) exit('Error: You are not allowed to access this area!');

class Installation extends Access {

	public function check($fn) {

		switch ($fn) {

			case 'dbCreateConfig':	$this->dbCreateConfig(); break;

			# Error
			default:				exit('Warning: No configuration!');
									return false; break;

		}

		return true;

	}

	private function dbCreateConfig() {

		Module::dependencies(isset($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['dbTablePrefix']));
		echo Database::createConfig($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['dbTablePrefix']);

	}

}

?>