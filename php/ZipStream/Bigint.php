<?php
declare(strict_types=1);

namespace ZipStream;

use OverflowException;

class Bigint
{
    private $bytes = [0, 0, 0, 0, 0, 0, 0, 0];

    public function __construct(int $value = 0)
    {
        if ($value instanceof self) {
            $this->bytes = $value->bytes;
        } else {
            $this->fillBytes($value, 0, 8);
        }
    }

    protected function fillBytes(int $value, int $start, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $this->bytes[$start + $i] = $i >= PHP_INT_SIZE ? 0 : $value & 0xFF;
            $value >>= 8;
        }
    }

    public static function init(int $value = 0): self
    {
        return new self($value);
    }

    public static function fromLowHigh(int $low, int $high): self
    {
        $bigint = new Bigint;
        $bigint->fillBytes($low, 0, 4);
        $bigint->fillBytes($high, 4, 4);
        return $bigint;
    }

    public function getHigh32(): int
    {
        return $this->getValue(4, 4);
    }

    public function getValue(int $end = 0, int $length = 8): int
    {
        $result = 0;
        for ($i = $end + $length - 1; $i >= $end; $i--) {
            $result <<= 8;
            $result |= $this->bytes[$i];
        }
        return $result;
    }

    public function getLowFF(bool $force = false): int
    {
        if ($force || $this->isOver32()) {
            return 0xFFFFFFFF;
        }
        return $this->getLow32();
    }

    public function isOver32(bool $force = false): bool
    {
        // value 0xFFFFFFFF already needs a Zip64 header
        return $force ||
            max(array_slice($this->bytes, 4, 4)) > 0 ||
            min(array_slice($this->bytes, 0, 4)) === 0xFF;
    }

    public function getLow32(): int
    {
        return $this->getValue(0, 4);
    }

    public function getHex64(): string
    {
        $result = '0x';
        for ($i = 7; $i >= 0; $i--) {
            $result .= sprintf('%02X', $this->bytes[$i]);
        }
        return $result;
    }

    public function add(self $other): self
    {
        $result = clone $this;
        $overflow = false;
        for ($i = 0; $i < 8; $i++) {
            $result->bytes[$i] += $other->bytes[$i];
            if ($overflow) {
                $result->bytes[$i]++;
                $overflow = false;
            }
            if ($result->bytes[$i] & 0x100) {
                $overflow = true;
                $result->bytes[$i] &= 0xFF;
            }
        }
        if ($overflow) {
            throw new OverflowException;
        }
        return $result;
    }
}
