/**
 * @description Takes care of every action an album can handle and execute.
 */

upload = {}

upload.show = function(title, files, callback) {

	basicModal.show({
		body: build.uploadModal(title, files),
		buttons: {
			action: {
				title: 'Close',
				class: 'hidden',
				fn: basicModal.close
			}
		},
		callback
	})

}

upload.notify = function(title, text) {

	if (text==null||text==='') text = 'You can now manage your new photo(s).'

	if (!window.webkitNotifications) return false

	if (window.webkitNotifications.checkPermission()!==0) window.webkitNotifications.requestPermission()

	if (window.webkitNotifications.checkPermission()===0 && title) {
		let popup = window.webkitNotifications.createNotification('', title, text)
		popup.show()
	}

}

upload.start = {

	local: function(files) {

		let albumID = album.getID()
		let error   = false
		let warning = false

		const process = function(files, file) {

			let formData          = new FormData()
			let xhr               = new XMLHttpRequest()
			let pre_progress      = 0
			let progress          = 0
			let next_file_started = false

			const finish = function() {

				window.onbeforeunload = null

				$('#upload_files').val('')

				if (error===false && warning===false) {

					// Success
					basicModal.close()
					upload.notify('Upload complete')

				} else if (error===false && warning===true) {

					// Warning
					$('.basicModal #basicModal__action.hidden').show()
					upload.notify('Upload complete')

				} else {

					// Error
					$('.basicModal #basicModal__action.hidden').show()
					upload.notify('Upload complete', 'Failed to upload one or more photos.')

				}

				albums.refresh()

				if (album.getID()===false) lychee.goto('0')
				else                       album.load(albumID)

			}

			formData.append('function', 'Photo::add')
			formData.append('albumID', albumID)
			formData.append(0, file)

			xhr.open('POST', api.path)

			xhr.onload = function() {

				let data      = null
				let wait      = false
				let errorText = ''

				const isNumber = (n) => (!isNaN(parseFloat(n)) && isFinite(n))

				try {
					data = JSON.parse(xhr.responseText)
				} catch(e) {
					data = ''
				}

				file.ready = true

				// Set status
				if (xhr.status===200 && isNumber(data)) {

					// Success
					$('.basicModal .rows .row:nth-child(' + (file.num + 1) + ') .status')
						.html('Finished')
						.addClass('success')

				} else {

					if (data.substr(0, 6)==='Error:') {

						errorText = data.substr(6) + ' Please take a look at the console of your browser for further details.'
						error     = true

						// Error Status
						$('.basicModal .rows .row:nth-child(' + (file.num + 1) + ') .status')
							.html('Failed')
							.addClass('error')

						// Throw error
						if (error===true) lychee.error('Upload failed. Server returned an error!', xhr, data)

					} else if (data.substr(0, 8)==='Warning:') {

						errorText = data.substr(8)
						warning   = true

						// Warning Status
						$('.basicModal .rows .row:nth-child(' + (file.num + 1) + ') .status')
							.html('Skipped')
							.addClass('warning')

						// Throw error
						if (error===true) lychee.error('Upload failed. Server returned a warning!', xhr, data)

					} else {

						errorText = 'Server returned an unknown response. Please take a look at the console of your browser for further details.'
						error     = true

						// Error Status
						$('.basicModal .rows .row:nth-child(' + (file.num + 1) + ') .status')
							.html('Failed')
							.addClass('error')

						// Throw error
						if (error===true) lychee.error('Upload failed. Server returned an unkown error!', xhr, data)

					}

					$('.basicModal .rows .row:nth-child(' + (file.num + 1) + ') p.notice')
						.html(errorText)
						.show()

				}

				// Check if there are file which are not finished
				for (let i = 0; i < files.length; i++) {

					if (files[i].ready===false) {
						wait = true
						break
					}

				}

				// Finish upload when all files are finished
				if (wait===false) finish()

			}

			xhr.upload.onprogress = function(e) {

				if (e.lengthComputable!==true) return false

				// Calculate progress
				progress = (e.loaded / e.total * 100 | 0)

				// Set progress when progress has changed
				if (progress>pre_progress) {
					$('.basicModal .rows .row:nth-child(' + (file.num+1) + ') .status').html(progress + '%')
					pre_progress = progress
				}

				if (progress>=100 && next_file_started===false) {

					// Scroll to the uploading file
					let scrollPos = 0
					if ((file.num + 1)>4) scrollPos = (file.num + 1 - 4) * 40
					$('.basicModal .rows').scrollTop(scrollPos)

					// Set status to processing
					$('.basicModal .rows .row:nth-child(' + (file.num + 1) + ') .status').html('Processing')

					// Upload next file
					if (file.next!=null) {
						process(files, file.next)
						next_file_started = true
					}

				}

			}

			xhr.send(formData)

		}

		if (files.length<=0) return false
		if (albumID===false || visible.albums()===true) albumID = 0

		for (let i = 0; i < files.length; i++) {

			files[i].num   = i
			files[i].ready = false

			if (i < files.length-1) files[i].next = files[i + 1]
			else                    files[i].next = null

		}

		window.onbeforeunload = function() { return 'Lychee is currently uploading!' }

		upload.show('Uploading', files, function() {

			// Upload first file
			process(files, files[0])

		})

	},

	url: function(url = '') {

		let albumID = album.getID()

		url = (typeof url === 'string' ? url : '')

		if (albumID===false) albumID = 0

		const action = function(data) {

			let files = []

			if (data.link && data.link.length>3) {

				basicModal.close()

				files[0] = {
					name: data.link
				}

				upload.show('Importing URL', files, function() {

					$('.basicModal .rows .row .status').html('Importing')

					let params = {
						url: data.link,
						albumID
					}

					api.post('Import::url', params, function(data) {

						// Same code as in import.dropbox()

						if (data!==true) {

							$('.basicModal .rows .row p.notice')
								.html('The import has been finished, but returned warnings or errors. Please take a look at the log (Settings -> Show Log) for further details.')
								.show()

							$('.basicModal .rows .row .status')
								.html('Finished')
								.addClass('warning')

							// Show close button
							$('.basicModal #basicModal__action.hidden').show()

							// Log error
							lychee.error(null, params, data)

						} else {

							basicModal.close()

						}

						upload.notify('Import complete')

						albums.refresh()

						if (album.getID()===false) lychee.goto('0')
						else                       album.load(albumID)

					})

				})

			} else basicModal.error('link')

		}

		basicModal.show({
			body: lychee.html`<p>Please enter the direct link to a photo to import it: <input class='text' name='link' type='text' placeholder='http://' value='$${ url }'></p>`,
			buttons: {
				action: {
					title: 'Import',
					fn: action
				},
				cancel: {
					title: 'Cancel',
					fn: basicModal.close
				}
			}
		})

	},

	server: function() {

		let albumID = album.getID()
		if (albumID===false) albumID = 0

		const action = function(data) {

			let files = []

			files[0] = {
				name: data.path
			}

			upload.show('Importing from server', files, function() {

				$('.basicModal .rows .row .status').html('Importing')

				let params = {
					albumID,
					path: data.path
				}

				api.post('Import::server', params, function(data) {

					albums.refresh()
					upload.notify('Import complete')

					if (data==='Notice: Import only contained albums!') {

						// No error, but the folder only contained albums

						// Go back to the album overview to show the imported albums
						if (visible.albums()) lychee.load()
						else                  lychee.goto()

						basicModal.close()

						return true

					} else if (data==='Warning: Folder empty or no readable files to process!') {

						// Error because the import could not start

						$('.basicModal .rows .row p.notice')
							.html('Folder empty or no readable files to process. Please take a look at the log (Settings -> Show Log) for further details.')
							.show()

						$('.basicModal .rows .row .status')
							.html('Failed')
							.addClass('error')

						// Log error
						lychee.error('Could not start import because the folder was empty!', params, data)

					} else if (data!==true) {

						// Maybe an error, maybe just some skipped photos

						$('.basicModal .rows .row p.notice')
							.html('The import has been finished, but returned warnings or errors. Please take a look at the log (Settings -> Show Log) for further details.')
							.show()

						$('.basicModal .rows .row .status')
							.html('Finished')
							.addClass('warning')

						// Log error
						lychee.error(null, params, data)

					} else {

						// No error, everything worked fine

						basicModal.close()

					}

					if (album.getID()===false) lychee.goto('0')
					else                       album.load(albumID)

					// Show close button
					$('.basicModal #basicModal__action.hidden').show()

				})

			})

		}

		basicModal.show({
			body: lychee.html`<p>This action will import all photos, folders and sub-folders which are located in the following directory. The <b>original files will be deleted</b> after the import when possible. <input class='text' name='path' type='text' maxlength='100' placeholder='Absolute path to directory' value='$${ lychee.location }uploads/import/'></p>`,
			buttons: {
				action: {
					title: 'Import',
					fn: action
				},
				cancel: {
					title: 'Cancel',
					fn: basicModal.close
				}
			}
		})

	},

	dropbox: function() {

		let albumID = album.getID()
		if (albumID===false) albumID = 0

		const success = function(files) {

			let links = ''

			for (let i = 0; i < files.length; i++) {

				links += files[i].link + ','

				files[i] = {
					name      : files[i].link
				}

			}

			// Remove last comma
			links = links.substr(0, links.length - 1)

			upload.show('Importing from Dropbox', files, function() {

				$('.basicModal .rows .row .status').html('Importing')

				let params = {
					url: links,
					albumID
				}

				api.post('Import::url', params, function(data) {

					// Same code as in import.url()

					if (data!==true) {

						$('.basicModal .rows .row p.notice')
							.html('The import has been finished, but returned warnings or errors. Please take a look at the log (Settings -> Show Log) for further details.')
							.show()

						$('.basicModal .rows .row .status')
							.html('Finished')
							.addClass('warning')

						// Show close button
						$('.basicModal #basicModal__action.hidden').show()

						// Log error
						lychee.error(null, params, data)

					} else {

						basicModal.close()

					}

					upload.notify('Import complete')

					albums.refresh()

					if (album.getID()===false) lychee.goto('0')
					else                       album.load(albumID)

				})

			})

		}

		lychee.loadDropbox(function() {
			Dropbox.choose({
				linkType: 'direct',
				multiselect: true,
				success
			})
		})

	}

}