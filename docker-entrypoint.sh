#!/bin/bash
set -e

if [ ! -e '/var/www/html/view.php' ]; then
        echo >&2 "Lychee not found in $(pwd) - copying now..."
        		if [ "$(ls -A)" ]; then
			         echo >&2 "WARNING: $(pwd) is not empty - press Ctrl+C now if this is an error!"
			     ( set -x; ls -A; sleep 10 )
                fi
	tar cf - --one-file-system -C /usr/src/Lychee* . | tar xf -
	chown -R www-data /var/www/html
    echo >&2 "Complete! Lychee has been successfully copied to $(pwd)"
fi

chfn -f 'Lychee Admin' www-data

exec "$@"
