<?php

###
# @name		Database Module
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Database extends Module {

	static function connect($host = 'localhost', $user, $password, $name = 'lychee', $dbTablePrefix = 'lychee') {

		# Check dependencies
		Module::dependencies(isset($host, $user, $password, $name, $dbTablePrefix));

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
                $query = Database::prepareQuery('SELECT * FROM {prefix}_photos, {prefix}_albums, {prefix}_settings, {prefix}_log LIMIT 0;', $dbTablePrefix);

		if (!$database->query($query))
			if (!Database::createTables($database, $dbTablePrefix)) exit('Error: Could not create tables!');

		return $database;
	}

	static function update($database, $dbName, $version = 0) {

		# Check dependencies
		Module::dependencies(isset($database, $dbName));

		# List of updates
		$updates = array(
			'020100', #2.1
			'020101', #2.1.1
			'020200', #2.2
			'020500', #2.5
			'020505' #2.5.5
		);

		# For each update
		foreach ($updates as $update) {

			if (isset($version)&&$update<=$version) continue;

			# Load update
			include(__DIR__ . '/../database/update_' . $update . '.php');

		}

		return true;

	}

	static function createConfig($host = 'localhost', $user, $password, $name = 'lychee', $tablePrefix = 'lychee') {

		# Check dependencies
		Module::dependencies(isset($host, $user, $password, $name, $tablePrefix));

		$database = new mysqli($host, $user, $password);

		if ($database->connect_errno) return 'Warning: Connection failed!';

		# Check if database exists
		if (!$database->select_db($name)) {

			# Database doesn't exist
			# Check if user can create a database
                        $query = Database::prepareQuery('CREATE DATABASE {prefix}_dbcheck', $tablePrefix);
			$result = $database->query($query);
			if (!$result) return 'Warning: Creation failed!';
			else $database->query(Database::prepareQuery('DROP DATABASE {prefix}_dbcheck', $tablePrefix));

		}

		# Save config.php
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
\$dbTablePrefix = '$tablePrefix'; # Table prefix

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

	static function createTables($database, $tablePrefix) {

		# Check dependencies
		Module::dependencies(isset($database, $tablePrefix));

		# Create log
                $query = Database::prepareQuery('SELECT * FROM {prefix}_log LIMIT 0;', $tablePrefix);
		if (!$database->query($query)) {

			# Read file
			$file	= __DIR__ . '/../database/log_table.sql';
			$query	= Database::readSqlFile($file, $tablePrefix);

			# Create table
			if (!isset($query)||$query===false) return false;
			if (!$database->query($query)) return false;

		}

		# Create settings
                $query = Database::prepareQuery('SELECT * FROM {prefix}_settings LIMIT 0;', $tablePrefix);
		if (!$database->query($query)) {

			# Read file
			$file	= __DIR__ . '/../database/settings_table.sql';
			$query	= Database::readSqlFile($file, $tablePrefix);

			# Create table
			if (!isset($query)||$query===false) {
				Log::error($database, $tablePrefix, __METHOD__, __LINE__, Database::prepareQuery('Could not load query for {prefix}_settings', $tablePrefix));
				return false;
			}
			if (!$database->query($query)) {
				Log::error($database, $tablePrefix, __METHOD__, __LINE__, $database->error);
				return false;
			}

			# Read file
			$file	= __DIR__ . '/../database/settings_content.sql';
			$query	= Database::readSqlFile($file, $tablePrefix);

			# Add content
			if (!isset($query)||$query===false) {
				Log::error($database, $tablePrefix, __METHOD__, __LINE__, Database::prepareQuery('Could not load content-query for {prefix}_settings', $tablePrefix));
				return false;
			}
			if (!$database->query($query)) {
				Log::error($database, $tablePrefix, __METHOD__, __LINE__, $database->error);
				return false;
			}

		}

		# Create albums
                $query = Database::prepareQuery('SELECT * FROM {prefix}_albums LIMIT 0;', $tablePrefix);
		if (!$database->query($query)) {

			# Read file
			$file	= __DIR__ . '/../database/albums_table.sql';
			$query	= Database::readSqlFile($file, $tablePrefix);

			# Create table
			if (!isset($query)||$query===false) {
				Log::error($database, $tablePrefix, __METHOD__, __LINE__, Database::prepareQuery('Could not load query for {prefix}_albums', $tablePrefix));
				return false;
			}
			if (!$database->query($query)) {
				Log::error($database, $tablePrefix, __METHOD__, __LINE__, $database->error);
				return false;
			}

		}

		# Create photos
                $query = Database::prepareQuery('SELECT * FROM {prefix}_photos LIMIT 0;', $tablePrefix);
		if (!$database->query($query)) {

			# Read file
			$file	= __DIR__ . '/../database/photos_table.sql';
			$query	= Database::readSqlFile($file, $tablePrefix);

			# Create table
			if (!isset($query)||$query===false) {
				Log::error($database, $tablePrefix, __METHOD__, __LINE__, Database::prepareQuery('Could not load query for {prefix}_photos', $tablePrefix));
				return false;
			}
			if (!$database->query($query)) {
				Log::error($database, $tablePrefix, __METHOD__, __LINE__, $database->error);
				return false;
			}

		}

		return true;

	}

        static function readSqlFile($file, $tablePrefix) {
            $rawQuery = @file_get_contents($file);
            return str_replace('{prefix}', $tablePrefix, $rawQuery);
        }

        static function prepareQuery($rawQuery, $tablePrefix) {
            return str_replace('{prefix}', $tablePrefix, $rawQuery);
        }
}

?>
