<?php

namespace Lychee\Modules;

final class Response {

	public static function warning($msg) {

		exit(json_encode('Warning: ' . $msg));

	}

	public static function error($msg) {

		exit(json_encode('Error: ' . $msg));

	}

	public static function json($str, $options = 0) {

		exit(json_encode($str, $options));

	}

}