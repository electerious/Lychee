<?php

###
# @name			Log Module
# @copyright	2015 by Tobias Reich
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

		# Check that text is not an array
		if (count($text)>1) {
			$text = implode("\n", $text);
		}

		# Save in database
		$stmt = $database->prepare("INSERT INTO ".LYCHEE_TABLE_LOG."
				 (type, function, line, text) 
				VALUES (:type, :function, :line, :text)");
		$stmt->bindValue('type', $type, PDO::PARAM_STR);
		$stmt->bindValue('function', $function, PDO::PARAM_STR);
		$stmt->bindValue('line', $line, PDO::PARAM_INT);
		$stmt->bindValue('text', $text, PDO::PARAM_STR);
		$result = $stmt->execute();

		if (!$result) return false;
		return true;

	}

}

?>
