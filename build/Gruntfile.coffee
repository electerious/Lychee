module.exports = (grunt) ->

	grunt.initConfig

		pkg: grunt.file.readJSON 'package.json'

		concat:

			view:

				options:
					separator: "\n"
				src: [
					'bower_components/jQuery/dist/jquery.min.js'
					'bower_components/js-md5/js/md5.min.js'
					'bower_components/mousetrap/mousetrap.min.js'
					'bower_components/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js'
					'../assets/js/_frameworks.js'
					'../assets/js/build.js'
					'../assets/js/view/main.js'
				]
				dest: '../assets/min/view.js'

			js:
				options:
					separator: "\n"
				src: [
					'bower_components/jQuery/dist/jquery.min.js'
					'bower_components/js-md5/js/md5.min.js'
					'bower_components/mousetrap/mousetrap.min.js'
					'bower_components/mousetrap/plugins/global-bind/mousetrap-global-bind.min.js'
					'../assets/js/*.js'
				]
				dest: '../assets/min/main.js'

			css:
				options:
					separator: "\n"
				src: [
					'../assets/css/*.css'
				]
				dest: '../assets/min/main.css'

		uglify:

			view:
				options:
					banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
				files:
					'../assets/min/view.js': '../assets/min/view.js'

			assets:
				options:
					banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
				files:
					'../assets/min/main.js': '../assets/min/main.js'

		cssmin:

			assets:
				options:
					banner: '/*! <%= pkg.name %> <%= pkg.version %> */'
				files:
					'../assets/min/main.css': '../assets/min/main.css'

		watch:

			js:
				files: [
					'../assets/js/*.js'
				]
				tasks: ['js']
				options:
					spawn: false
					interrupt: true

			css:
				files: [
					'../assets/css/*.css'
				]
				tasks: ['css']
				options:
					spawn: false
					interrupt: true

	require('load-grunt-tasks')(grunt)

	grunt.registerTask 'default', ->
		grunt.task.run [
			'view'
			'js'
			'css'
		]

	grunt.registerTask 'view', [
		'concat:view'
		'uglify:view'
	]

	grunt.registerTask 'js', [
		'concat:js'
		'uglify:assets'
	]

	grunt.registerTask 'css', [
		'concat:css'
		'cssmin:assets'
	]