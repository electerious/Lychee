/**
 * @description	Takes care of every action an album can handle and execute.
 * @copyright	2014 by Tobias Reich
 */

album = {

	json: null

}

album.getID = function() {

	var id;

	if (photo.json)			id = photo.json.album;
	else if (album.json)	id = album.json.id;
	else					id = $('.album:hover, .album.active').attr('data-id');

	// Search
	if (!id) id = $('.album:hover, .album.active').attr('data-id');
	if (!id) id = $('.photo:hover, .photo.active').attr('data-album-id');

	if (id)	return id;
	else	return false;

}

album.load = function(albumID, refresh) {

	var startTime,
		params,
		durationTime,
		waitTime;

	password.get(albumID, function() {

		if (!refresh) {
			lychee.animate('.album, .photo', 'contentZoomOut');
			lychee.animate('.divider', 'fadeOut');
		}

		startTime = new Date().getTime();

		params = 'getAlbum&albumID=' + albumID + '&password=' + password.value;
		lychee.api(params, function(data) {

			if (data==='Warning: Album private!') {
				if (document.location.hash.replace('#', '').split('/')[1]!=undefined) {
					// Display photo only
					lychee.setMode('view');
				} else {
					// Album not public
					lychee.content.show();
					lychee.goto('');
				}
				return false;
			}

			if (data==='Warning: Wrong password!') {
				album.load(albumID, refresh);
				return false;
			}

			album.json = data;

			// Calculate delay
			durationTime = (new Date().getTime() - startTime);
			if (durationTime>300)	waitTime = 0;
			else					waitTime = 300 - durationTime;

			// Skip delay when refresh is true
			// Skip delay when opening a blank Lychee
			if (refresh===true)											waitTime = 0;
			if (!visible.albums()&&!visible.photo()&&!visible.album())	waitTime = 0;

			setTimeout(function() {

				view.album.init();

				if (!refresh) {
					lychee.animate('.album, .photo', 'contentZoomIn');
					header.setMode('album');
				}

			}, waitTime);

		});

	});

}

album.parse = function() {

	if (!album.json.title) album.json.title = 'Untitled';

}

album.add = function() {

	var action;

	action = function(data) {

		var params,
			isNumber = function(n) { return !isNaN(parseFloat(n)) && isFinite(n) };

		basicModal.close();

		if (data.title.length===0) data.title = 'Untitled';

		params = 'addAlbum&title=' + escape(encodeURI(data.title));
		lychee.api(params, function(data) {

			// Avoid first album to be true
			if (data===true) data = 1;

			if (data!==false&&isNumber(data)) {
				albums.refresh();
				lychee.goto(data);
			} else {
				lychee.error(null, params, data);
			}

		});

	}

	basicModal.show({
		body: "<p>Enter a title for the new album: <input class='text' data-name='title' type='text' maxlength='30' placeholder='Title' value='Untitled'></p>",
		buttons: {
			action: {
				title: 'Create Album',
				fn: action
			},
			cancel: {
				title: 'Cancel',
				fn: basicModal.close
			}
		}
	});

}

album.delete = function(albumIDs) {

	var action = {},
		cancel = {},
		msg = '',
		albumTitle = '';

	if (!albumIDs) return false;
	if (albumIDs instanceof Array===false) albumIDs = [albumIDs];

	action.fn = function() {

		var params;

		basicModal.close();

		params = 'deleteAlbum&albumIDs=' + albumIDs;
		lychee.api(params, function(data) {

			if (visible.albums()) {

				albumIDs.forEach(function(id) {
					albums.json.num--;
					view.albums.content.delete(id);
					delete albums.json.content[id];
				});

			} else {

				albums.refresh();
				lychee.goto('');

			}

			if (data!==true) lychee.error(null, params, data);

		});

	}

	if (albumIDs.toString()==='0') {

		action.title = 'Clear Unsorted';
		cancel.title = 'Keep Unsorted';

		msg = "<p>Are you sure you want to delete all photos from 'Unsorted'?<br>This action can't be undone!</p>";

	} else if (albumIDs.length===1) {

		action.title = 'Delete Album and Photos';
		cancel.title = 'Keep Album';

		// Get title
		if (album.json)			albumTitle = album.json.title;
		else if (albums.json)	albumTitle = albums.json.content[albumIDs].title;

		msg = "<p>Are you sure you want to delete the album '" + albumTitle + "' and all of the photos it contains? This action can't be undone!</p>";

	} else {

		action.title = 'Delete Albums and Photos';
		cancel.title = 'Keep Albums';

		msg = "<p>Are you sure you want to delete all " + albumIDs.length + " selected albums and all of the photos they contain? This action can't be undone!</p>";

	}

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: action.title,
				fn: action.fn,
				class: 'red'
			},
			cancel: {
				title: cancel.title,
				fn: basicModal.close
			}
		}
	});

}

album.setTitle = function(albumIDs) {

	var oldTitle = '',
		input = '',
		msg = '',
		action;

	if (!albumIDs) return false;
	if (albumIDs instanceof Array===false) albumIDs = [albumIDs];

	if (albumIDs.length===1) {

		// Get old title if only one album is selected
		if (album.json)			oldTitle = album.json.title;
		else if (albums.json)	oldTitle = albums.json.content[albumIDs].title;

		if (!oldTitle) oldTitle = '';
		oldTitle = oldTitle.replace("'", '&apos;');

	}

	action = function(data) {

		var params,
			newTitle = data.title;

		basicModal.close();

		// Remove html from input
		newTitle = lychee.removeHTML(newTitle);

		// Set to Untitled when empty
		newTitle = (newTitle==='') ? 'Untitled' : newTitle;

		if (visible.album()) {

			album.json.title = newTitle;
			view.album.title();

			if (albums.json) {
				var id = albumIDs[0];
				albums.json.content[id].title = newTitle;
			}

		} else if (visible.albums()) {

			albumIDs.forEach(function(id) {
				albums.json.content[id].title = newTitle;
				view.albums.content.title(id);
			});

		}

		params = 'setAlbumTitle&albumIDs=' + albumIDs + '&title=' + escape(encodeURI(newTitle));
		lychee.api(params, function(data) {

			if (data!==true) lychee.error(null, params, data);

		});

	}

	input = "<input class='text' data-name='title' type='text' maxlength='30' placeholder='Title' value='" + oldTitle + "'>";

	if (albumIDs.length===1)	msg = "<p>Enter a new title for this album: " + input + "</p>";
	else						msg = "<p>Enter a title for all " + albumIDs.length + " selected albums: " + input +"</p>";

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: 'Set Title',
				fn: action
			},
			cancel: {
				title: 'Cancel',
				fn: basicModal.close
			}
		}
	});

}

album.setDescription = function(photoID) {

	var oldDescription = album.json.description.replace("'", '&apos;'),
		action;

	action = function(data) {

		var params,
			description = data.description;

		basicModal.close();

		// Remove html from input
		description = lychee.removeHTML(description);

		if (visible.album()) {
			album.json.description = description;
			view.album.description();
		}

		params = 'setAlbumDescription&albumID=' + photoID + '&description=' + escape(encodeURI(description));
		lychee.api(params, function(data) {

			if (data!==true) lychee.error(null, params, data);

		});

	}

	basicModal.show({
		body: "<p>Please enter a description for this album: <input class='text' data-name='description' type='text' maxlength='800' placeholder='Description' value='" + oldDescription + "'></p>",
		buttons: {
			action: {
				title: 'Set Description',
				fn: action
			},
			cancel: {
				title: 'Cancel',
				fn: basicModal.close
			}
		}
	});

}

album.setPublic = function(albumID, e) {

	var params,
		password		= '',
		listed			= false,
		downloadable	= false;

	albums.refresh();

	if (!basicModal.visible()&&album.json.public==0) {

		var msg = '',
			action;

		action = function() {

			basicModal.close();
			album.setPublic(album.getID(), e);

		};

		msg = "<p class='less'>This album will be shared with the following properties:</p><form>";
		msg += "<div class='choice'><label><input type='checkbox' name='listed' checked><span class='checkbox'>" + build.iconic('check') + "</span><span class='label'>Visible</span></label><p>Listed to visitors of your Lychee.</p></div>";
		msg += "<div class='choice'><label><input type='checkbox' name='downloadable'><span class='checkbox'>" + build.iconic('check') + "</span><span class='label'>Downloadable</span></label><p>Visitors of your Lychee can download this album.</p></div>";
		msg += "<div class='choice'><label><input type='checkbox' name='password'><span class='checkbox'>" + build.iconic('check') + "</span><span class='label'>Password protected</span></label><p>Only accessible with a valid password.</p><input class='text' data-name='password' type='password' placeholder='password' value=''></div>";
		msg += "</form>"

		basicModal.show({
			body: msg,
			buttons: {
				action: {
					title: 'Share Album',
					fn: action
				},
				cancel: {
					title: 'Cancel',
					fn: basicModal.close
				}
			}
		});

		$('.basicModal .choice input[name="password"]').on('change', function() {

			if ($(this).prop('checked')===true)	$('.basicModal .choice input[data-name="password"]').show();
			else								$('.basicModal .choice input[data-name="password"]').hide();

		});

		return true;

	}

	if (basicModal.visible()) {

		if ($('.basicModal .choice input[name="password"]:checked').length===1) {
			password			= md5($('.basicModal .choice input[name="password"]').val());
			album.json.password	= 1;
		} else {
			password			= '';
			album.json.password	= 0;
		}

		if ($('.basicModal .choice input[name="listed"]:checked').length===1)		listed = true;
		if ($('.basicModal .choice input[name="downloadable"]:checked').length===1)	downloadable = true;

	}

	params = 'setAlbumPublic&albumID=' + albumID + '&password=' + password + '&visible=' + listed + '&downloadable=' + downloadable;

	if (visible.album()) {

		album.json.public	= (album.json.public==0) ? 1 : 0;
		album.json.password	= (album.json.public==0) ? 0 : album.json.password;

		view.album.public();
		view.album.password();

		if (album.json.public==1) contextMenu.shareAlbum(albumID, e);

	}

	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

album.share = function(service) {

	var link = '',
		url = location.href;

	switch (service) {
		case 0:
			link = 'https://twitter.com/share?url=' + encodeURI(url);
			break;
		case 1:
			link = 'http://www.facebook.com/sharer.php?u=' + encodeURI(url) + '&t=' + encodeURI(album.json.title);
			break;
		case 2:
			link = 'mailto:?subject=' + encodeURI(album.json.title) + '&body=' + encodeURI(url);
			break;
		default:
			link = '';
			break;
	}

	if (link.length>5) location.href = link;

}

album.getArchive = function(albumID) {

	var link,
		url = 'php/api.php?function=getAlbumArchive&albumID=' + albumID;

	if (location.href.indexOf('index.html')>0)	link = location.href.replace(location.hash, '').replace('index.html', url);
	else										link = location.href.replace(location.hash, '') + url;

	if (lychee.publicMode) link += '&password=' + password.value;

	location.href = link;

}