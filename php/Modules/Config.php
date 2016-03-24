<?php

namespace Lychee\Modules;

final class Config {

	/**
	 * Creates the configuration file.
	 * @return true|string Returns true when successful.
	 *                     Warning: Connection failed!
	 *                     Warning: Creation failed!
	 *                     Warning: Could not create file!
	 */
	public static function create($host, $user, $password, $name = 'lychee', $prefix = '') {

		// Open a new connection to the MySQL server
		$connection = Database::connect($host, $user, $password);

		// Check if the connection was successful
		if ($connection===false) return 'Warning: Connection failed!';

		// Check if user can create the database before saving the configuration
		if (Database::createDatabase($connection, $name)===false) return 'Warning: Creation failed!';

		// Escape data
		$host     = mysqli_real_escape_string($connection, $host);
		$user     = mysqli_real_escape_string($connection, $user);
		$password = mysqli_real_escape_string($connection, $password);
		$name     = mysqli_real_escape_string($connection, $name);
		$prefix   = mysqli_real_escape_string($connection, $prefix);

		// Save config.php
$config = "<?php

// Database configuration
\$dbHost = '$host'; // Host of the database
\$dbUser = '$user'; // Username of the database
\$dbPassword = '$password'; // Password of the database
\$dbName = '$name'; // Database name
\$dbTablePrefix = '$prefix'; // Table prefix

?>";

		// Save file
		if (@file_put_contents(LYCHEE_CONFIG_FILE, $config)===false) return 'Warning: Could not create file!';

		return true;

	}

	/**
	 * @return boolean Returns true when the config exists.
	 */
	public static function exists() {

		return file_exists(LYCHEE_CONFIG_FILE);

	}

	/**
	 * @return array Returns the config.
	 */
	public static function get() {

		require(LYCHEE_CONFIG_FILE);

		return(array(
			'host'     => $dbHost,
			'user'     => $dbUser,
			'password' => $dbPassword,
			'name'     => $dbName,
			'prefix'   => $dbTablePrefix
		));

	}

}

?>