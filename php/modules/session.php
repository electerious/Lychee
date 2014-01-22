<?php

/**
 * @name        Session Module
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function init($mode) {

	global $settings;

	$return['config'] = $settings;
	unset($return['config']['password']);

	// No login
	if ($settings['username']===''&&$settings['password']==='') $return['config']['login'] = false;
	else $return['config']['login'] = true;

	if ($mode==='admin') {
		$return['loggedIn'] = true;
	} else {
		unset($return['config']['username']);
		unset($return['config']['thumbQuality']);
		unset($return['config']['sorting']);
		unset($return['config']['login']);
		$return['loggedIn'] = false;
	}

	return $return;

}

function login($username, $password) {

	global $database, $settings;

	// Check login
    if ($username===$settings['username']&&$password===$settings['password']) {
        $_SESSION['login'] = true;
        return true;
    }

    // No login
    if ($settings['username']===''&&$settings['password']==='') {
    	$_SESSION['login'] = true;
    	return true;
    }

	return false;

}

function logout() {

    session_destroy();
    return true;

}

?>