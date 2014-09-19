<?php

###
# @name		Database Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Database extends Module {

	static function connect($host = 'localhost', $user, $password, $name = 'lychee') {

		# Check dependencies
		Module::dependencies(isset($host, $user, $password, $name));

		$database = new mysqli($host, $user, $password);

		# Check connection
		if ($database->connect_errno) exit('Error: ' . $database->connect_error);

		# Avoid sql injection on older MySQL versions by using GBK
		if ($database->server_version<50500) $database->set_charset('GBK');
		else $database->set_charset("utf8");

		# Set unicode
		$database->query('SET NAMES utf8;');

		# Check database
		if (!$database->select_db($name))
			if (!Database::createDatabase($database, $name)) exit('Error: Could not create database!');

		# Check tables
		$query = Database::prepare($database, 'SELECT * FROM ?, ?, ?, ? LIMIT 0', array(LYCHEE_TABLE_PHOTOS, LYCHEE_TABLE_ALBUMS, LYCHEE_TABLE_SETTINGS, LYCHEE_TABLE_LOG));
		if (!$database->query($query))
			if (!Database::createTables($database)) exit('Error: Could not create tables!');

		return $database;

	}

	static function update($database, $dbName, $version = 0) {

		# Check dependencies
		Module::dependencies(isset($database, $dbName));
		if (!isset($version)) return true;

		# List of updates
		$updates = array(
			'020100', #2.1
			'020101', #2.1.1
			'020200', #2.2
			'020500', #2.5
			'020505', #2.5.5
			'020601', #2.6.1
			'020602' #2.6.2
		);

		# For each update
		foreach ($updates as $update) {

			if ($update<=$version) continue;

			# Load update
			include(__DIR__ . '/../database/update_' . $update . '.php');

		}

		return true;

	}

	static function createConfig($host = 'localhost', $user, $password, $name = 'lychee', $prefix = '') {

		# Check dependencies
		Module::dependencies(isset($host, $user, $password, $name));

		$database = new mysqli($host, $user, $password);

		if ($database->connect_errno) return 'Warning: Connection failed!';

		# Check if database exists
		if (!$database->select_db($name)) {

			# Database doesn't exist
			# Check if user can create a database
			$result = $database->query('CREATE DATABASE lychee_dbcheck');
			if (!$result) return 'Warning: Creation failed!';
			else $database->query('DROP DATABASE lychee_dbcheck');

		}

		# Escape data
		$host		= mysqli_real_escape_string($database, $host);
		$user		= mysqli_real_escape_string($database, $user);
		$password	= mysqli_real_escape_string($database, $password);
		$name		= mysqli_real_escape_string($database, $name);
		$prefix		= mysqli_real_escape_string($database, $prefix);

		# Save config.php
$config = "<?php

###
# @name			Configuration
# @author		Tobias Reich
# @copyright	2014 Tobias Reich
###

if(!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

# Database configuration
\$dbHost = '$host'; # Host of the database
\$dbUser = '$user'; # Username of the database
\$dbPassword = '$password'; # Password of the database
\$dbName = '$name'; # Database name
\$dbTablePrefix = '$prefix'; # Table prefix

?>";

		# Save file
		if (file_put_contents(LYCHEE_CONFIG_FILE, $config)===false) return 'Warning: Could not create file!';

		return true;

	}

	static function createDatabase($database, $name = 'lychee') {

		# Check dependencies
		Module::dependencies(isset($database, $name));

		# Create database
		$result = $database->query("CREATE DATABASE IF NOT EXISTS $name;");
		$database->select_db($name);

		if (!$database->select_db($name)||!$result) return false;
		return true;

	}

	static function createTables($database) {

		# Check dependencies
		Module::dependencies(isset($database));

		# Create log
		$exist = Database::prepare($database, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_LOG));
		if (!$database->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/log_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) return false;

			# Create table
			$query = Database::prepare($database, $query, array(LYCHEE_TABLE_LOG));
			if (!$database->query($query)) return false;

		}

		# Create settings
		$exist = Database::prepare($database, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_SETTINGS));
		if (!$database->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/settings_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error($database, __METHOD__, __LINE__, 'Could not load query for lychee_settings');
				return false;
			}

			# Create table
			$query = Database::prepare($database, $query, array(LYCHEE_TABLE_SETTINGS));
			if (!$database->query($query)) {
				Log::error($database, __METHOD__, __LINE__, $database->error);
				return false;
			}

			# Read file
			$file	= __DIR__ . '/../database/settings_content.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error($database, __METHOD__, __LINE__, 'Could not load content-query for lychee_settings');
				return false;
			}

			# Add content
			$query = Database::prepare($database, $query, array(LYCHEE_TABLE_SETTINGS));
			if (!$database->query($query)) {
				Log::error($database, __METHOD__, __LINE__, $database->error);
				return false;
			}

		}

		# Create albums
		$exist = Database::prepare($database, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_ALBUMS));
		if (!$database->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/albums_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error($database, __METHOD__, __LINE__, 'Could not load query for lychee_albums');
				return false;
			}

			# Create table
			$query = Database::prepare($database, $query, array(LYCHEE_TABLE_ALBUMS));
			if (!$database->query($query)) {
				Log::error($database, __METHOD__, __LINE__, $database->error);
				return false;
			}

		}

		# Create photos
		$exist = Database::prepare($database, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_PHOTOS));
		if (!$database->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/photos_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error($database, __METHOD__, __LINE__, 'Could not load query for lychee_photos');
				return false;
			}

			# Create table
			$query = Database::prepare($database, $query, array(LYCHEE_TABLE_PHOTOS));
			if (!$database->query($query)) {
				Log::error($database, __METHOD__, __LINE__, $database->error);
				return false;
			}

		}

		return true;

	}

	static function setVersion($database, $version) {

		$query	= Database::prepare($database, "UPDATE ? SET value = '?' WHERE `key` = 'version'", array(LYCHEE_TABLE_SETTINGS, $version));
		$result = $database->query($query);
		if (!$result) {
			Log::error($database, __METHOD__, __LINE__, 'Could not update database (' . $database->error . ')');
			return false;
		}

	}

	static function prepare($database, $query, $data) {

		# Check dependencies
		Module::dependencies(isset($database, $query, $data));

		# Count the number of placeholders and compare it with the number of arguments
		# If it doesn't match, calculate the difference and skip this number of placeholders before starting the replacement
		# This avoids problems with placeholders in user-input
		# $skip = Number of placeholders which need to be skipped
		$skip	= 0;
		$num	= array(
			'placeholder'	=> substr_count($query, '?'),
			'data'			=> count($data)
		);

		if (($num['data']-$num['placeholder'])<0) Log::notice($database, __METHOD__, __LINE__, 'Could not completely prepare query. Query has more placeholders than values.');

		foreach ($data as $value) {

			# Escape
			$value = mysqli_real_escape_string($database, $value);

			# Recalculate number of placeholders
			$num['placeholder'] = substr_count($query, '?');

			# Calculate number of skips
			if ($num['placeholder']>$num['data']) $skip = $num['placeholder'] - $num['data'];

			if ($skip>0) {

				# Need to skip $skip placeholders, because the user input contained placeholders
				# Calculate a substring which does not contain the user placeholders
				# 1 or -1 is the length of the placeholder (placeholder = ?)

				$pos = -1;
				for ($i=$skip; $i>0; $i--) $pos = strpos($query, '?', $pos + 1);
				$pos++;

				$temp	= substr($query, 0, $pos); # First part of $query
				$query	= substr($query, $pos); # Last part of $query

			}

			# Replace
			$query = preg_replace('/\?/', $value, $query, 1);

			if ($skip>0) {

				# Reassemble the parts of $query
				$query = $temp . $query;

			}

			# Reset skip
			$skip = 0;

			# Decrease number of data elements
			$num['data']--;

		}

		return $query;

	}

}

?>
