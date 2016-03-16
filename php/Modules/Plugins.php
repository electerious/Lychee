<?php

namespace Lychee\Modules;

use SplSubject;
use SplObserver;

final class Plugins implements SplSubject {

	private static $instance = null;

	private $observers = array();

	public $action = null;
	public $args = null;

	public static function get() {

		if (!self::$instance) {

			$files = Settings::get()['plugins'];

			self::$instance = new self($files);

		}

		return self::$instance;

	}

	private function __construct(array $plugins) {

		// Load plugins
		foreach ($plugins as $plugin) {

			if ($plugin==='') continue;

			$this->attach(new $plugin);

		}

		return true;

	}

	public function attach(SplObserver $observer) {

		if (!isset($observer)) return false;

		// Add observer
		$this->observers[] = $observer;

		return true;

	}

	public function detach(SplObserver $observer) {

		if (!isset($observer)) return false;

		// Remove observer
		$key = array_search($observer, $this->observers, true);
		if ($key) unset($this->observers[$key]);

		return true;

	}

	public function notify() {

		// Notify each observer
		foreach ($this->observers as $value) $value->update($this);

		return true;

	}

	public function activate($name, $location, array $args) {

		if (!isset($name, $location, $args)) return false;

		// Parse
		$location = ($location===0 ? 'before' : 'after');
		$action   = $name . ":" . $location;

		// Save vars
		$this->action = $action;
		$this->args   = $args;

		// Notify observers
		$this->notify();

		return true;

	}

}

?>