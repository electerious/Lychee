#!/bin/bash

folderCSS="../assets/css"
folderJS="../assets/js"

if [ -e "$folderCSS/modules/" ]
then

	echo "Compiling CSS ..."
	awk 'FNR==1{print ""}1' $folderCSS/modules/*.css > $folderCSS/min/main.css
	csso $folderCSS/min/main.css $folderCSS/min/main.css
	echo "CSS compiled!"

else

	echo "CSS files not found in $folderCSS"

fi

if [ -e "$folderJS/modules/" ]
then

	echo "Compiling JS ..."
	awk 'FNR==1{print ""}1' $folderJS/modules/*.js > $folderJS/min/main.js
	uglifyjs $folderJS/min/main.js -o $folderJS/min/main.js
	echo "JS compiled!"

else

	echo "JS files not found in $folderJS"

fi