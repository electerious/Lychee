<?php

###
# @name		Database Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Database extends Module {

	static function connect($host = 'localhost', $user, $password, $name = 'lychee') {

		if (!isset($host, $user, $password, $name)) return false;

		$database = new mysqli($host, $user, $password);

		# Check connection
		if ($database->connect_errno) exit('Error: ' . $database->connect_error);

		# Avoid sql injection on older MySQL versions by using GBK
		if ($database->server_version<50500) $database->set_charset('GBK');
		else $database->set_charset("utf8");

		# Check database
		if (!$database->select_db($name))
			if (!Database::createDatabase($database, $name)) exit('Error: Could not create database!');

		# Check tables
		if (!$database->query('SELECT * FROM lychee_photos, lychee_albums, lychee_settings LIMIT 0;'))
			if (!Database::createTables($database)) exit('Error: Could not create tables!');

		return $database;

	}

	static function update($database, $dbName, $version) {

		if (!isset($database)) return false;

		# List of updates
		$updates = array(
			'020100', #2.1
			'020101', #2.1.1
			'020200', #2.2
			'020500' #2.5
		);

		# For each update
		foreach ($updates as $update) {

			if (isset($version)&&$update<=$version) continue;

			# Load update
			include(__DIR__ . '/../database/update_' . $update . '.php');

		}

		return true;

	}

	static function createConfig($host = 'localhost', $user, $password, $name = 'lychee') {

		if (!isset($host, $user, $password, $name)) return false;

		$database = new mysqli($host, $user, $password);

		if ($database->connect_errno) return 'Warning: Connection failed!';
		else {

$config = "<?php

###
# @name		Configuration
# @author		Tobias Reich
# @copyright	2014 Tobias Reich
###

if(!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

# Database configuration
\$dbHost = '$host'; # Host of the database
\$dbUser = '$user'; # Username of the database
\$dbPassword = '$password'; # Password of the database
\$dbName = '$name'; # Database name

?>";

			# Save file
			if (file_put_contents(LYCHEE_CONFIG_FILE, $config)===false) return 'Warning: Could not create file!';

			return true;

		}

	}

	static function createDatabase($database, $name = 'lychee') {

		if (!isset($database, $name)) return false;

		# Create database
		$result = $database->query("CREATE DATABASE IF NOT EXISTS $name;");
		$database->select_db($name);

		if (!$database->select_db($name)||!$result) return false;
		return true;

	}

	static function createTables($database) {

		if (!isset($database)) return false;

		# Create settings
		if (!$database->query('SELECT * FROM lychee_settings LIMIT 0;')) {

			# Read file
			$file	= __DIR__ . '/../database/settings_table.sql';
			$query	= @file_get_contents($file);

			# Create table
			if (!isset($query)||$query===false) return false;
			if (!$database->query($query)) return false;

			# Read file
			$file	= __DIR__ . '/../database/settings_content.sql';
			$query	= @file_get_contents($file);

			# Add content
			if (!isset($query)||$query===false) return false;
			if (!$database->query($query)) return false;

		}

		# Create albums
		if (!$database->query('SELECT * FROM lychee_albums LIMIT 0;')) {

			# Read file
			$file	= __DIR__ . '/../database/albums_table.sql';
			$query	= @file_get_contents($file);

			# Create table
			if (!isset($query)||$query===false) return false;
			if (!$database->query($query)) return false;

		}

		# Create photos
		if (!$database->query('SELECT * FROM lychee_photos LIMIT 0;')) {

			# Read file
			$file	= __DIR__ . '/../database/photos_table.sql';
			$query	= @file_get_contents($file);

			# Create table
			if (!isset($query)||$query===false) return false;
			if (!$database->query($query)) return false;

		}

		return true;

	}

}

?>
