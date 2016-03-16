<?php

namespace Lychee\Modules;

final class Response {

	public static function warning($msg) {

		exit('Warning: ' . $msg);

	}

	public static function error($msg) {

		exit('Error: ' . $msg);

	}

	// JSON_NUMERIC_CHECK ensure the albums/photos ids will be converted from strings to integers
	public static function json($str, $options = JSON_NUMERIC_CHECK) { 
		exit(json_encode($str, $options));
	}

}