<?php

###
# @name			Autoload
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

spl_autoload_register(function($class) {

	$file = LYCHEE . 'php/modules/' . $class . '.php';

	if (file_exists($file)===true) require $file;

});

spl_autoload_register(function($class) {

	$file = LYCHEE . 'php/access/' . $class . '.php';

	if (file_exists($file)===true) require $file;

});

?>