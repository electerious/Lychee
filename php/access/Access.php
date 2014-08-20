<?php

###
# @name			Access
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Access {

	protected $database	= null;
        protected $tablePrefix	= null;
	protected $plugins	= null;
	protected $settings	= null;

	public function __construct($database, $tablePrefix, $plugins, $settings) {

		# Init vars
		$this->database     = $database;
                $this->tablePrefix  = $tablePrefix;
		$this->plugins      = $plugins;
		$this->settings     = $settings;

		return true;

	}

}

?>