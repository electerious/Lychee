<?php

###
# @name			Installation Access
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');
if (!defined('LYCHEE_ACCESS_INSTALLATION')) exit('Error: You are not allowed to access this area!');

class Installation extends Access {

	public function check($fn) {

		switch ($fn) {

			case 'Database::createConfig':	$this->dbCreateConfig(); break;

			# Error
			default:						$this->init(); break;

		}

		return true;

	}

	private function dbCreateConfig() {

		Module::dependencies(isset($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['dbTablePrefix']));
		echo Database::createConfig($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['dbTablePrefix']);

	}

	private function init() {

		$return = array(
			'status' => LYCHEE_STATUS_NOCONFIG
		);

		echo json_encode($return);

	}

}

?>