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

		# Avoid sql injection on older MySQL versions
		if ($database->server_version<50500) $database->set_charset('GBK');

		# Check database
		if (!$database->select_db($name))
			if (!Database::createDatabase($database, $name)) exit('Error: Could not create database!');

		# Check tables
		if (!$database->query('SELECT * FROM lychee_photos, lychee_albums, lychee_settings LIMIT 0;'))
			if (!Database::createTables($database)) exit('Error: Could not create tables!');

		return $database;

	}

	static function createConfig($host = 'localhost', $user, $password, $name = 'lychee', $version) {

		if (!isset($host, $user, $password, $name, $version)) return false;

		$database = new mysqli($host, $user, $password);

		if ($database->connect_errno) return 'Warning: Connection failed!';
		else {

$config = "<?php

###
# @name		Config
# @author		Tobias Reich
# @copyright	2014 Tobias Reich
###

if(!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

# Config version
\$configVersion = '';

# Database configuration
\$dbHost = '$host'; # Host of the database
\$dbUser = '$user'; # Username of the database
\$dbPassword = '$password'; # Password of the database
\$dbName = '$name'; # Database name

?>";

			# Save file
			if (file_put_contents('../data/config.php', $config)===false) return 'Warning: Could not create file!';

			return true;

		}

	}

	static function createDatabase($database, $name = 'lychee') {

		if (!isset($database, $name)) return false;

		# Execute query
		$result = $database->query("CREATE DATABASE IF NOT EXISTS $name;");
		$database->select_db($name);

		if (!$database->select_db($name)||!$result) return false;
		return true;

	}

	static function createTables($database) {

		if (!isset($database)) return false;

		# Create settings
		if (!$database->query('SELECT * FROM lychee_settings LIMIT 0;')) {

			$query = "

				CREATE TABLE `lychee_settings` (
					`key` varchar(50) NOT NULL DEFAULT '',
					`value` varchar(50) DEFAULT ''
				) ENGINE=MyISAM DEFAULT CHARSET=latin1;

			";

			if (!$database->query($query)) return false;

			$query = "

				INSERT INTO `lychee_settings` (`key`, `value`)
				VALUES
				('username',''),
				('password',''),
				('thumbQuality','90'),
				('checkForUpdates','1'),
				('sorting','ORDER BY id DESC'),
				('dropboxKey','');

			";

			if (!$database->query($query)) return false;

		}

		# Create albums
		if (!$database->query('SELECT * FROM lychee_albums LIMIT 0;')) {

			$query = "

				CREATE TABLE `lychee_albums` (
					`id` int(11) NOT NULL AUTO_INCREMENT,
					`title` varchar(50) NOT NULL,
					`description` varchar(1000) DEFAULT '',
					`sysdate` varchar(10) NOT NULL,
					`public` tinyint(1) NOT NULL DEFAULT '0',
					`visible` tinyint(1) NOT NULL DEFAULT '1',
					`password` varchar(100) DEFAULT '',
					PRIMARY KEY (`id`)
				) ENGINE=MyISAM DEFAULT CHARSET=latin1;

			";

			if (!$database->query($query)) return false;

		}

		# Create photos
		if (!$database->query('SELECT * FROM lychee_photos LIMIT 0;')) {

			$query = "

				CREATE TABLE `lychee_photos` (
					`id` bigint(14) NOT NULL,
					`title` varchar(50) NOT NULL,
					`description` varchar(1000) NOT NULL DEFAULT '',
					`url` varchar(100) NOT NULL,
					`tags` varchar(1000) NOT NULL DEFAULT '',
					`public` tinyint(1) NOT NULL,
					`type` varchar(10) NOT NULL,
					`width` int(11) NOT NULL,
					`height` int(11) NOT NULL,
					`size` varchar(20) NOT NULL,
					`sysdate` varchar(10) NOT NULL,
					`systime` varchar(8) NOT NULL,
					`iso` varchar(15) NOT NULL,
					`aperture` varchar(20) NOT NULL,
					`make` varchar(20) NOT NULL,
					`model` varchar(50) NOT NULL,
					`shutter` varchar(30) NOT NULL,
					`focal` varchar(20) NOT NULL,
					`takedate` varchar(20) NOT NULL,
					`taketime` varchar(8) NOT NULL,
					`star` tinyint(1) NOT NULL,
					`thumbUrl` varchar(50) NOT NULL,
					`album` varchar(30) NOT NULL DEFAULT '0',
					`import_name` varchar(100) DEFAULT '',
					PRIMARY KEY (`id`)
				) ENGINE=MyISAM DEFAULT CHARSET=latin1;

			";

			if (!$database->query($query)) return false;

		}

		return true;

	}

}

?>
