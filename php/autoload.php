<?php

/**
 * @name		Autoload
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

function __autoload($class_name) {
	require __DIR__ . '/modules/' . $class_name . '.php';
}

?>