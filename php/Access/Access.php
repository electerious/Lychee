<?php

namespace Lychee\Access;

use Exception;
use Lychee\Modules\Response;

abstract class Access {

	final protected static function fnNotFound($fn) {
        $e = new Exception;
        error_log("$fn: Function not found!" . var_export($e->getTraceAsString(), true));
		Response::error('Function not found! Please check the spelling of the called function.');

	}

}

?>
