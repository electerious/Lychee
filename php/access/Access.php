<?php

###
# @name			Access
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Access {

	protected $database	= null;
	protected $plugins	= null;
	protected $settings	= null;

	public function __construct($database, $plugins, $settings) {

		# Init vars
		$this->database	= $database;
		$this->plugins	= $plugins;
		$this->settings	= $settings;

		return true;

	}

}

?>