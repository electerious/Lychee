<?php

###
# @name			Autoload
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function lycheeAutoloaderModules($class) {

	$file = LYCHEE . 'php/modules/' . $class . '.php';

	if (file_exists($file)===true) require $file;

}

function lycheeAutoloaderAccess($class) {

	$file = LYCHEE . 'php/access/' . $class . '.php';

	if (file_exists($file)===true) require $file;

}

spl_autoload_register('lycheeAutoloaderModules');
spl_autoload_register('lycheeAutoloaderAccess');

?>