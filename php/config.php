<?php

/**
 * @name        config.php
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 */

if(!defined('LYCHEE')) die('Direct access is not allowed!');

// Database configurations
$db = 'lychee'; //Database name
$dbUser = 'lychee'; //Username of the database
$dbPassword = 'lychee_passwd'; //Password of the Database
$dbHost = 'localhost'; //Host of the Database

// Admin Login
$user = 'lychee'; //Admin Username
$password = '1234'; //Admin Password

// Additional settings
$checkForUpdates = true;
$thumbQuality = 95; //Quality of the Thumbs (0-100). Default: 95
$sorting = 'DESC'; //ASC or DESC sorting of albums and photos
$bitlyUsername = ''; //Your Bit.ly Username
$bitlyApi = ''; //Your Bit.ly API Key

?>