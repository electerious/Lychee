/**
 * @name		Settings Module
 * @description	Lets you change settings.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

var settings = {

	createConfig: function() {

		var dbName,
			dbUser,
			dbPassword,
			dbHost,
			buttons;

		buttons = [
			["Connect", function() {

				dbHost = $(".message input.text#dbHost").val();
				dbUser = $(".message input.text#dbUser").val();
				dbPassword = $(".message input.text#dbPassword").val();
				dbName = $(".message input.text#dbName").val();

				if (dbHost.length<1) dbHost = "localhost";
				if (dbName.length<1) dbName = "lychee";

				params = "createConfig&dbName=" + escape(dbName) + "&dbUser=" + escape(dbUser) + "&dbPassword=" + escape(dbPassword) + "&dbHost=" + escape(dbHost);
				lychee.api(params, function(data) {

					if (data!==true) {

						// Configuration failed
						setTimeout(function() {

							// Connection failed
							if (data.indexOf("Warning: Connection failed!")!==-1) {

								buttons = [
									["Retry", function() { setTimeout(settings.createConfig, 400) }],
									["", function() {}]
								];
								modal.show("Connection Failed", "Unable to connect to host database because access was denied. Double-check your host, username and password and ensure that access from your current location is permitted.", buttons, null, false);
								return false;

							}

							// Could not create file
							if (data.indexOf("Warning: Could not create file!")!==-1) {

								buttons = [
									["Retry", function() { setTimeout(settings.createConfig, 400) }],
									["", function() {}]
								];
								modal.show("Saving Failed", "Unable to save this configuration. Permission denied in <b>'php/'</b>. Please set the read, write and execute rights for others in <b>'php/'</b> and <b>'uploads/'</b>. Take a look the readme for more information.", buttons, null, false);
								return false;

							}

							// Something went wrong
							buttons = [
								["Retry", function() { setTimeout(settings.createConfig, 400) }],
								["", function() {}]
							];
							modal.show("Configuration Failed", "Something unexpected happened. Please try again and check your installation and server. Take a look the readme for more information.", buttons, null, false);
							return false;

						}, 400);

					} else {

						// Configuration successful
						lychee.api("update", function(data) { window.location.reload() });

					}

				});

			}],
			["", function() {}]
		];
		modal.show("Configuration", "Enter your database connection details below: <input id='dbHost' class='text less' type='text' placeholder='Host (optional)' value=''><input id='dbUser' class='text less' type='text' placeholder='Username' value=''><input id='dbPassword' class='text more' type='password' placeholder='Password' value=''><br>Lychee will create its own database. If required, you can enter the name of an existing database instead:<input id='dbName' class='text more' type='text' placeholder='Database (optional)' value=''>", buttons, -215, false);

	},

	createLogin: function() {

		var username,
			password,
			params,
			buttons;

		buttons = [
			["Create Login", function() {

				username = $(".message input.text#username").val();
				password = $(".message input.text#password").val();

				if (username.length<1||password.length<1) {

					setTimeout(function() {

						buttons = [
							["Retry", function() { setTimeout(settings.createLogin, 400) }],
							["", function() {}]
						];
						modal.show("Wrong Input", "The username or password you entered is not long enough. Please try again with another username and password!", buttons, null, false);
						return false;

					}, 400);

				} else {

					params = "setLogin&username=" + escape(username) + "&password=" + hex_md5(password);
					lychee.api(params, function(data) {

						if (data!==true) {

							setTimeout(function() {

								buttons = [
									["Retry", function() { setTimeout(settings.createLogin, 400) }],
									["", function() {}]
								];
								modal.show("Creation Failed", "Unable to save login. Please try again with another username and password!", buttons, null, false);
								return false;

							}, 400);

						}

					});

				}

			}],
			["", function() {}]
		];
		modal.show("Create Login", "Enter a username and password for your installation: <input id='username' class='text less' type='text' placeholder='New Username' value=''><input id='password' class='text' type='password' placeholder='New Password' value=''>", buttons, -122, false);

	},

	setLogin: function() {

		var old_password,
			username,
			password,
			params,
			buttons;

		buttons = [
			["Change Login", function() {

				old_password = $(".message input.text#old_password").val();
				username = $(".message input.text#username").val();
				password = $(".message input.text#password").val();

				if (old_password.length<1) {
					loadingBar.show("error", "Your old password was entered incorrectly. Please try again!");
					return false;
				}

				if (username.length<1) {
					loadingBar.show("error", "Your new username was entered incorrectly. Please try again!");
					return false;
				}

				if (password.length<1) {
					loadingBar.show("error", "Your new password was entered incorrectly. Please try again!");
					return false;
				}

				params = "setLogin&oldPassword=" + hex_md5(old_password) + "&username=" + escape(username) + "&password=" + hex_md5(password);
				lychee.api(params, function(data) {

					if (data!==true) lychee.error(null, params, data);

				});

			}],
			["Cancel", function() {}]
		];
		modal.show("Change Login", "Enter your current password: <input id='old_password' class='text more' type='password' placeholder='Current Password' value=''><br>Your username and password will be changed to the following: <input id='username' class='text less' type='text' placeholder='New Username' value=''><input id='password' class='text' type='password' placeholder='New Password' value=''>", buttons, -171);

	},

	setSorting: function() {

		var buttons,
			sorting;

		buttons = [
			["Change Sorting", function() {

				sorting[0] = $("select#settings_type").val();
				sorting[1] = $("select#settings_order").val();

				params = "setSorting&type=" + sorting[0] + "&order=" + sorting[1];
				lychee.api(params, function(data) {

					if (data===true) {
						lychee.sorting = "ORDER BY " + sorting[0] + " " + sorting[1];
						lychee.load();
					} else lychee.error(null, params, data);

				});

			}],
			["Cancel", function() {}]
		];
		modal.show("Change Sorting",
			"Sort photos by \
				<select id='settings_type'> \
					<option value='id'>Upload Time</option> \
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

		if (lychee.sorting!="") {
			sorting = lychee.sorting.replace("ORDER BY ", "").replace(" ", ";").split(";");
			$("select#settings_type").val(sorting[0]);
			$("select#settings_order").val(sorting[1]);
		}

	}

}