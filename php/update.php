<?php

define('LYCHEE', true);

// Include
require('check.php');

if($error=='') {
	if(!$database->query("SELECT `public` FROM `lychee_albums`;")) $database->query("ALTER TABLE  `lychee_albums` ADD  `public` TINYINT( 1 ) NOT NULL DEFAULT  '0'");
	if(!$database->query("SELECT `password` FROM `lychee_albums`;")) $database->query("ALTER TABLE  `lychee_albums` ADD  `password` VARCHAR( 100 ) NULL DEFAULT NULL");
	echo "\nUpdate complete!";
} else {
	echo "\nCould not Update!";
}

?>