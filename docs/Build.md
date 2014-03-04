### Dependencies

First you have to install the following dependencies:

- [CSS Optimizer](https://github.com/css/csso) `csso`
- [UglifyJS](https://github.com/mishoo/UglifyJS2) `uglifyjs`

These dependencies can be installed using `npm`:

	npm install csso uglify-js -g;
	
### Build

The Makefile is located in `etc/` and can be easily executed, using the following command. Make sure your run this from the root of Lychee:

	make -f etc/Makefile
	
### Use uncompressed files

While developing, you might want to use the uncompressed files. This is possible by editing the `index.html`. Simply change the linked CSS and JS files. There are already out-commented link-tags for development and production.