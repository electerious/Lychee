<?php

namespace Lychee\Modules;

abstract class Module {

	final public static function dependencies($available = false) {

		if ($available===false) exit('Error: Can not execute function. Missing parameters or variables.');

	}

}

?>