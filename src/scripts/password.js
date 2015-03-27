/**
 * @description	Controls the access to password-protected albums and photos.
 * @copyright   2014 by Tobias Reich
 */

var _pw = i18n.password;

password = {

	value: ''

}

password.get = function(albumID, callback) {

	var passwd = $('.message input.text').val(),
		params;

	if (!lychee.publicMode)												callback();
	else if (album.json&&album.json.password==false)					callback();
	else if (albums.json&&albums.json.content[albumID].password==false)	callback();
	else if (!albums.json&&!album.json) {

		// Continue without password
		album.json = {password: true};
		callback('');

	} else if (passwd==undefined) {

		// Request password
		password.getDialog(albumID, callback);

	} else {

		// Check password
		params = 'checkAlbumAccess&albumID=' + albumID + '&password=' + md5(passwd);
		lychee.api(params, function(data) {

			if (data===true) {
				password.value = md5(passwd);
				callback();
			} else {
				lychee.goto('');
				loadingBar.show('error', _pw.wrongPassword());
			}

		});

	}

}

password.getDialog = function(albumID, callback) {

	var buttons;

	buttons = [
		[_pw.enter(), function() { password.get(albumID, callback) }],
		[_pw.cancel(), lychee.goto]
	];
	modal.show("<a class='icon-lock'></a> " + _pw.enterPassword(),
	           _pw.protectedInfo() + ": <input class='text' type='password' placeholder='" + _pw.password() + "' value=''>",
	           buttons, -110, false);

}
