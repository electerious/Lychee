<?php

###
# @name			Log Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Log extends Module {

	public static function notice($database, $tablePrefix, $function, $line, $text = '') {

		return Log::text($database, $tablePrefix, 'notice', $function, $line, $text);

	}

	public static function warning($database, $tablePrefix, $function, $line, $text = '') {

		return Log::text($database, $tablePrefix, 'warning', $function, $line, $text);

	}

	public static function error($database, $tablePrefix, $function, $line, $text = '') {

		return Log::text($database, $tablePrefix, 'error', $function, $line, $text);

	}

	public static function text($database, $tablePrefix, $type, $function, $line, $text = '') {

		# Check dependencies
		Module::dependencies(isset($database, $tablePrefix, $type, $function, $line, $text));

		# Get time
		$sysstamp = time();

		# Escape
		$type		= mysqli_real_escape_string($database, $type);
		$function	= mysqli_real_escape_string($database, $function);
		$line		= mysqli_real_escape_string($database, $line);
		$text		= mysqli_real_escape_string($database, $text);

		# Save in database
		$query	= Database::prepareQuery("INSERT INTO lychee_log (time, type, function, line, text) VALUES ('$sysstamp', '$type', '$function', '$line', '$text');", $tablePrefix);
		$result	= $database->query($query);

		if (!$result) return false;
		return true;

	}

}

?>