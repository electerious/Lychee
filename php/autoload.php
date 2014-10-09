<?php

###
# @name		Autoload
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function lycheeAutoloaderModules($class_name) {

	$modules = array('Album', 'Database', 'Import', 'Log', 'Module', 'Photo', 'Plugins', 'Session', 'Settings');
	if (!in_array($class_name, $modules)) return false;

	$file = LYCHEE . 'php/modules/' . $class_name . '.php';
	if (file_exists($file)!==false) require $file;

}

function lycheeAutoloaderAccess($class_name) {

	$access = array('Access', 'Admin', 'Guest', 'Installation');
	if (!in_array($class_name, $access)) return false;

	$file = LYCHEE . 'php/access/' . $class_name . '.php';
	if (file_exists($file)!==false) require $file;

}

spl_autoload_register('lycheeAutoloaderModules');
spl_autoload_register('lycheeAutoloaderAccess');

?>