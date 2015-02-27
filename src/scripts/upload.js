/**
 * @description	Takes care of every action an album can handle and execute.
 * @copyright	2015 by Tobias Reich
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
	});

}

upload.notify = function(title, text) {

	var popup;

	if (!text||text==='') text = 'You can now manage your new photo(s).';

	if (!window.webkitNotifications) return false;

	if (window.webkitNotifications.checkPermission()!==0) window.webkitNotifications.requestPermission();

	if (window.webkitNotifications.checkPermission()===0&&title) {
		popup = window.webkitNotifications.createNotification('', title, text);
		popup.show();
	}

}

upload.start = {

	local: function(files) {

		var albumID	= album.getID(),
			error 	= false,
			process	= function(files, file) {

				var formData		= new FormData(),
					xhr				= new XMLHttpRequest(),
					pre_progress	= 0,
					progress		= 0,
					finish = function() {

						window.onbeforeunload = null;

						$('#upload_files').val('');

						if (error===false) {

							// Success
							basicModal.close();
							upload.notify('Upload complete');

						} else {

							// Error
							$('.basicModal #basicModal__action.hidden').show();
							upload.notify('Upload complete', 'Failed to upload one or more photos.');

						}

						albums.refresh();

						if (album.getID()===false) lychee.goto('0');
						else album.load(albumID);

					};

				// Check if file is supported
				if (file.supported===false) {

					// Skip file
					if (file.next!==null) process(files, file.next);
					else {

						// Look for supported files
						// If zero files are supported, hide the upload after a delay

						var hasSupportedFiles = false;

						for (var i = 0; i < files.length; i++) {

							if (files[i].supported===true) {
								hasSupportedFiles = true;
								break;
							}

						}

						if (hasSupportedFiles===false) setTimeout(finish, 2000);

					}

					return false;

				}

				formData.append('function', 'Photo::add');
				formData.append('albumID', albumID);
				formData.append('tags', '');
				formData.append(0, file);

				xhr.open('POST', api.path);

				xhr.onload = function() {

					var wait		= false,
						errorText	= '';

					file.ready = true;

					// Set status
					if (xhr.status===200&&xhr.responseText==='1') {

						// Success
						$('.basicModal .rows .row:nth-child(' + (file.num+1) + ') .status')
							.html('Finished')
							.addClass('success');

					} else {

						// Error
						$('.basicModal .rows .row:nth-child(' + (file.num+1) + ') .status')
							.html('Error')
							.addClass('error');

						if (xhr.responseText.substr(0, 6)==='Error:') errorText = xhr.responseText.substr(6) + ' Please take a look at the console of your browser for further details.';
						else errorText = 'Server returned an unknown response. Please take a look at the console of your browser for further details.';

						$('.basicModal .rows .row:nth-child(' + (file.num+1) + ') p.notice')
							.html(errorText)
							.show();

						// Set global error
						error = true;

						// Throw error
						lychee.error('Upload failed. Server returned the status code ' + xhr.status + '!', xhr, xhr.responseText);

					}

					// Check if there are file which are not finished
					for (var i = 0; i < files.length; i++) {

						if (files[i].ready===false) {
							wait = true;
							break;
						}

					}

					// Finish upload when all files are finished
					if (wait===false) finish();

				};

				xhr.upload.onprogress = function(e) {

					if (e.lengthComputable) {

						// Calculate progress
						progress = (e.loaded / e.total * 100 | 0);

						// Set progress when progress has changed
						if (progress>pre_progress) {
							$('.basicModal .rows .row:nth-child(' + (file.num+1) + ') .status').html(progress + '%');
							pre_progress = progress;
						}

						if (progress>=100) {

							// Scroll to the uploading file
							var scrollPos = 0;
							if ((file.num+1)>4) scrollPos = (file.num + 1 - 4) * 40
							$('.basicModal .rows').scrollTop(scrollPos);

							// Set status to processing
							$('.basicModal .rows .row:nth-child(' + (file.num+1) + ') .status').html('Processing');

							// Upload next file
							if (file.next!==null) process(files, file.next);

						}

					}

				};

				xhr.send(formData);

			};

		if (files.length<=0) return false;
		if (albumID===false||visible.albums()===true) albumID = 0;

		for (var i = 0; i < files.length; i++) {

			files[i].num		= i;
			files[i].ready		= false;
			files[i].supported	= true;

			if (i < files.length-1)	files[i].next = files[i+1];
			else					files[i].next = null;

			// Check if file is supported
			if (files[i].type!=='image/jpeg'&&files[i].type!=='image/jpg'&&files[i].type!=='image/png'&&files[i].type!=='image/gif') {

				files[i].ready		= true;
				files[i].supported	= false;

			}

		}

		window.onbeforeunload = function() { return 'Lychee is currently uploading!'; };

		upload.show('Uploading', files, function() {

			// Upload first file
			process(files, files[0]);

		});

	},

	url: function() {

		var albumID = album.getID(),
			action;

		if (albumID===false) albumID = 0;

		action = function(data) {

			var extension,
				files = [];

			if (data.link&&data.link.length>3) {

				basicModal.close();

				extension = data.link.split('.').pop();
				if (extension!=='jpeg'&&extension!=='jpg'&&extension!=='png'&&extension!=='gif'&&extension!=='webp') {
					loadingBar.show('error', 'The file format of this link is not supported.');
					return false;
				}

				files[0] = {
					name:		data.link,
					supported:	true
				}

				upload.show('Importing URL', files, function() {

					var params;

					$('.basicModal .rows .row .status').html('Importing');

					params = {
						url: data.link,
						albumID
					}

					api.post('Import::url', params, function(data) {

						basicModal.close();
						upload.notify('Import complete');

						albums.refresh();

						if (album.getID()===false) lychee.goto('0');
						else album.load(albumID);

						if (data!==true) lychee.error(null, params, data);

					});

				});

			} else basicModal.error('link');

		}

		basicModal.show({
			body: "<p>Please enter the direct link to a photo to import it: <input class='text' data-name='link' type='text' placeholder='http://' value=''></p>",
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
		});

	},

	server: function() {

		var albumID = album.getID(),
			action;

		if (albumID===false) albumID = 0;

		action = function(data) {

			var files = [];

			files[0] = {
				name:		data.path,
				supported:	true
			};

			upload.show('Importing from server', files, function() {

				var params;

				$('.basicModal .rows .row .status').html('Importing');

				params = {
					albumID,
					path: data.path
				}

				api.post('Import::server', params, function(data) {

					basicModal.close();
					upload.notify('Import complete');

					albums.refresh();

					if (data==='Notice: Import only contains albums!') {
						if (visible.albums()) lychee.load();
						else lychee.goto('');
					}
					else if (album.getID()===false) lychee.goto('0');
					else album.load(albumID);

					if (data==='Notice: Import only contains albums!') return true;
					else if (data==='Warning: Folder empty!') lychee.error('Folder empty. No photos imported!', params, data);
					else if (data!==true) lychee.error(null, params, data);

				});

			});

		}

		basicModal.show({
			body: "<p>This action will import all photos, folders and sub-folders which are located in the following directory. The <b>original files will be deleted</b> after the import when possible. <input class='text' data-name='path' type='text' maxlength='100' placeholder='Absolute path to directory' value='" + lychee.location + "uploads/import/'></p>",
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
		});

	},

	dropbox: function() {

		var albumID = album.getID(),
			links = '',
			success;

		if (albumID===false) albumID = 0;

		success = function(files) {

			for (var i = 0; i < files.length; i++) {

				links += files[i].link + ',';

				files[i] = {
					name:		files[i].link,
					supported:	true
				};

			}

			// Remove last comma
			links = links.substr(0, links.length-1);

			upload.show('Importing from Dropbox', files, function() {

				var params;

				$('.basicModal .rows .row .status').html('Importing');

				params = {
					url: links,
					albumID
				}

				api.post('Import::url', params, function(data) {

					basicModal.close();
					upload.notify('Import complete');

					albums.refresh();

					if (album.getID()===false) lychee.goto('0');
					else album.load(albumID);

					if (data!==true) lychee.error(null, params, data);

				});

			});

		}

		lychee.loadDropbox(function() {
			Dropbox.choose({
				linkType: 'direct',
				multiselect: true,
				success
			});
		});

	}

}