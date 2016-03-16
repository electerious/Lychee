### Dependencies

First you have to install the following dependencies:

- `node` [Node.js](http://nodejs.org) v5.7.0 or later
- `npm` [Node Packaged Modules](https://www.npmjs.org)

After [installing Node.js](http://nodejs.org) you can use the included `npm` package manager to download all dependencies:

	cd src/
	npm install

### Build

The Gulpfile is located in `src/` and can be executed using the `npm run compile` command.

### Watch for changes

While developing, you might want to use the following command to automatically build Lychee everytime you save a file:

	npm start