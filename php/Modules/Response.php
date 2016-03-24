<?php

namespace Lychee\Modules;

final class Response {

	public static function warning($msg) {

		exit('Warning: ' . $msg);

	}

	public static function error($msg) {

		exit('Error: ' . $msg);

	}

	public static function json($str, $options = 0) {

		exit(json_encode($str, $options));

	}

}