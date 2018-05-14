<?php
declare(strict_types=1);

namespace ZipStream\Option;

use MyCLabs\Enum\Enum;

/**
 * Methods enum
 *
 * @method static STORE(): Method
 * @method static DEFLATE(): Method
 */
class Method extends Enum
{
    const STORE = 0x00;
    const DEFLATE = 0x08;
}
