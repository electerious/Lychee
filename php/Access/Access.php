<?php

namespace Lychee\Access;

abstract class Access {

	final protected static function fnNotFound() {

		exit('Error: Function not found! Please check the spelling of the called function.');

	}

}

?>