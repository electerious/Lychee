<?php

###
# @name		Autoload
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function lycheeAutoloaderModules($class_name) {

	$file = LYCHEE . 'php/modules/' . $class_name . '.php';
	if (file_exists($file)!==false) require $file;

}

function lycheeAutoloaderAccess($class_name) {

	$file = LYCHEE . 'php/access/' . $class_name . '.php';
	if (file_exists($file)!==false) require $file;

}

spl_autoload_register('lycheeAutoloaderModules');
spl_autoload_register('lycheeAutoloaderAccess');

?>