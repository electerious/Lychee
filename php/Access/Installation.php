<?php

namespace Lychee\Access;

use Lychee\Modules\Config;
use Lychee\Modules\Module;

final class Installation implements Access {

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