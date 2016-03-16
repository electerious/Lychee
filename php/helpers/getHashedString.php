<?php

function getHashedString($password) {

	// Inspired by http://alias.io/2010/01/store-passwords-safely-with-php-and-mysql/

	// A higher $cost is more secure but consumes more processing power
	$cost = 10;

	// Create a random salt
	if (extension_loaded('openssl')) {

		$salt = strtr(substr(base64_encode(openssl_random_pseudo_bytes(17)),0,22), '+', '.');

	} elseif (extension_loaded('mcrypt')) {

		$salt = strtr(substr(base64_encode(mcrypt_create_iv(17, MCRYPT_DEV_URANDOM)),0,22), '+', '.');

	} else {

		$salt = '';

		for ($i = 0; $i < 22; $i++) {
			$salt .= substr("./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", mt_rand(0, 63), 1);
		}

	}

	// Prefix information about the hash so PHP knows how to verify it later.
	// "$2a$" Means we're using the Blowfish algorithm. The following two digits are the cost parameter.
	$salt = sprintf("$2a$%02d$", $cost) . $salt;

	// Hash the password with the salt
	return crypt($password, $salt);

}

?>