<?php

###
# @name			Define
# @author		Tobias Reich
# @copyright	2014 by Tobias Reich
###

# Define root
define('LYCHEE', substr(__DIR__, 0, -3));

# Define dirs
define('LYCHEE_DATA', LYCHEE . 'data/');
define('LYCHEE_UPLOADS_BIG', LYCHEE . 'uploads/big/');
define('LYCHEE_UPLOADS_THUMB', LYCHEE . 'uploads/thumb/');
define('LYCHEE_UPLOADS_IMPORT', LYCHEE . 'uploads/import/');

# Define files
define('LYCHEE_CONFIG_FILE', LYCHEE_DATA . 'config.php');

?>