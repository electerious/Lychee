var	gulp    = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	paths   = {}

/* Error Handler -------------------------------- */

var catchError = function(err) {

	console.log(err.toString())
	this.emit('end')

}

/* View ----------------------------------------- */

paths.view = {
	php: [
		'../view.php'
	],
	js: [
		'./scripts/_gup.js',
		'./scripts/build.js',
		'./scripts/api.js',
		'./scripts/header.js',
		'./scripts/visible.js',
		'./scripts/sidebar.js',
		'./scripts/view/main.js'
	],
	scripts: [
		'node_modules/jquery/dist/jquery.min.js',
		'../dist/_view--javascript.js'
	],
	svg: [
		'./images/iconic.svg',
		'./images/ionicons.svg'
	]
}

gulp.task('view--js', function() {

	var babel = plugins.babel({
		presets: ['es2015']
	})

	return gulp.src(paths.view.js)
	           .pipe(plugins.concat('_view--javascript.js', {newLine: "\n"}))
	           .pipe(babel)
	           .on('error', catchError)
	           .pipe(gulp.dest('../dist/'))

})

gulp.task('view--scripts', ['view--js'], function() {

	return gulp.src(paths.view.scripts)
	           .pipe(plugins.concat('view.js', {newLine: "\n"}))
	           .pipe(plugins.uglify())
	           .on('error', catchError)
	           .pipe(gulp.dest('../dist/'))

})

gulp.task('view--svg', function() {

	return gulp.src(paths.view.php)
	           .pipe(plugins.inject(gulp.src(paths.view.svg), {
	           	starttag: '<!-- inject:svg -->',
	           	transform: function(filePath, file) { return file.contents.toString('utf8') }
	           }))
	           .pipe(gulp.dest('../'))

 })

/* Main ----------------------------------------- */

paths.main = {
	html: [
		'../index.html'
	],
	js: [
		'./scripts/*.js'
	],
	scripts: [
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/mousetrap/mousetrap.min.js',
		'node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js',
		'node_modules/basiccontext/dist/basicContext.min.js',
		'node_modules/basicmodal/dist/basicModal.min.js',
		'../dist/_main--javascript.js'
	],
	scss: [
		'./styles/*.scss'
	],
	styles: [
		'node_modules/basiccontext/src/styles/main.scss',
		'node_modules/basiccontext/src/styles/addons/popin.scss',
		'node_modules/basicmodal/src/styles/main.scss',
		'./styles/main.scss'
	],
	svg: [
		'./images/iconic.svg',
		'./images/ionicons.svg'
	]
}

gulp.task('main--js', function() {

	var babel = plugins.babel({
		presets: ['es2015']
	})

	return gulp.src(paths.main.js)
	           .pipe(plugins.concat('_main--javascript.js', {newLine: "\n"}))
	           .pipe(babel)
	           .on('error', catchError)
	           .pipe(gulp.dest('../dist/'))

})

gulp.task('main--scripts', ['main--js'], function() {

	return gulp.src(paths.main.scripts)
	           .pipe(plugins.concat('main.js', {newLine: "\n"}))
	           .pipe(plugins.uglify())
	           .on('error', catchError)
	           .pipe(gulp.dest('../dist/'))

})

gulp.task('main--styles', function() {

	return gulp.src(paths.main.styles)
	           .pipe(plugins.sass())
	           .on('error', catchError)
	           .pipe(plugins.concat('main.css', {newLine: "\n"}))
	           .pipe(plugins.autoprefixer('last 4 versions', '> 5%'))
	           .pipe(plugins.minifyCss())
	           .pipe(gulp.dest('../dist/'))

})

gulp.task('main--svg', function() {

	return gulp.src(paths.main.html)
	           .pipe(plugins.inject(gulp.src(paths.main.svg), {
	           	starttag: '<!-- inject:svg -->',
	           	transform: function(filePath, file) { return file.contents.toString('utf8') }
	           }))
	           .pipe(gulp.dest('../'))

 })

/* Clean ----------------------------------------- */

gulp.task('clean', function() {

	return gulp.src('../dist/_*.*', { read: false })
	           .pipe(plugins.rimraf({ force: true }))
	           .on('error', catchError)

})

/* Tasks ----------------------------------------- */

gulp.task('default', ['view--svg', 'view--scripts', 'main--svg', 'main--scripts', 'main--styles'], function() {

	gulp.start('clean')

})

gulp.task('watch', ['default'], function() {

	gulp.watch(paths.view.js, ['view--scripts'])

	gulp.watch(paths.main.js, ['main--scripts'])
	gulp.watch(paths.main.scss, ['main--styles'])

})