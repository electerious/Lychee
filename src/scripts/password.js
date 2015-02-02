/**
 * @description	Controls the access to password-protected albums and photos.
 * @copyright   2015 by Tobias Reich
 */

password = {

	value: ''

}

password.get = function(albumID, callback) {

	var passwd = $('.basicModal input.text').val(),
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

		params = {
			albumID,
			password: md5(passwd)
		}

		api.post('Album::getPublic', params, function(data) {

			if (data===true) {
				basicModal.close();
				password.value = md5(passwd);
				callback();
			} else {
				basicModal.error('password');
			}

		});

	}

}

password.getDialog = function(albumID, callback) {

	var action,
		cancel,
		msg = '';

	action = function() { password.get(albumID, callback) }

	cancel = function() {
		basicModal.close();
		lychee.goto();
	}

	msg =	`
			<p>
				This album is protected by a password. Enter the password below to view the photos of this album:
				<input data-name='password' class='text' type='password' placeholder='password' value=''>
			</p>
			`

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: 'Enter',
				fn: action
			},
			cancel: {
				title: 'Cancel',
				fn: cancel
			}
		}
	});

}