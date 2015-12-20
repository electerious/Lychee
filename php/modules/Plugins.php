<?php

###
# @name			Plugins Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Plugins implements \SplSubject {

	private $files		= array();
	private $observers	= array();

	public $action	= null;
	public $args	= null;

	public function __construct($files, $database, $settings) {

		if (!isset($files)) return false;

		# Init vars
		$this->files	= $files;

		# Load plugins
		foreach ($this->files as $file) {

			if ($file==='') continue;

			$file = LYCHEE_PLUGINS . $file;

			if (file_exists($file)===false) {
				Log::warning($database, __METHOD__, __LINE__, 'Could not include plugin. File does not exist (' . $file . ').');
				continue;
			}

			include($file);

		}

		return true;

	}

	public function attach(\SplObserver $observer) {

		if (!isset($observer)) return false;

		# Add observer
		$this->observers[] = $observer;

		return true;

	}

	public function detach(\SplObserver $observer) {

		if (!isset($observer)) return false;

		# Remove observer
		$key = array_search($observer, $this->observers, true);
		if ($key) unset($this->observers[$key]);

		return true;

	}

	public function notify() {

		# Notify each observer
		foreach ($this->observers as $value) $value->update($this);

		return true;

	}

	public function activate($action, $args) {

		if (!isset($action, $args)) return false;

		# Save vars
		$this->action	= $action;
		$this->args		= $args;

		# Notify observers
		$this->notify();

		return true;

	}

}

?>
