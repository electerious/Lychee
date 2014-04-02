<?php

/**
 * @name		Plugins Module
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

class Plugins implements \SplSubject {

	private $files		= array();
	private $observers	= array();

	public $action	= null;
	public $args	= null;

	public function __construct($files) {

		if (!isset($files)) return false;

		$plugins = $this;
		$this->files = $files;

		foreach ($this->files as $file) {
			if ($file==='') continue;
			include('../plugins/' . $file);
		}

		return true;

	}

	public function attach(\SplObserver $observer) {

		if (!isset($observer)) return false;

		$this->observers[] = $observer;

		return true;

	}

	public function detach(\SplObserver $observer) {

		if (!isset($observer)) return false;

		$key = array_search($observer, $this->observers, true);
		if ($key) unset($this->observers[$key]);

		return true;

	}

	public function notify() {

		foreach ($this->observers as $value) $value->update($this);

		return true;

	}

	public function activate($action, $args) {

		if (!isset($action, $args)) return false;

		$this->action	= $action;
		$this->args		= $args;

		$this->notify();

		return true;

	}

}

?>