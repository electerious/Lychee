<?php

namespace Lychee\Modules;

final class Log {

	public static function notice($connection, $function, $line, $text = '') {

		return Log::text($connection, 'notice', $function, $line, $text);

	}

	public static function error($connection, $function, $line, $text = '') {

		return Log::text($connection, 'error', $function, $line, $text);

	}

	private static function text($connection, $type, $function, $line, $text = '') {

		// Check dependencies
		Validator::required(isset($connection, $type, $function, $line, $text), __METHOD__);

		// Get time
		$sysstamp = time();

		// Save in database
		$query  = Database::prepare($connection, "INSERT INTO ? (time, type, function, line, text) VALUES ('?', '?', '?', '?', '?')", array(LYCHEE_TABLE_LOG, $sysstamp, $type, $function, $line, $text));
		$result = Database::execute($connection, $query, null, null);

		if ($result===false) return false;
		return true;

	}

}

?>