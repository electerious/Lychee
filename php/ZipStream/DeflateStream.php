<?php
declare(strict_types=1);

namespace ZipStream;

class DeflateStream extends Stream
{
    protected $filter;
    protected $options;

    public function rewind(): void
    {
        // deflate filter needs to be removed before rewind
        if ($this->filter) {
            $this->removeDeflateFilter();
            $this->seek(0);
            $this->addDeflateFilter($this->options);
        } else {
            rewind($this->stream);
        }
    }

    public function removeDeflateFilter(): void
    {
        if (!$this->filter) {
            return;
        }
        stream_filter_remove($this->filter);
        $this->filter = null;
    }

    public function addDeflateFilter(array $options = null): void
    {
        $this->options = $options;
        $this->filter = stream_filter_append(
            $this->stream,
            'zlib.deflate',
            STREAM_FILTER_READ,
            $this->options
        );
    }
}
