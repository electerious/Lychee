FROM ubuntu:14.04

# Install packages
RUN apt-get update
RUN apt-get -y install git
RUN apt-get -y install apache2 mysql-server libapache2-mod-php5 imagemagick php5-mysql php5-gd php5-curl php5-imagick

# Modify php.ini to contain the following settings:
#   max_execution_time = 200
#   post_max_size = 100M
#   upload_max_size = 100M
#   upload_max_filesize = 20M
#   memory_limit = 256M
RUN sed -i -e "s/^max_execution_time\s*=.*/max_execution_time = 200/" \
-e "s/^post_max_size\s*=.*/post_max_size = 100M/" \
-e "s/^upload_max_filesize\s*=.*/upload_max_filesize = 20M\nupload_max_size = 100M/" \
-e "s/^memory_limit\s*=.*/memory_limit = 256M/" /etc/php5/apache2/php.ini

# Link /var/www to /app directory
RUN mkdir -p /app && rm -fr /var/www/html && ln -s /app /var/www/html
WORKDIR /app

# Clone lychee
RUN git clone https://github.com/electerious/Lychee.git .

# Set file permissions
RUN chown -R www-data:www-data /app
RUN chmod -R 777 uploads/ data/

EXPOSE 80
CMD src/commands/start