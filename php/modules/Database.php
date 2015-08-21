<?php

###
# @name			Database Module
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

class Database extends Module {

	static function connect($host = 'localhost', $user, $password, $name = 'lychee', $dbtype = 'pgsql') {

		# Check dependencies
		Module::dependencies(isset($host, $user, $password, $name));

		# Create PDO object, this will also connect to the db.
		$database = new PDO(
			"$dbtype:host=$host;dbname=$name",
			$user,
			$password,
			array(
	PDO::ATTR_PERSISTENT => true));

#	PDO::ATTR_PERSISTENT => true,
#	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

		# Creating the PDO is not always sufficient, some polishing may be
		# required. This may differ between RDBMS, hence:
		switch ($dbtype) {
			case 'mysql':
				if (version_compare(PHP_VERSION, '5.3.6') >=0 ) {
					if ( $database->getAttribute(PDO::ATTR_SERVER_VERSION) >= 50500 ) {
						$database->exec('SET NAMES UTF8');
					} else {
						$database->exec('SET NAMES GBK');
					}
				}
				break;
		}

		# Check and create database
		Database::createDatabase($database, $name);

		# Check tables
		$pdostatement = $database->prepare('SELECT * FROM ' .
			LYCHEE_TABLE_PHOTOS   .','.
			LYCHEE_TABLE_ALBUMS   .','.
			LYCHEE_TABLE_SETTINGS .','.
			LYCHEE_TABLE_LOG .
			' LIMIT 0');
		if (!$pdostatement->execute())
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
			'020602', #2.6.2
			'020700', #2.7.0
			'030000', #3.0.0
			'030001', #3.0.1
			'030003' #3.0.3
		);

		# For each update
		foreach ($updates as $update) {

			if ($update<=$version) continue;

			# Load update
//			include(__DIR__ . '/../database/update_' . $update . '.php');

		}

		return true;

	}

	static function createConfig($host = 'localhost', $user, $password, $name = 'lychee', $prefix = '', $type = 'pgsql') {

		# Check dependencies
		Module::dependencies(isset($host, $user, $password, $name));

		# Save config.php
$config = "<?php

###
# @name			Configuration
# @author		Tobias Reich
# @copyright	2015 Tobias Reich
###

if(!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

# Database configuration
\$dbtype = '$type'; # type of the database
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
		switch($database->getAttribute(PDO::ATTR_DRIVER_NAME)) {
		case 'mysql':
			$pdostatement	= $database->prepare("CREATE DATABASE IF NOT EXISTS $name");
			$pdostatement->execute();
			return true;
		}
		return false;
	}

	static function createTables($database) {

		# Check dependencies
		Module::dependencies(isset($database));

		# Create log
		$sql = 'SELECT * FROM '.LYCHEE_TABLE_LOG.' LIMIT 0';
		if (!$database->query($sql)) {

			switch ($database->getAttribute(PDO::ATTR_DRIVER_NAME)) {
			case 'mysql':
				$query = "CREATE TABLE IF NOT EXISTS ".LYCHEE_TABLE_LOG." (
				  `id` int(11) NOT NULL AUTO_INCREMENT,
				  `time` int(11) NOT NULL,
				  `type` varchar(11) NOT NULL,
				  `function` varchar(100) NOT NULL,
				  `line` int(11) NOT NULL,
				  `text` TEXT,
				  PRIMARY KEY (`id`)
				) ENGINE=MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
				)";
				break;
			case 'pgsql':
				$query = "CREATE TABLE IF NOT EXISTS ".LYCHEE_TABLE_LOG." (
				id SERIAL PRIMARY KEY,
				time timestamp NOT NULL DEFAULT clock_timestamp(),
				type varchar(11) NOT NULL,
				function varchar(100) NOT NULL,
				line bigint NOT NULL,
				text TEXT
				)";
				break;
			}

			# Create table
			$stmt = $database->prepare($query);
			if (!$stmt->execute()) return false;

		}

		# Create settings
		$sql = 'SELECT * FROM '.LYCHEE_TABLE_SETTINGS.' LIMIT 0';
		if (!$database->query($sql)) {

			switch ($database->getAttribute(PDO::ATTR_DRIVER_NAME)) {
			case 'mysql':
				$query = "CREATE TABLE IF NOT EXISTS ".LYCHEE_TABLE_LOG." (
				  `key` varchar(50) NOT NULL DEFAULT '',
				  `value` varchar(200) DEFAULT ''
				) ENGINE=MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
				)";
				break;
			case 'pgsql':
				$query	= "CREATE TABLE IF NOT EXISTS ".LYCHEE_TABLE_SETTINGS." (
				key varchar(50) NOT NULL DEFAULT '',
				value varchar(200) DEFAULT ''
				)";
				break;
			}

			# Create table
			$stmt = $database->prepare($query);

			if (!$stmt->execute()) {
				Log::error($database, __METHOD__, __LINE__, $database->errorInfo());
				return false;
			}

			$query	= "INSERT INTO ".LYCHEE_TABLE_SETTINGS." (key, value)
			VALUES
			('version',''),
			('username',''),
			('password',''),
			('thumbQuality','90'),
			('checkForUpdates','0'),
			('sortingPhotos','ORDER BY id DESC'),
			('sortingAlbums','ORDER BY id DESC'),
			('medium','1'),
			('imagick','1'),
			('dropboxKey',''),
			('identifier',''),
			('skipDuplicates','0'),
			('plugins','')";

			# Add content
			$stmt = $database->prepare($query);
			if (!$stmt->execute()) {
				Log::error($database, __METHOD__, __LINE__, $database->errorInfo());
				return false;
			}

			# Generate identifier
			$identifier	= md5(microtime(true));
			$stmt = $database->prepare("UPDATE ".LYCHEE_TABLE_SETTINGS." SET value = :identifier WHERE key = 'identifier'");
			$stmt->bindValue('identifier', $identifier, PDO::PARAM_STR);
			if (!$stmt->execute()) {
				Log::error($database, __METHOD__, __LINE__, $database->errorInfo());
				return false;
			}
		}

		# Create albums
		$sql = 'SELECT * FROM '.LYCHEE_TABLE_ALBUMS.' LIMIT 0';
		if (!$database->query($sql)) {

			switch ($database->getAttribute(PDO::ATTR_DRIVER_NAME)) {
			case 'mysql':
				$query = "CREATE TABLE IF NOT EXISTS ".LYCHEE_TABLE_LOG." (
				  `id` int(11) NOT NULL AUTO_INCREMENT,
				  `title` varchar(100) NOT NULL DEFAULT '',
				  `description` varchar(1000) DEFAULT '',
				  `sysstamp` int(11) NOT NULL,
				  `public` tinyint(1) NOT NULL DEFAULT '0',
				  `visible` tinyint(1) NOT NULL DEFAULT '1',
				  `downloadable` tinyint(1) NOT NULL DEFAULT '0',
				  `password` varchar(100) DEFAULT NULL,
				  PRIMARY KEY (`id`)
				) ENGINE=MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;)";
				break;
			case 'pgsql':
				$query	= "CREATE TABLE IF NOT EXISTS ".LYCHEE_TABLE_ALBUMS." (
				id SERIAL PRIMARY KEY,
				title varchar(100) NOT NULL DEFAULT '',
				description varchar(1000) DEFAULT '',
				sysstamp bigint NOT NULL,
				public boolean NOT NULL DEFAULT false,
				visible boolean NOT NULL DEFAULT true,
				downloadable boolean NOT NULL DEFAULT false,
				password varchar(100) DEFAULT NULL
				)";
				break;
			}

			# Create table
			$stmt = $database->prepare($query);
			if (!$stmt->execute()) {
				Log::error($database, __METHOD__, __LINE__, $database->errorInfo());
				return false;
			}

		}

		# Create photos
		$sql = 'SELECT * FROM '.LYCHEE_TABLE_PHOTOS.' LIMIT 0';
		if (!$database->query($sql)) {

			switch ($database->getAttribute(PDO::ATTR_DRIVER_NAME)) {
			case 'mysql':
				$query = "CREATE TABLE IF NOT EXISTS ".LYCHEE_TABLE_LOG." (
 				 `id` bigint(14) NOT NULL,
				  `title` varchar(100) NOT NULL,
				  `description` varchar(1000) DEFAULT '',
				  `url` varchar(100) NOT NULL,
				  `tags` varchar(1000) NOT NULL DEFAULT '',
				  `public` tinyint(1) NOT NULL,
				  `type` varchar(10) NOT NULL,
				  `width` int(11) NOT NULL,
				  `height` int(11) NOT NULL,
				  `size` varchar(20) NOT NULL,
				  `iso` varchar(15) NOT NULL,
				  `aperture` varchar(20) NOT NULL,
				  `make` varchar(50) NOT NULL,
				  `model` varchar(50) NOT NULL,
				  `shutter` varchar(30) NOT NULL,
				  `focal` varchar(20) NOT NULL,
				  `takestamp` int(11) DEFAULT NULL,
				  `star` tinyint(1) NOT NULL,
				  `thumbUrl` varchar(50) NOT NULL,
				  `album` varchar(30) NOT NULL DEFAULT '0',
				  `checksum` VARCHAR(100) DEFAULT NULL,
				  `medium` tinyint(1) NOT NULL DEFAULT '0',
				  PRIMARY KEY (`id`)
				) ENGINE=MyISAM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;			)";
				break;
			case 'pgsql':
				$query	= "CREATE TABLE IF NOT EXISTS ".LYCHEE_TABLE_PHOTOS." (
				id bigint NOT NULL,
				sysstamp timestamp NOT NULL DEFAULT clock_timestamp(),
				title varchar(100) NOT NULL,
				description varchar(1000) DEFAULT '',
				url varchar(100) NOT NULL,
				tags varchar(1000) NOT NULL DEFAULT '',
				public boolean NOT NULL,
				type varchar(10) NOT NULL,
				width bigint NOT NULL,
				height bigint NOT NULL,
				size varchar(20) NOT NULL,
				iso varchar(15) NOT NULL,
				aperture varchar(20) NOT NULL,
				make varchar(50) NOT NULL,
				model varchar(50) NOT NULL,
				shutter varchar(30) NOT NULL,
				focal varchar(20) NOT NULL,
				takestamp bigint DEFAULT NULL,
				star boolean NOT NULL,
				thumbUrl varchar(50) NOT NULL,
				album varchar(30) NOT NULL DEFAULT '0',
				checksum VARCHAR(100) DEFAULT NULL,
				medium boolean NOT NULL DEFAULT false
				)";
				break;
			}

			# Create table
			$stmt = $database->prepare($query);
			if (!$stmt->execute()) {
				Log::error($database, __METHOD__, __LINE__, $database->errorInfo());
				return false;
			}

		}

		return true;

	}

	static function setVersion($database, $version) {

		$stmt = $database->prepare("UPDATE ".LYCHEE_TABLE_SETTINGS." SET value = :version WHERE `key` = 'version'");
		$stmt.bindParam('version', $version, PDO::PARAM_INT);
		$result = $stmt->execute();
		if (!$result) {
			Log::error($database, __METHOD__, __LINE__, 'Could not update database (' . $database->errorInfo() . ')');
			return false;
		}

	}
}

?>
