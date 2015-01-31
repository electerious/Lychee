var	gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	paths = {};

/* Error Handler -------------------------------- */

var catchError = function(err) {

	console.log(err.toString());
	this.emit('end');

}

/* View ----------------------------------------- */

paths.view = {
	js: [
		'../src/scripts/_gup.js',
		'../src/scripts/build.js',
		'../src/scripts/view/main.js'
	],
	scripts: [
		'bower_components/jQuery/dist/jquery.min.js',
		'../dist/_view--javascript.js'
	]
}

gulp.task('view--js', function() {

	var stream =
		gulp.src(paths.view.js)
			.pipe(plugins['6to5']())
			.on('error', catchError)
			.pipe(plugins.concat('_view--javascript.js', {newLine: "\n"}))
			.pipe(gulp.dest('../dist/'));

	return stream;

});

gulp.task('view--scripts', ['view--js'], function() {

	var stream =
		gulp.src(paths.view.scripts)
			.pipe(plugins.concat('view.js', {newLine: "\n"}))
			.pipe(plugins.uglify())
			.on('error', catchError)
			.pipe(gulp.dest('../dist/'));

	return stream;

});

/* Main ----------------------------------------- */

paths.main = {
	js: [
		'../src/scripts/*.js'
	],
	scripts: [
		'bower_components/jQuery/dist/jquery.min.js',
		'bower_components/js-md5/js/md5.min.js',
		'bower_components/mousetrap/mousetrap.min.js',
		'bower_components/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js',
		'bower_components/basicContext/dist/basicContext.min.js',
		'bower_components/basicModal/dist/basicModal.min.js',
		'../dist/_main--javascript.js'
	],
	scss: [
		'../src/styles/*.scss'
	],
	styles: [
		'bower_components/basicContext/src/styles/main.scss',
		'bower_components/basicModal/src/styles/main.scss',
		'../src/styles/main.scss'
	]
}

gulp.task('main--js', function() {

	var stream =
		gulp.src(paths.main.js)
			.pipe(plugins['6to5']())
			.on('error', catchError)
			.pipe(plugins.concat('_main--javascript.js', {newLine: "\n"}))
			.pipe(gulp.dest('../dist/'));

	return stream;

});

gulp.task('main--scripts', ['main--js'], function() {

	var stream =
		gulp.src(paths.main.scripts)
			.pipe(plugins.concat('main.js', {newLine: "\n"}))
			.pipe(plugins.uglify())
			.on('error', catchError)
			.pipe(gulp.dest('../dist/'));

	return stream;

});

gulp.task('main--styles', function() {

	var stream =
		gulp.src(paths.main.styles)
			.pipe(plugins.sass())
			.on('error', catchError)
			.pipe(plugins.concat('main.css', {newLine: "\n"}))
			.pipe(plugins.autoprefixer('last 4 versions', '> 5%'))
			.pipe(plugins.minifyCss())
			.pipe(gulp.dest('../dist/'));

	return stream;

});

/* Clean ----------------------------------------- */

gulp.task('clean', function() {

	var stream =
		gulp.src('../dist/_*.*', { read: false })
			.pipe(plugins.rimraf({ force: true }))
			.on('error', catchError);

	return stream;

});

/* Tasks ----------------------------------------- */

gulp.task('default', ['view--scripts', 'main--scripts', 'main--styles'], function() {

	gulp.start('clean');

});

gulp.task('watch', ['default'], function() {

	gulp.watch(paths.view.js,		['view--scripts']);

	gulp.watch(paths.main.js,		['main--scripts']);
	gulp.watch(paths.main.scss,		['main--styles']);

});