<?php

/**
 * @name        Album Module
 * @author      Tobias Reich
 * @copyright   2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function getTags($photoID) {

	global $database;

	$result = $database->query("SELECT tags FROM lychee_photos WHERE id = '$photoID';");
	$return = $result->fetch_array();

	if (!$result) return false;
	return $return;

}

function setTags($photoIDs, $tags) {

	global $database;
	
	// Parse tags
	$tags = preg_replace('/(\ ,\ )|(\ ,)|(,\ )|(,{1,}\ {0,})|(,$|^,)/', ',', $tags);
	$tags = preg_replace('/,$|^,/', ',', $tags);
	
	if (strlen($tags)>1000) return false;

	$result = $database->query("UPDATE lychee_photos SET tags = '$tags' WHERE id IN ($photoIDs);");

	if (!$result) return false;
	return true;

}