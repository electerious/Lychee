/**
 * @description	Lets you change settings.
 * @copyright	2014 by Tobias Reich
 */

settings = {}

settings.createConfig = function() {

	var msg = '',
		action;

	action = function(data) {

		var dbName			= data.dbName			|| '',
			dbUser			= data.dbUser			|| '',
			dbPassword		= data.dbPassword		|| '',
			dbHost			= data.dbHost			|| '',
			dbTablePrefix	= data.dbTablePrefix	|| '',
			params;

		if (dbHost.length<1) dbHost = 'localhost';
		if (dbName.length<1) dbName = 'lychee';

		params = 'dbCreateConfig&dbName=' + escape(dbName) + '&dbUser=' + escape(dbUser) + '&dbPassword=' + escape(dbPassword) + '&dbHost=' + escape(dbHost) + '&dbTablePrefix=' + escape(dbTablePrefix);
		lychee.api(params, function(data) {

			if (data!==true) {

				// Connection failed
				if (data.indexOf('Warning: Connection failed!')!==-1) {

					basicModal.show({
						body: '<p>Unable to connect to host database because access was denied. Double-check your host, username and password and ensure that access from your current location is permitted.</p>',
						buttons: {
							action: {
								title: 'Retry',
								fn: settings.createConfig
							}
						}
					});

					return false;

				}

				// Creation failed
				if (data.indexOf('Warning: Creation failed!')!==-1) {

					basicModal.show({
						body: '<p>Unable to create the database. Double-check your host, username and password and ensure that the specified user has the rights to modify and add content to the database.</p>',
						buttons: {
							action: {
								title: 'Retry',
								fn: settings.createConfig
							}
						}
					});

					return false;

				}

				// Could not create file
				if (data.indexOf('Warning: Could not create file!')!==-1) {

					basicModal.show({
						body: "<p>Unable to save this configuration. Permission denied in <b>'data/'</b>. Please set the read, write and execute rights for others in <b>'data/'</b> and <b>'uploads/'</b>. Take a look at the readme for more information.</p>",
						buttons: {
							action: {
								title: 'Retry',
								fn: settings.createConfig
							}
						}
					});

					return false;

				}

				// Something went wrong
				basicModal.show({
					body: '<p>Something unexpected happened. Please try again and check your installation and server. Take a look at the readme for more information.</p>',
					buttons: {
						action: {
							title: 'Retry',
							fn: settings.createConfig
						}
					}
				});

				return false;

			} else {

				// Configuration successful
				window.location.reload();

			}

		});

	}

	msg	+= "<p>Enter your database connection details below:";
	msg += "<input data-name='dbHost' class='text' type='text' placeholder='Database Host (optional)' value=''>";
	msg += "<input data-name='dbUser' class='text' type='text' placeholder='Database Username' value=''>";
	msg += "<input data-name='dbPassword' class='text' type='password' placeholder='Database Password' value=''>";
	msg += "</p>";
	msg += "<p>Lychee will create its own database. If required, you can enter the name of an existing database instead:";
	msg += "<input data-name='dbName' class='text' type='text' placeholder='Database Name (optional)' value=''>";
	msg += "<input data-name='dbTablePrefix' class='text' type='text' placeholder='Table prefix (optional)' value=''>";
	msg += "</p>";

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: 'Connect',
				fn: action
			}
		}
	});

}

settings.createLogin = function() {

	var username,
		password,
		params,
		buttons;

	buttons = [
		['Create Login', function() {

			username = $('.message input.text#username').val();
			password = $('.message input.text#password').val();

			if (username.length<1||password.length<1) {

				setTimeout(function() {

					buttons = [
						['Retry', function() { setTimeout(settings.createLogin, 400) }],
						['', function() {}]
					];
					modal.show('Wrong Input', 'The username or password you entered is not long enough. Please try again with another username and password!', buttons, null, false);
					return false;

				}, 400);

			} else {

				params = 'setLogin&username=' + escape(username) + '&password=' + md5(password);
				lychee.api(params, function(data) {

					if (data!==true) {

						setTimeout(function() {

							buttons = [
								['Retry', function() { setTimeout(settings.createLogin, 400) }],
								['', function() {}]
							];
							modal.show('Creation Failed', 'Unable to save login. Please try again with another username and password!', buttons, null, false);
							return false;

						}, 400);

					}

				});

			}

		}],
		['', function() {}]
	];

	modal.show('Create Login', "Enter a username and password for your installation: <input id='username' class='text less' type='text' placeholder='New Username' value=''><input id='password' class='text' type='password' placeholder='New Password' value=''>", buttons, -122, false);

}

settings.setLogin = function() {

	var msg = '',
		action;

	action = function(data) {

		var oldPassword		= data.oldPassword	|| '',
			username		= data.username		|| '',
			password		= data.password		|| '',
			params;

		if (oldPassword.length<1) {
			basicModal.error('oldPassword');
			return false;
		}

		if (username.length<1) {
			basicModal.error('username');
			return false;
		}

		if (password.length<1) {
			basicModal.error('password');
			return false;
		}

		basicModal.close();

		params = 'setLogin&oldPassword=' + md5(oldPassword) + '&username=' + escape(username) + '&password=' + md5(password);
		lychee.api(params, function(data) {

			if (data!==true) lychee.error(null, params, data);

		});

	}

	msg += "<p>Enter your current password:";
	msg += "<input data-name='oldPassword' class='text' type='password' placeholder='Current Password' value=''>";
	msg += "</p>"
	msg += "<p>Your username and password will be changed to the following:";
	msg += "<input data-name='username' class='text' type='text' placeholder='New Username' value=''>";
	msg += "<input data-name='password' class='text' type='password' placeholder='New Password' value=''>";
	msg += "</p>";

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: 'Change Login',
				fn: action
			},
			cancel: {
				title: 'Cancel',
				fn: basicModal.close
			}
		}
	});

}

settings.setSorting = function() {

	var buttons,
		sorting,
		params;

	buttons = [
		['Change Sorting', function() {

			sorting[0] = $('select#settings_type').val();
			sorting[1] = $('select#settings_order').val();

			albums.refresh();

			params = 'setSorting&type=' + sorting[0] + '&order=' + sorting[1];
			lychee.api(params, function(data) {

				if (data===true) {
					lychee.sorting = 'ORDER BY ' + sorting[0] + ' ' + sorting[1];
					lychee.load();
				} else lychee.error(null, params, data);

			});

		}],
		['Cancel', function() {}]
	];

	modal.show('Change Sorting',
		"Sort photos by \
			<select id='settings_type'> \
				<option value='id'>Upload Time</option> \
				<option value='takestamp'>Take Date</option> \
				<option value='title'>Title</option> \
				<option value='description'>Description</option> \
				<option value='public'>Public</option> \
				<option value='star'>Star</option> \
				<option value='type'>Photo Format</option> \
			</select> \
			in an \
			<select id='settings_order'> \
				<option value='ASC'>Ascending</option> \
				<option value='DESC'>Descending</option> \
			</select> \
			order.\
		", buttons);

	if (lychee.sorting!=='') {

		sorting = lychee.sorting.replace('ORDER BY ', '').split(' ');

		$('select#settings_type').val(sorting[0]);
		$('select#settings_order').val(sorting[1]);

	}

}

settings.setDropboxKey = function(callback) {

	var buttons,
		params,
		key;

	buttons = [
		['Set Key', function() {

			key = $('.message input.text#key').val();

			params = 'setDropboxKey&key=' + key;
			lychee.api(params, function(data) {

				if (data===true) {
					lychee.dropboxKey = key;
					if (callback) lychee.loadDropbox(callback);
				} else lychee.error(null, params, data);

			});

		}],
		['Cancel', function() {}]
	];

	modal.show('Set Dropbox Key', "In order to import photos from your Dropbox, you need a valid drop-ins app key from <a href='https://www.dropbox.com/developers/apps/create'>their website</a>. Generate yourself a personal key and enter it below: <input id='key' class='text' type='text' placeholder='Dropbox API Key' value='" + lychee.dropboxKey + "'>", buttons);

}