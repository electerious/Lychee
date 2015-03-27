/**
 * @description	Lets you change settings.
 * @copyright	2014 by Tobias Reich
 */

var _s = i18n.settings;

settings = {}

settings.createConfig = function() {

	var dbName,
		dbUser,
		dbPassword,
		dbHost,
		dbTablePrefix,
		buttons,
		params;

	buttons = [
		[_s.connect(), function() {

			dbHost			= $('.message input.text#dbHost').val();
			dbUser			= $('.message input.text#dbUser').val();
			dbPassword		= $('.message input.text#dbPassword').val();
			dbName			= $('.message input.text#dbName').val();
			dbTablePrefix	= $('.message input.text#dbTablePrefix').val();

			if (dbHost.length<1) dbHost = 'localhost';
			if (dbName.length<1) dbName = 'lychee';

			params = 'dbCreateConfig&dbName=' + escape(dbName) + '&dbUser=' + escape(dbUser) + '&dbPassword=' + escape(dbPassword) + '&dbHost=' + escape(dbHost) + '&dbTablePrefix=' + escape(dbTablePrefix);
			lychee.api(params, function(data) {

				if (data!==true) {

					// Configuration failed
					setTimeout(function() {

						// Connection failed
						if (data.indexOf('Warning: Connection failed!')!==-1) {

							buttons = [
								[_s.retry(), function() { setTimeout(settings.createConfig, 400) }],
								['', function() {}]
							];
							modal.show(_s.connFailed(), _s.connFailedInfo(), buttons, null, false);
							return false;

						}

						// Creation failed
						if (data.indexOf('Warning: Creation failed!')!==-1) {

							buttons = [
								[_s.retry(), function() { setTimeout(settings.createConfig, 400) }],
								['', function() {}]
							];
							modal.show(_s.creationFailed(), _s.creationFailedInfo(), buttons, null, false);
							return false;

						}

						// Could not create file
						if (data.indexOf('Warning: Could not create file!')!==-1) {

							buttons = [
								[_s.retry(), function() { setTimeout(settings.createConfig, 400) }],
								['', function() {}]
							];
							modal.show(_s.savingFailed(), _s.savingFailedInfo(), buttons, null, false);
							return false;

						}

						// Something went wrong
						buttons = [
							[_s.retry(), function() { setTimeout(settings.createConfig, 400) }],
							['', function() {}]
						];
						modal.show(_s.configFailed(), _s.configFailedInfo(), buttons, null, false); return false;

					}, 400);

				} else {

					// Configuration successful
					window.location.reload();

				}

			});

		}],
		['', function() {}]
	];

	modal.show(_s.config(), _s.configEnter() + ": " +
	           "<input id='dbHost' class='text less' type='text' placeholder='" + _s.dbHost() + "' value=''>" +
	           "<input id='dbUser' class='text less' type='text' placeholder='" + _s.dbUser() + "' value=''>" +
	           "<input id='dbPassword' class='text more' type='password' placeholder='" + _s.dbPassword() + "' value=''><br>" +
	           _s.dbWillBeCreated() +
	           ":<input id='dbName' class='text less' type='text' placeholder='" + _s.dbName() + "' value=''>" +
	           "<input id='dbTablePrefix' class='text more' type='text' placeholder='" + _s.dbTablePrefix() +"' value=''>",
	           buttons, -235, false);

}

settings.createLogin = function() {

	var username,
		password,
		params,
		buttons;

	buttons = [
		[_s.createLogin(), function() {

			username = $('.message input.text#username').val();
			password = $('.message input.text#password').val();

			if (username.length<1||password.length<1) {

				setTimeout(function() {

					buttons = [
						[_s.retry(), function() { setTimeout(settings.createLogin, 400) }],
						['', function() {}]
					];
					modal.show(_s.wrongInput(), _s.wrongInputInfo(), buttons, null, false);
					return false;

				}, 400);

			} else {

				params = 'setLogin&username=' + escape(username) + '&password=' + md5(password);
				lychee.api(params, function(data) {

					if (data!==true) {

						setTimeout(function() {

							buttons = [
								[_s.retry(), function() { setTimeout(settings.createLogin, 400) }],
								['', function() {}]
							];
							modal.show(_s.creationFailed(), _s.loginCreationFailedInfo(), buttons, null, false);
							return false;

						}, 400);

					}

				});

			}

		}],
		['', function() {}]
	];

	modal.show(_s.createLogin(),
	           _s.loginEnter() + ": <input id='username' class='text less' type='text' placeholder='" + _s.newUsername() + "' value=''>" +
	           "<input id='password' class='text' type='password' placeholder='" + _s.newPassword() + "' value=''>",
	           buttons, -122, false);

}

settings.setLogin = function() {

	var old_password,
		username,
		password,
		params,
		buttons;

	buttons = [
		[_s.changeLogin(), function() {

			old_password	= $('.message input.text#old_password').val();
			username		= $('.message input.text#username').val();
			password		= $('.message input.text#password').val();

			if (old_password.length<1) {
				loadingBar.show('error', _s.wrongOldPassword());
				return false;
			}

			if (username.length<1) {
				loadingBar.show('error', _s.wrongNewUsername());
				return false;
			}

			if (password.length<1) {
				loadingBar.show('error', _s.wrongNewPassword());
				return false;
			}

			params = 'setLogin&oldPassword=' + md5(old_password) + '&username=' + escape(username) + '&password=' + md5(password);
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		[_s.cancel(), function() {}]
	];

	modal.show(_s.changeLogin(),
						 _s.oldPasswordEnter() + ": <input id='old_password' class='text more' type='password' placeholder='" + _s.oldPassword() + "' value=''><br>" +
						 _s.loginWillBeChangedTo() +
						 ": <input id='username' class='text less' type='text' placeholder='" + _s.newUsername() + "' value=''>" +
						 "<input id='password' class='text' type='password' placeholder='" + _s.newPassword() + "' value=''>",
						 buttons, -171);

}

settings.setSorting = function() {

	var buttons,
		sorting,
		params;

	buttons = [
		[_s.changeSorting(), function() {

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
		[_s.cancel(), function() {}]
	];

	modal.show(_s.changeSorting(),
	           _s.sortBy({
	           OPTIONS: "<select id='settings_type'> \
	                       <option value='id'>" + _s.sortId() + "</option> \
	                       <option value='takestamp'>" + _s.sortTakestamp() + "</option> \
	                       <option value='title'>" + _s.sortTitle() + "</option> \
	                       <option value='description'>" + _s.sortDescription() + "</option> \
	                       <option value='public'>" + _s.sortPublic() + "</option> \
	                       <option value='star'>" + _s.sortStar() +"</option> \
	                       <option value='type'>" + _s.sortType() + "</option> \
	                     </select>",
	           ORDER: "<select id='settings_order'> \
	                     <option value='ASC'>" + _s.sortAsc() + "</option> \
	                     <option value='DESC'>" + _s.sortDesc() + "</option> \
	                   </select>"
	           }),
	           buttons);

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
		[_s.setKey(), function() {

			key = $('.message input.text#key').val();

			params = 'setDropboxKey&key=' + key;
			lychee.api(params, function(data) {

				if (data===true) {
					lychee.dropboxKey = key;
					if (callback) lychee.loadDropbox(callback);
				} else lychee.error(null, params, data);

			});

		}],
		[_s.cancel(), function() {}]
	];

	modal.show(_s.setDropboxKey(),
	           _s.setDropboxKeyInfo({WEBSITE: "https://www.dropbox.com/developers/apps/create"}) +
	           ": <input id='key' class='text' type='text' placeholder='" + _s.dropboxKey() + "' value='" + lychee.dropboxKey + "'>",
	           buttons);

}
