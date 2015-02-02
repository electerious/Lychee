/**
 * @description	Lets you change settings.
 * @copyright	2015 by Tobias Reich
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

		if (dbUser.length<1) {
			basicModal.error('dbUser');
			return false;
		}

		if (dbHost.length<1) dbHost = 'localhost';
		if (dbName.length<1) dbName = 'lychee';

		params = {
			dbName,
			dbUser,
			dbPassword,
			dbHost,
			dbTablePrefix
		}

		api.post('Database::createConfig', params, function(data) {

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

	msg =	`
			<p>
				Enter your database connection details below:
				<input data-name='dbHost' class='text' type='text' placeholder='Database Host (optional)' value=''>
				<input data-name='dbUser' class='text' type='text' placeholder='Database Username' value=''>
				<input data-name='dbPassword' class='text' type='password' placeholder='Database Password' value=''>
			</p>
			<p>
				Lychee will create its own database. If required, you can enter the name of an existing database instead:
				<input data-name='dbName' class='text' type='text' placeholder='Database Name (optional)' value=''>
				<input data-name='dbTablePrefix' class='text' type='text' placeholder='Table prefix (optional)' value=''>
			</p>
			`

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

	var action,
		msg = '';

	action = function(data) {

		var params,
			username = data.username,
			password = data.password;

		if (username.length<1) {
			basicModal.error('username');
			return false;
		}

		if (password.length<1) {
			basicModal.error('password');
			return false;
		}

		basicModal.close();

		params = {
			username,
			password: md5(password)
		}

		api.post('Settings::setLogin', params, function(data) {

			if (data!==true) {

				basicModal.show({
					body: '<p>Unable to save login. Please try again with another username and password!</p>',
					buttons: {
						action: {
							title: 'Retry',
							fn: settings.createLogin
						}
					}
				});

			}

		});

	}

	msg =	`
			<p>
				Enter a username and password for your installation:
				<input data-name='username' class='text' type='text' placeholder='New Username' value=''>
				<input data-name='password' class='text' type='password' placeholder='New Password' value=''>
			</p>
			`

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: 'Create Login',
				fn: action
			}
		}
	});

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

		params = {
			oldPassword: md5(oldPassword),
			username,
			password: md5(password)
		}

		api.post('Settings::setLogin', params, function(data) {

			if (data!==true) lychee.error(null, params, data);

		});

	}

	msg =	`
			<p>
				Enter your current password:
				<input data-name='oldPassword' class='text' type='password' placeholder='Current Password' value=''>
			</p>
			<p>
				Your username and password will be changed to the following:
				<input data-name='username' class='text' type='text' placeholder='New Username' value=''>
				<input data-name='password' class='text' type='password' placeholder='New Password' value=''>
			</p>
			`

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

	var sorting = [],
		action,
		msg = '';

	action = function() {

		var params;

		sorting[0] = $('.basicModal select#settings_type').val();
		sorting[1] = $('.basicModal select#settings_order').val();

		basicModal.close();
		albums.refresh();

		params = {
			type: sorting[0],
			order: sorting[1]
		}

		api.post('Settings::setSorting', params, function(data) {

			if (data===true) {
				lychee.sorting = 'ORDER BY ' + sorting[0] + ' ' + sorting[1];
				lychee.load();
			} else lychee.error(null, params, data);

		});

	}

	msg =	`
			<p>
				Sort photos by
				<select id='settings_type'>
					<option value='id'>Upload Time</option>
					<option value='takestamp'>Take Date</option>
					<option value='title'>Title</option>
					<option value='description'>Description</option>
					<option value='public'>Public</option>
					<option value='star'>Star</option>
					<option value='type'>Photo Format</option>
				</select>
				in an
				<select id='settings_order'>
					<option value='ASC'>Ascending</option>
					<option value='DESC'>Descending</option>
				</select>
				order.
			</p>
			`

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: 'Change Sorting',
				fn: action
			},
			cancel: {
				title: 'Cancel',
				fn: basicModal.close
			}
		}
	});

	if (lychee.sorting!=='') {

		sorting = lychee.sorting.replace('ORDER BY ', '').split(' ');

		$('.basicModal select#settings_type').val(sorting[0]);
		$('.basicModal select#settings_order').val(sorting[1]);

	}

}

settings.setDropboxKey = function(callback) {

	var action,
		msg = "";

	action = function(data) {

		var key = data.key;

		if (data.key.length<1) {
			basicModal.error('key');
			return false;
		}

		basicModal.close();

		api.post('Settings::setDropboxKey', { key }, function(data) {

			if (data===true) {
				lychee.dropboxKey = key;
				if (callback) lychee.loadDropbox(callback);
			} else lychee.error(null, params, data);

		});

	}

	msg =	`
			<p>
				In order to import photos from your Dropbox, you need a valid drop-ins app key from <a href='https://www.dropbox.com/developers/apps/create'>their website</a>. Generate yourself a personal key and enter it below:
				<input class='text' data-name='key' type='text' placeholder='Dropbox API Key' value='${ lychee.dropboxKey }'>
			</p>
			`

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: 'Set Dropbox Key',
				fn: action
			},
			cancel: {
				title: 'Cancel',
				fn: basicModal.close
			}
		}
	});

}