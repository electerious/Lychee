<?php

spl_autoload_register(function($class) {

	$classPath = str_replace('Lychee\\', '', $class);
	$classPath = str_replace('\\', DIRECTORY_SEPARATOR, $classPath);

	$file = LYCHEE . 'php/' . $classPath . '.php';

	if (file_exists($file)===true) require $file;

});

spl_autoload_register(function($class) {

	$classPath = str_replace('\\', DIRECTORY_SEPARATOR, $class);

	$file = LYCHEE . 'plugins/' . $classPath . '.php';

	if (file_exists($file)===true) require $file;

});

?>