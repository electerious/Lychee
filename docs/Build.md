### Dependencies

First you have to install the following dependencies:

- `node` [Node.js](http://nodejs.org) v0.10 or later
- `npm` [Node Packaged Modules](https://www.npmjs.org)
- `gulp` [Gulp.js](http://gulpjs.com)

After [installing Node.js](http://nodejs.org) you can use the included `npm` package manager to install the global requirements and Lychee-dependencies with the following command:

	cd src/
	npm install -g gulp
	npm install

### Build

The Gulpfile is located in `src/` and can be easily executed using the `gulp` command.

### Watch for changes

While developing, you might want to use the following command to watch for changes:

	gulp watch

`gulp watch` will automatically build Lychee everytime you save a file.
