<?php

###
# @name			Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Module {

	protected $plugins = null;

	protected function plugins($name, $location, $args) {

		if (!isset($this->plugins, $name, $location, $args)) return false;

		# Parse
		$location = ($location===0 ? 'before' : 'after');

		# Call plugins
		$this->plugins->activate($name . ":" . $location, $args);

		return true;

	}

	public static function dependencies($available = false) {

		if ($available===false) exit('Error: Can not execute function. Missing parameters or variables.');

	}

}

?>