/**
 * @name        Password Module
 * @description	Controls the access to password-protected albums and photos.
 * @author      Tobias Reich
 * @copyright   2014 by Tobias Reich
 */

password = {

	value: "",

	get: function(albumID, callback) {

		var passwd = $(".message input.text").val(),
			params;

		if (!lychee.publicMode) callback();
		else if (album.json&&album.json.password==false) callback();
		else if (albums.json&&albums.json.content[albumID].password==false) callback();
		else if (!albums.json&&!album.json) {

			// Continue without password
			album.json = {password: true};
			callback("");

		} else if (passwd==undefined) {

			// Request password
			password.getDialog(albumID, callback);

		} else {

			// Check password
			params = "checkAlbumAccess&albumID=" + albumID + "&password=" + md5(passwd);
			lychee.api(params, function(data) {

				if (data===true) {
					password.value = md5(passwd);
					callback();
				} else {
					lychee.goto("");
					loadingBar.show("error", "Access denied. Wrong password!");
				}

			});

		}

	},

	getDialog: function(albumID, callback) {

		var buttons;

		buttons = [
			["Enter", function() { password.get(albumID, callback) }],
			["Cancel", lychee.goto]
		];
		modal.show("<a class='icon-lock'></a> Enter Password", "This album is protected by a password. Enter the password below to view the photos of this album: <input class='text' type='password' placeholder='password' value=''>", buttons, -110, false);

	}

};