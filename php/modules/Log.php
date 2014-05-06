<?php

###
# @name			Log Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Log extends Module {

	public static function error($database, $function, $line, $text = '') {

		# Check dependencies
		Module::dependencies(isset($database, $function, $line, $text));

		# Get time
		$sysstamp = time();

		# Escape
		$function	= mysqli_real_escape_string($database, $function);
		$line		= mysqli_real_escape_string($database, $line);
		$text		= mysqli_real_escape_string($database, $text);

		# Save in database
		$query	= "INSERT INTO lychee_log (time, type, function, line, text) VALUES ('$sysstamp', 'error', '$function', '$line', '$text');";
		$result	= $database->query($query);

		if (!$result) return false;
		return $database->insert_id;

	}

}

?>