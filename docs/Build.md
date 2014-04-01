### Dependencies

First you have to install the following dependencies:

- `node` [Node.js](http://nodejs.org) v0.10 or later
- `npm` [Node Packaged Modules](https://www.npmjs.org)
- `bower` [Bower](http://bower.io)
- `grunt` [Grunt](http://gruntjs.com)

After [installing Node.js](http://nodejs.org) you can use the included `npm` package manager to install the global requirements with the following command:

	npm install -g bower grunt-cli
	
### Build

The Gruntfile is located in `build/` and can be easily executed using the `grunt` command.
	
### Watch for changes

While developing, you might want to use the following command to watch for changes in `assets/js/` and `assets/css/`:

	grunt watch
	
`grunt` will automatically build Lychee, everytime you save a file.