FROM php:5.6-apache

RUN apt-get update && apt-get install -y \
      zip \
      libjpeg-dev \
      libpng12-dev \
 && rm -rf /var/lib/apt/lists/*

RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys 0xb5dbd5925590a237

RUN docker-php-ext-configure gd --with-png-dir=/usr --with-jpeg-dir=/usr \
 && docker-php-ext-install gd mbstring mysqli zip exif json

ENV LYCHEE_VERSION v3.0.9

VOLUME /var/www/html/

RUN curl -fsSL -o lychee.tar.gz \
      "https://github.com/electerious/Lychee/archive/${LYCHEE_VERSION}.tar.gz" \
 && tar -xzf lychee.tar.gz -C /usr/src/ \
 && rm lychee.tar.gz

# COPY php.ini /usr/local/etc/php/php.ini


ENTRYPOINT ["/entrypoint.sh"]
CMD ["apache2-foreground"]
