<?php

###
# @name			Log Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Log extends Module {

	public static function notice($database, $function, $line, $text = '') {

		return Log::text($database, 'notice', $function, $line, $text);

	}

	public static function warning($database, $function, $line, $text = '') {

		return Log::text($database, 'warning', $function, $line, $text);

	}

	public static function error($database, $function, $line, $text = '') {

		return Log::text($database, 'error', $function, $line, $text);

	}

	public static function text($database, $type, $function, $line, $text = '') {

		# Check dependencies
		Module::dependencies(isset($database, $type, $function, $line, $text));

		# Get time
		$sysstamp = time();

		# Escape
		$type		= mysqli_real_escape_string($type, $function);
		$function	= mysqli_real_escape_string($database, $function);
		$line		= mysqli_real_escape_string($database, $line);
		$text		= mysqli_real_escape_string($database, $text);

		# Save in database
		$query	= "INSERT INTO lychee_log (time, type, function, line, text) VALUES ('$sysstamp', '$type', '$function', '$line', '$text');";
		$result	= $database->query($query);

		if (!$result) return false;
		return true;

	}

}

?>