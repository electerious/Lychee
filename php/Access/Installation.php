<?php

namespace Lychee\Access;

use Lychee\Modules\Config;
use Lychee\Modules\Validator;

final class Installation extends Access {

	public static function init($fn) {

		switch ($fn) {

			case 'Config::create': self::configCreateAction(); break;

			// Error
			default:               self::initAction(); break;

		}

		return true;

	}

	private static function configCreateAction() {

		Validator::required(isset($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['dbTablePrefix']), __METHOD__);

		echo Config::create($_POST['dbHost'], $_POST['dbUser'], $_POST['dbPassword'], $_POST['dbName'], $_POST['dbTablePrefix']);

	}

	private static function initAction() {

		$return = array(
			'status' => LYCHEE_STATUS_NOCONFIG
		);

		echo json_encode($return);

	}

}

?>