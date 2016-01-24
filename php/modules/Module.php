<?php

###
# @name			Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

abstract class Module {

	protected function plugins($name, $location, $args) {

		self::dependencies(isset($name, $location, $args));

		# Parse
		$location = ($location===0 ? 'before' : 'after');

		# Call plugins
		Plugins::get()->activate($name . ":" . $location, $args);

		return true;

	}

	final public static function dependencies($available = false) {

		if ($available===false) exit('Error: Can not execute function. Missing parameters or variables.');

	}

}

?>