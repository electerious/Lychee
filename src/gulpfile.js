var	gulp = require('gulp'),
	plugins = require("gulp-load-plugins")(),
	paths = {}

/* Error Handler -------------------------------- */

var catchError = function(err) {

	console.log(err.toString());
	this.emit('end');

}

/* View ----------------------------------------- */

paths.view = {
	js: [
		'bower_components/jQuery/dist/jquery.min.js',
		'bower_components/js-md5/js/md5.min.js',
		'bower_components/mousetrap/mousetrap.min.js',
		'bower_components/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js',
		'../src/scripts/_frameworks.js',
		'../src/scripts/view/main.js'
	],
	coffee: [
		'../src/scripts/build.coffee'
	],
	scripts: [
		'../dist/_view--javascript.js',
		'../dist/_view--coffee.js'
	]
}

gulp.task('view--js', function() {

	return	gulp.src(paths.view.js)
				.pipe(plugins.concat('_view--javascript.js', {newLine: "\n"}))
				.pipe(gulp.dest('../dist/'));

});

gulp.task('view--coffee', function() {

	return	gulp.src(paths.view.coffee)
				.pipe(plugins.coffee({bare: true}))
				.on('error', catchError)
				.pipe(plugins.concat('_view--coffee.js', {newLine: "\n"}))
				.pipe(gulp.dest('../dist/'));

});

gulp.task('view--scripts', ['view--js', 'view--coffee'], function() {

	return	gulp.src(paths.view.scripts)
				.pipe(plugins.concat('view.js', {newLine: "\n"}))
				.pipe(plugins.uglify())
				.on('error', catchError)
				.pipe(gulp.dest('../dist/'));

});

/* Main ----------------------------------------- */

paths.main = {
	js: [
		'bower_components/jQuery/dist/jquery.min.js',
		'bower_components/js-md5/js/md5.min.js',
		'bower_components/mousetrap/mousetrap.min.js',
		'bower_components/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js',
		'../src/scripts/*.js'
	],
	coffee: [
		'../src/scripts/*.coffee'
	],
	scripts: [
		'../dist/_main--javascript.js',
		'../dist/_main--coffee.js'
	],
	scss: [
		'../src/styles/*.scss'
	],
	styles: [
		'../src/styles/main.scss'
	]
}

gulp.task('main--js', function() {

	return	gulp.src(paths.main.js)
				.pipe(plugins.concat('_main--javascript.js', {newLine: "\n"}))
				.pipe(gulp.dest('../dist/'));

});

gulp.task('main--coffee', function() {

	return	gulp.src(paths.main.coffee)
				.pipe(plugins.coffee({bare: true}))
				.on('error', catchError)
				.pipe(plugins.concat('_main--coffee.js', {newLine: "\n"}))
				.pipe(gulp.dest('../dist/'));

});

gulp.task('main--scripts', ['main--js', 'main--coffee'], function() {

	return	gulp.src(paths.main.scripts)
				.pipe(plugins.concat('main.js', {newLine: "\n"}))
				.pipe(plugins.uglify())
				.on('error', catchError)
				.pipe(gulp.dest('../dist/'));

});

gulp.task('main--styles', function() {

	return	gulp.src(paths.main.styles)
				.pipe(plugins.sass())
				.on('error', catchError)
				.pipe(plugins.concat('main.css', {newLine: "\n"}))
				.pipe(plugins.autoprefixer('last 4 versions', '> 5%'))
				.pipe(plugins.minifyCss())
				.pipe(gulp.dest('../dist/'));

});

/* Clean ----------------------------------------- */

gulp.task('clean', function() {

	return	gulp.src('../dist/_*.*', { read: false })
				.pipe(plugins.rimraf({ force: true }))
				.on('error', catchError);

});

/* Tasks ----------------------------------------- */

gulp.task('default', ['view--scripts', 'main--scripts', 'main--styles', 'clean']);

gulp.task('watch', ['default'], function() {

	gulp.watch(paths.view.js,		['view--scripts', 'clean']);
	gulp.watch(paths.view.coffee,	['view--scripts', 'clean']);

	gulp.watch(paths.main.js,		['main--scripts', 'clean']);
	gulp.watch(paths.main.coffee,	['main--scripts', 'clean']);
	gulp.watch(paths.main.scss,		['main--styles', 'clean']);

});