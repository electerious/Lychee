<?php

###
# @name			Installation Access
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

final class Installation extends Access {

	public function check($fn) {

		switch ($fn) {

			case 'Config::create':	$this->configCreate(); break;

			# Error
			default:				$this->init(); break;

		}

		return true;

	}

	private function configCreate() {

		Module::dependencies(isset($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['dbTablePrefix']));
		echo Config::create($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['dbTablePrefix']);

	}

	private function init() {

		$return = array(
			'status' => LYCHEE_STATUS_NOCONFIG
		);

		echo json_encode($return);

	}

}

?>