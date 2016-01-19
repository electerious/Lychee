<?php

###
# @name			Database Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

final class Database extends Module {

	private static $versions = array(
		'020100', #2.1
		'020101', #2.1.1
		'020200', #2.2
		'020500', #2.5
		'020505', #2.5.5
		'020601', #2.6.1
		'020602', #2.6.2
		'020700', #2.7.0
		'030000', #3.0.0
		'030001', #3.0.1
		'030003' #3.0.3
	);

	public static function connect($host = 'localhost', $user, $password, $name = 'lychee') {

		# Check dependencies
		Module::dependencies(isset($host, $user, $password, $name));

		$database = new mysqli($host, $user, $password);

		# Check connection
		if ($database->connect_errno) exit('Error: ' . $database->connect_error);

		# Avoid sql injection on older MySQL versions by using GBK
		if ($database->server_version<50500) @$database->set_charset('GBK');
		else @$database->set_charset('utf8');

		# Set unicode
		$database->query('SET NAMES utf8;');

		# Create database
		if (!self::createDatabase($database, $name)) exit('Error: Could not create database!');

		# Create tables
		if (!self::createTables($database)) exit('Error: Could not create tables!');

		# Update database
		if (!self::update($database, $name)) exit('Error: Could not update database and tables!');

		return $database;

	}

	private static function update($database, $dbName) {

		# Check dependencies
		Module::dependencies(isset($database, $dbName));

		# Get current version
		$query		= self::prepare($database, "SELECT * FROM ? WHERE `key` = 'version'", array(LYCHEE_TABLE_SETTINGS));
		$results	= $database->query($query);
		$current	= $results->fetch_object()->value;

		# For each update
		foreach (self::$versions as $version) {

			# Only update when newer version available
			if ($version<=$current) continue;

			# Load update
			include(__DIR__ . '/../database/update_' . $update . '.php');

		}

		return true;

	}

	public static function createConfig($host = 'localhost', $user, $password, $name = 'lychee', $prefix = '') {

		# Check dependencies
		Module::dependencies(isset($host, $user, $password, $name));

		$database = new mysqli($host, $user, $password);

		if ($database->connect_errno) return 'Warning: Connection failed!';

		# Check if user can create the database before saving the configuration
		if (!self::createDatabase($database, $name)) return 'Warning: Creation failed!';

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
# @copyright	2015 Tobias Reich
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

	private static function createDatabase($database, $name = 'lychee') {

		# Check dependencies
		Module::dependencies(isset($database, $name));

		# Check if database exists
		if ($database->select_db($name)) return true;

		# Create database
		$query	= self::prepare($database, 'CREATE DATABASE IF NOT EXISTS ?', array($name));
		$result = $database->query($query);

		if (!$database->select_db($name)||!$result) return false;
		return true;

	}

	private static function createTables($database) {

		# Check dependencies
		Module::dependencies(isset($database));

		# Check if tables exist
		$query = self::prepare($database, 'SELECT * FROM ?, ?, ?, ? LIMIT 0', array(LYCHEE_TABLE_PHOTOS, LYCHEE_TABLE_ALBUMS, LYCHEE_TABLE_SETTINGS, LYCHEE_TABLE_LOG));
		if ($database->query($query)) return true;

		# Create log
		$exist = self::prepare($database, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_LOG));
		if (!$database->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/log_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) return false;

			# Create table
			$query = self::prepare($database, $query, array(LYCHEE_TABLE_LOG));
			if (!$database->query($query)) return false;

		}

		# Create settings
		$exist = self::prepare($database, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_SETTINGS));
		if (!$database->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/settings_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error($database, __METHOD__, __LINE__, 'Could not load query for lychee_settings');
				return false;
			}

			# Create table
			$query = self::prepare($database, $query, array(LYCHEE_TABLE_SETTINGS));
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
			$query = self::prepare($database, $query, array(LYCHEE_TABLE_SETTINGS));
			if (!$database->query($query)) {
				Log::error($database, __METHOD__, __LINE__, $database->error);
				return false;
			}

			# Generate identifier
			$identifier	= md5(microtime(true));
			$query		= self::prepare($database, "UPDATE `?` SET `value` = '?' WHERE `key` = 'identifier' LIMIT 1", array(LYCHEE_TABLE_SETTINGS, $identifier));
			if (!$database->query($query)) {
				Log::error($database, __METHOD__, __LINE__, $database->error);
				return false;
			}

		}

		# Create albums
		$exist = self::prepare($database, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_ALBUMS));
		if (!$database->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/albums_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error($database, __METHOD__, __LINE__, 'Could not load query for lychee_albums');
				return false;
			}

			# Create table
			$query = self::prepare($database, $query, array(LYCHEE_TABLE_ALBUMS));
			if (!$database->query($query)) {
				Log::error($database, __METHOD__, __LINE__, $database->error);
				return false;
			}

		}

		# Create photos
		$exist = self::prepare($database, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_PHOTOS));
		if (!$database->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/photos_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error($database, __METHOD__, __LINE__, 'Could not load query for lychee_photos');
				return false;
			}

			# Create table
			$query = self::prepare($database, $query, array(LYCHEE_TABLE_PHOTOS));
			if (!$database->query($query)) {
				Log::error($database, __METHOD__, __LINE__, $database->error);
				return false;
			}

		}

		return true;

	}

	public static function setVersion($database, $version) {

		$query	= self::prepare($database, "UPDATE ? SET value = '?' WHERE `key` = 'version'", array(LYCHEE_TABLE_SETTINGS, $version));
		$result = $database->query($query);
		if (!$result) {
			Log::error($database, __METHOD__, __LINE__, 'Could not update database (' . $database->error . ')');
			return false;
		}

	}

	public static function prepare($database, $query, $data) {

		# Check dependencies
		Module::dependencies(isset($database, $query, $data));

		# Count the number of placeholders and compare it with the number of arguments
		# If it doesn't match, calculate the difference and skip this number of placeholders before starting the replacement
		# This avoids problems with placeholders in user-input
		# $skip = Number of placeholders which need to be skipped
		$skip	= 0;
		$temp   = '';
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
