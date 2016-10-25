/**
 * @description Lets you change settings.
 */

settings = {}

settings.createConfig = function() {

	const action = function(data) {

		let dbName        = data.dbName        || ''
		let dbUser        = data.dbUser        || ''
		let dbPassword    = data.dbPassword    || ''
		let dbHost        = data.dbHost        || ''
		let dbTablePrefix = data.dbTablePrefix || ''

		if (dbUser.length<1) {
			basicModal.error('dbUser')
			return false
		}

		if (dbHost.length<1) dbHost = 'localhost'
		if (dbName.length<1) dbName = 'lychee'

		let params = {
			dbName,
			dbUser,
			dbPassword,
			dbHost,
			dbTablePrefix
		}

		api.post('Config::create', params, function(data) {

			if (data!==true) {

				// Connection failed
				if (data==='Warning: Connection failed!') {

					basicModal.show({
						body: '<p>Unable to connect to host database because access was denied. Double-check your host, username and password and ensure that access from your current location is permitted.</p>',
						buttons: {
							action: {
								title: 'Retry',
								fn: settings.createConfig
							}
						}
					})

					return false

				}

				// Creation failed
				if (data==='Warning: Creation failed!') {

					basicModal.show({
						body: '<p>Unable to create the database. Double-check your host, username and password and ensure that the specified user has the rights to modify and add content to the database.</p>',
						buttons: {
							action: {
								title: 'Retry',
								fn: settings.createConfig
							}
						}
					})

					return false

				}

				// Could not create file
				if (data==='Warning: Could not create file!') {

					basicModal.show({
						body: `<p>Unable to save this configuration. Permission denied in <b>'data/'</b>. Please set the read, write and execute rights for others in <b>'data/'</b> and <b>'uploads/'</b>. Take a look at the readme for more information.</p>`,
						buttons: {
							action: {
								title: 'Retry',
								fn: settings.createConfig
							}
						}
					})

					return false

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
				})

				return false

			} else {

				// Configuration successful
				window.location.reload()

			}

		})

	}

	let msg = `
	          <p>
	              Enter your database connection details below:
	              <input name='dbHost' class='text' type='text' placeholder='Database Host (optional)' value=''>
	              <input name='dbUser' class='text' type='text' placeholder='Database Username' value=''>
	              <input name='dbPassword' class='text' type='password' placeholder='Database Password' value=''>
	          </p>
	          <p>
	              Lychee will create its own database. If required, you can enter the name of an existing database instead:
	              <input name='dbName' class='text' type='text' placeholder='Database Name (optional)' value=''>
	              <input name='dbTablePrefix' class='text' type='text' placeholder='Table prefix (optional)' value=''>
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
	})

}

settings.createLogin = function() {

	const action = function(data) {

		let username = data.username
		let password = data.password

		if (username.length<1) {
			basicModal.error('username')
			return false
		}

		if (password.length<1) {
			basicModal.error('password')
			return false
		}

		basicModal.close()

		let params = {
			username,
			password
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
				})

			}

		})

	}

	let msg = `
	          <p>
	              Enter a username and password for your installation:
	              <input name='username' class='text' type='text' placeholder='New Username' value=''>
	              <input name='password' class='text' type='password' placeholder='New Password' value=''>
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
	})

}

settings.setLogin = function() {

	const action = function(data) {

		let oldPassword = data.oldPassword || ''
		let username    = data.username    || ''
		let password    = data.password    || ''

		if (oldPassword.length<1) {
			basicModal.error('oldPassword')
			return false
		}

		if (username.length<1) {
			basicModal.error('username')
			return false
		}

		if (password.length<1) {
			basicModal.error('password')
			return false
		}

		basicModal.close()

		let params = {
			oldPassword,
			username,
			password
		}

		api.post('Settings::setLogin', params, function(data) {

			if (data!==true) lychee.error(null, params, data)

		})

	}

	let msg = `
	          <p>
	              Enter your current password:
	              <input name='oldPassword' class='text' type='password' placeholder='Current Password' value=''>
	          </p>
	          <p>
	              Your username and password will be changed to the following:
	              <input name='username' class='text' type='text' placeholder='New Username' value=''>
	              <input name='password' class='text' type='password' placeholder='New Password' value=''>
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
	})

}

settings.setSorting = function() {

	let sortingPhotos = []
	let sortingAlbums = []

	const action = function() {

		sortingAlbums[0] = $('.basicModal select#settings_albums_type').val()
		sortingAlbums[1] = $('.basicModal select#settings_albums_order').val()

		sortingPhotos[0] = $('.basicModal select#settings_photos_type').val()
		sortingPhotos[1] = $('.basicModal select#settings_photos_order').val()

		basicModal.close()
		albums.refresh()

		let params = {
			typeAlbums  : sortingAlbums[0],
			orderAlbums : sortingAlbums[1],
			typePhotos  : sortingPhotos[0],
			orderPhotos : sortingPhotos[1]
		}

		api.post('Settings::setSorting', params, function(data) {

			if (data===true) {
				lychee.sortingAlbums = 'ORDER BY ' + sortingAlbums[0] + ' ' + sortingAlbums[1]
				lychee.sortingPhotos = 'ORDER BY ' + sortingPhotos[0] + ' ' + sortingPhotos[1]
				lychee.load()
			} else lychee.error(null, params, data)

		})

	}

	let msg = `
	          <p>
	              Sort albums by
	              <span class="select">
	                  <select id='settings_albums_type'>
	                      <option value='id'>Creation Time</option>
	                      <option value='title'>Title</option>
	                      <option value='description'>Description</option>
	                      <option value='public'>Public</option>
	                  </select>
	              </span>
	              in an
	              <span class="select">
	                  <select id='settings_albums_order'>
	                      <option value='ASC'>Ascending</option>
	                      <option value='DESC'>Descending</option>
	                  </select>
	              </span>
	              order.
	          </p>
	          <p>
	              Sort photos by
	              <span class="select">
	                  <select id='settings_photos_type'>
	                      <option value='id'>Upload Time</option>
	                      <option value='takestamp'>Take Date</option>
	                      <option value='title'>Title</option>
	                      <option value='description'>Description</option>
	                      <option value='public'>Public</option>
	                      <option value='star'>Star</option>
	                      <option value='type'>Photo Format</option>
	                  </select>
	              </span>
	              in an
	              <span class="select">
	                  <select id='settings_photos_order'>
	                      <option value='ASC'>Ascending</option>
	                      <option value='DESC'>Descending</option>
	                  </select>
	              </span>
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
	})

	if (lychee.sortingAlbums!=='') {

		sortingAlbums = lychee.sortingAlbums.replace('ORDER BY ', '').split(' ')

		$('.basicModal select#settings_albums_type').val(sortingAlbums[0])
		$('.basicModal select#settings_albums_order').val(sortingAlbums[1])

	}

	if (lychee.sortingPhotos!=='') {

		sortingPhotos = lychee.sortingPhotos.replace('ORDER BY ', '').split(' ')

		$('.basicModal select#settings_photos_type').val(sortingPhotos[0])
		$('.basicModal select#settings_photos_order').val(sortingPhotos[1])

	}

}

settings.setDropboxKey = function(callback) {

	const action = function(data) {

		let key = data.key

		if (data.key.length<1) {
			basicModal.error('key')
			return false
		}

		basicModal.close()

		api.post('Settings::setDropboxKey', { key }, function(data) {

			if (data===true) {
				lychee.dropboxKey = key
				if (callback) lychee.loadDropbox(callback)
			} else lychee.error(null, params, data)

		})

	}

	let msg = lychee.html`
	          <p>
	              In order to import photos from your Dropbox, you need a valid drop-ins app key from <a href='https://www.dropbox.com/developers/apps/create'>their website</a>. Generate yourself a personal key and enter it below:
	              <input class='text' name='key' type='text' placeholder='Dropbox API Key' value='$${ lychee.dropboxKey }'>
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
	})

}