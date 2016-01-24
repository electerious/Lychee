<?php

###
# @name			Access
# @copyright	2015 by Tobias Reich
###

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

abstract class Access {

	abstract protected function check($fn);

}

?>