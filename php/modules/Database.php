<?php

###
# @name			Database Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

final class Database extends Module {

	private $connection = null;
	private static $instance = null;

	private static $versions = array(
		'020700', #2.7.0
		'030000', #3.0.0
		'030001', #3.0.1
		'030003' #3.0.3
	);

	public static function get() {

		if (!self::$instance) {

			$credentials = Config::get();

			self::$instance = new self(
				$credentials['host'],
				$credentials['user'],
				$credentials['password'],
				$credentials['name'],
				$credentials['prefix']
			);

		}

		return self::$instance->connection;

	}

	private function __construct($host, $user, $password, $name = 'lychee', $dbTablePrefix) {

		# Check dependencies
		Module::dependencies(isset($host, $user, $password, $name));

		# Define the table prefix
		defineTablePrefix($dbTablePrefix);

		# Open a new connection to the MySQL server
		$connection = self::connect($host, $user, $password);

		# Check if the connection was successful
		if ($connection===false) exit('Error: ' . $connection->connect_error);

		if (!self::setCharset($connection)) exit('Error: Could not set database charset!');

		# Create database
		if (!self::createDatabase($connection, $name)) exit('Error: Could not create database!');

		# Create tables
		if (!self::createTables($connection)) exit('Error: Could not create tables!');

		# Update database
		if (!self::update($connection, $name)) exit('Error: Could not update database and tables!');

		$this->connection = $connection;

	}

	private function __clone() {

		# Magic method clone is empty to prevent duplication of connection

	}

	public static function connect($host = 'localhost', $user, $password) {

		# Open a new connection to the MySQL server
		$connection = new mysqli($host, $user, $password);

		# Check if the connection was successful
		if ($connection->connect_errno) return false;

		return $connection;

	}

	private static function setCharset($connection) {

		# Avoid sql injection on older MySQL versions by using GBK
		if ($connection->server_version<50500) @$connection->set_charset('GBK');
		else @$connection->set_charset('utf8');

		# Set unicode
		$connection->query('SET NAMES utf8;');

		return true;

	}

	public static function createDatabase($connection, $name = 'lychee') {

		# Check dependencies
		Module::dependencies(isset($connection, $name));

		# Check if database exists
		if ($connection->select_db($name)) return true;

		# Create database
		$query	= self::prepare($connection, 'CREATE DATABASE IF NOT EXISTS ?', array($name));
		$result = $connection->query($query);

		if (!$connection->select_db($name)) return false;
		return true;

	}

	private static function createTables($connection) {

		# Check dependencies
		Module::dependencies(isset($connection));

		# Check if tables exist
		$query = self::prepare($connection, 'SELECT * FROM ?, ?, ?, ? LIMIT 0', array(LYCHEE_TABLE_PHOTOS, LYCHEE_TABLE_ALBUMS, LYCHEE_TABLE_SETTINGS, LYCHEE_TABLE_LOG));
		if ($connection->query($query)) return true;

		# Create log
		$exist = self::prepare($connection, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_LOG));
		if (!$connection->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/log_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) return false;

			# Create table
			$query = self::prepare($connection, $query, array(LYCHEE_TABLE_LOG));
			if (!$connection->query($query)) return false;

		}

		# Create settings
		$exist = self::prepare($connection, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_SETTINGS));
		if (!$connection->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/settings_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error(__METHOD__, __LINE__, 'Could not load query for lychee_settings');
				return false;
			}

			# Create table
			$query = self::prepare($connection, $query, array(LYCHEE_TABLE_SETTINGS));
			if (!$connection->query($query)) {
				Log::error(__METHOD__, __LINE__, $connection->error);
				return false;
			}

			# Read file
			$file	= __DIR__ . '/../database/settings_content.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error(__METHOD__, __LINE__, 'Could not load content-query for lychee_settings');
				return false;
			}

			# Add content
			$query = self::prepare($connection, $query, array(LYCHEE_TABLE_SETTINGS));
			if (!$connection->query($query)) {
				Log::error(__METHOD__, __LINE__, $connection->error);
				return false;
			}

			# Generate identifier
			$identifier	= md5(microtime(true));
			$query		= self::prepare($connection, "UPDATE `?` SET `value` = '?' WHERE `key` = 'identifier' LIMIT 1", array(LYCHEE_TABLE_SETTINGS, $identifier));
			if (!$connection->query($query)) {
				Log::error(__METHOD__, __LINE__, $connection->error);
				return false;
			}

		}

		# Create albums
		$exist = self::prepare($connection, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_ALBUMS));
		if (!$connection->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/albums_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error(__METHOD__, __LINE__, 'Could not load query for lychee_albums');
				return false;
			}

			# Create table
			$query = self::prepare($connection, $query, array(LYCHEE_TABLE_ALBUMS));
			if (!$connection->query($query)) {
				Log::error(__METHOD__, __LINE__, $connection->error);
				return false;
			}

		}

		# Create photos
		$exist = self::prepare($connection, 'SELECT * FROM ? LIMIT 0', array(LYCHEE_TABLE_PHOTOS));
		if (!$connection->query($exist)) {

			# Read file
			$file	= __DIR__ . '/../database/photos_table.sql';
			$query	= @file_get_contents($file);

			if (!isset($query)||$query===false) {
				Log::error(__METHOD__, __LINE__, 'Could not load query for lychee_photos');
				return false;
			}

			# Create table
			$query = self::prepare($connection, $query, array(LYCHEE_TABLE_PHOTOS));
			if (!$connection->query($query)) {
				Log::error(__METHOD__, __LINE__, $connection->error);
				return false;
			}

		}

		return true;

	}

	private static function update($connection, $dbName) {

		# Check dependencies
		Module::dependencies(isset($connection));

		# Get current version
		$query		= self::prepare($connection, "SELECT * FROM ? WHERE `key` = 'version'", array(LYCHEE_TABLE_SETTINGS));
		$results	= $connection->query($query);
		$current	= $results->fetch_object()->value;

		# For each update
		foreach (self::$versions as $version) {

			# Only update when newer version available
			if ($version<=$current) continue;

			# Load update
			include(__DIR__ . '/../database/update_' . $version . '.php');

		}

		return true;

	}

	public static function setVersion($connection, $version) {

		$query	= self::prepare($connection, "UPDATE ? SET value = '?' WHERE `key` = 'version'", array(LYCHEE_TABLE_SETTINGS, $version));
		$result = $connection->query($query);
		if (!$result) {
			Log::error(__METHOD__, __LINE__, 'Could not update database (' . $connection->error . ')');
			return false;
		}

	}

	public static function prepare($connection, $query, $data) {

		# Check dependencies
		Module::dependencies(isset($connection, $query, $data));

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

		if (($num['data']-$num['placeholder'])<0) Log::notice(__METHOD__, __LINE__, 'Could not completely prepare query. Query has more placeholders than values.');

		foreach ($data as $value) {

			# Escape
			$value = mysqli_real_escape_string($connection, $value);

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
