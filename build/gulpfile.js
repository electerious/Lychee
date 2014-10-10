var	gulp = require('gulp'),
	plugins = require("gulp-load-plugins")();

var paths = {
	view: [
		'bower_components/jQuery/dist/jquery.min.js',
		'bower_components/js-md5/js/md5.min.js',
		'bower_components/mousetrap/mousetrap.min.js',
		'bower_components/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js',
		'../assets/js/_frameworks.js',
		'../assets/js/build.js',
		'../assets/js/view/main.js'
	],
	js: [
		'bower_components/jQuery/dist/jquery.min.js',
		'bower_components/js-md5/js/md5.min.js',
		'bower_components/mousetrap/mousetrap.min.js',
		'bower_components/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js',
		'../assets/js/*.js'
	],
	css: [
		'../assets/scss/main.scss'
	]
}

var catchError = function(err) {

	console.log(err.toString());
	this.emit('end');

}

gulp.task('view', function() {

	gulp.src(paths.view)
		.pipe(plugins.concat('view.js', {newLine: "\n"}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest('../assets/min/'));

});

gulp.task('js', function() {

	gulp.src(paths.js)
		.pipe(plugins.concat('main.js', {newLine: "\n"}))
		.pipe(plugins.uglify())
		.on('error', catchError)
		.pipe(gulp.dest('../assets/min/'));

});

gulp.task('css', function() {

	gulp.src(paths.css)
		.pipe(plugins.sass())
		.on('error', catchError)
		.pipe(plugins.concat('main.css', {newLine: "\n"}))
		.pipe(plugins.autoprefixer('last 4 versions', '> 5%'))
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest('../assets/min/'));

});

gulp.task('default', ['view', 'js', 'css']);

gulp.task('watch', ['default'], function() {
	gulp.watch(paths.view, ['view']);
	gulp.watch(paths.js, ['js']);
	gulp.watch(paths.css, ['css']);
});