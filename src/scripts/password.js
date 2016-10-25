/**
 * @description Controls the access to password-protected albums and photos.
 */

password = {

	value: ''

}

password.get = function(albumID, callback) {

	if (lychee.publicMode===false)                                  callback()
	else if (album.json && album.json.password==='0')               callback()
	else if (albums.json && albums.getByID(albumID).password==='0') callback()
	else if (!albums.json && !album.json) {

		// Continue without password

		album.json = { password: true }
		callback('')

	} else {

		// Request password

		password.getDialog(albumID, callback)

	}

}

password.getDialog = function(albumID, callback) {

	const action = (data) => {

		let passwd = data.password

		let params = {
			albumID,
			password: passwd
		}

		api.post('Album::getPublic', params, function(data) {

			if (data===true) {
				basicModal.close()
				password.value = passwd
				callback()
			} else {
				basicModal.error('password')
			}

		})

	}

	const cancel = () => {

		basicModal.close()
		if (!visible.albums()) lychee.goto()

	}

	let msg = `
	          <p>
	              This album is protected by a password. Enter the password below to view the photos of this album:
	              <input name='password' class='text' type='password' placeholder='password' value=''>
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
	})

}