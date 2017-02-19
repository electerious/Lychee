# Please do not manually call this file!

# Have supervisor manage the apache process instead
service apache2 stop

# Make sure I have permissions to the volumes and the necessary folders exist.
mkdir -p /uploads/big
mkdir -p /uploads/import
mkdir -p /uploads/medium
mkdir -p /uploads/thumb
chown root:www-data -R /var/www/lychee/data
chown root:www-data -R /var/www/lychee/uploads
chmod 770 -R /var/www/lychee/uploads
chmod 770 -R /var/www/lychee/data

# Here is a good point to run database migrations (before the webserver is started up by supervisord)
#/usr/bin/php /var/www/lychee/scripts/migrate.php

# Start supervisord to manage all processes and tye up the FG process for the docker container.
/usr/local/bin/supervisord