#!/bin/sh

VERSION='2.0'

echo 'Press ENTER to continue or any other key to abort'
read -s -n 1 key

if [[ "$key" = "" ]]
then

	if [ -e Lychee-$VERSION ]
	then

		echo "The folder 'Lychee-$VERSION' already exists. Please delete it before you try to install Lychee."
		exit 1

	fi

	if [ -e lychee ]
	then

		echo "The folder 'lychee' already exists. Please delete it before you try to install Lychee."
		exit 1

	fi

	echo 'Downloading and installing Lychee...' && \
	curl -sS https://codeload.github.com/electerious/Lychee/zip/v$VERSION > lychee.zip && \
	echo 'Downloaded.' && \
	echo 'Unzipping...' && \
	unzip lychee.zip && \
	rm lychee.zip && \
	mv Lychee-$VERSION lychee && \
	cd lychee && \
	echo 'The required directories will be made writable and executable for others. Please enter your password if prompted to do so.' && \
	sudo chmod -R 777 uploads php && \
	echo 'Installation successful!' && \
	exit 0

fi