<?php

namespace Lychee\Modules;

final class Log {

	public static function notice($function, $line, $text = '') {

		return Log::text('notice', $function, $line, $text);

	}

	public static function warning($function, $line, $text = '') {

		return Log::text('warning', $function, $line, $text);

	}

	public static function error($function, $line, $text = '') {

		return Log::text('error', $function, $line, $text);

	}

	private static function text($type, $function, $line, $text = '') {

		// Check dependencies
		Validator::required(isset($type, $function, $line, $text), __METHOD__);

		// Get time
		$sysstamp = time();

		// Save in database
		$query  = Database::prepare(Database::get(), "INSERT INTO ? (time, type, function, line, text) VALUES ('?', '?', '?', '?', '?')", array(LYCHEE_TABLE_LOG, $sysstamp, $type, $function, $line, $text));
		$result = Database::get()->query($query);

		if ($result===false) return false;
		return true;

	}

}

?>