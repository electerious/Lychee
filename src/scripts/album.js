/**
 * @description	Takes care of every action an album can handle and execute.
 * @copyright	2014 by Tobias Reich
 */

var _a = i18n.album;

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
					view.header.mode('album');
				}

			}, waitTime);

		});

	});

}

album.parse = function() {

	if (!album.json.title) album.json.title = _a.untitled();

}

album.add = function() {

	var title,
		params,
		buttons,
		isNumber = function(n) { return !isNaN(parseFloat(n)) && isFinite(n) };

	buttons = [
		[_a.createAlbum(), function() {

			title = $('.message input.text').val();

			if (title.length===0) title = _a.untitled();

			modal.close();

			params = 'addAlbum&title=' + escape(encodeURI(title));
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

		}],
		[_a.cancel(), function() {}]
	];

	modal.show(_a.newAlbum(), _a.newAlbumEnter() + ": <input class='text' type='text' maxlength='30' placeholder='" + _a.title() + "' value='" + _a.untitled() + "'>", buttons);

}

album.delete = function(albumIDs) {

	var params,
		buttons,
		albumTitle;

	if (!albumIDs) return false;
	if (albumIDs instanceof Array===false) albumIDs = [albumIDs];

	buttons = [
		['', function() {

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

		}],
		['', function() {}]
	];

	if (albumIDs.toString()==='0') {

		buttons[0][0] = _a.clearUnsorted();
		buttons[1][0] = _a.keepUnsorted();

		modal.show(buttons[0][0], _a.clearUnsortedAreYouSure(), buttons);

	} else {

		if (albumIDs.length===1) {
			// Get title
			if (album.json)			albumTitle = album.json.title;
			else if (albums.json)	albumTitle = albums.json.content[albumIDs].title;
		}

		buttons[0][0] = _a.delAlbums({NUM_ALBUMS: albumIDs.length});
		buttons[1][0] = _a.keepAlbums({NUM_ALBUMS: albumIDs.length});

		modal.show(buttons[0][0], _a.delAlbumsAreYouSure({NUM_ALBUMS: albumIDs.length, ALBUM_TITLE: albumTitle}), buttons);

	}

}

album.setTitle = function(albumIDs) {

	var oldTitle = '',
		newTitle,
		params,
		buttons;

	if (!albumIDs) return false;
	if (albumIDs instanceof Array===false) albumIDs = [albumIDs];

	if (albumIDs.length===1) {

		// Get old title if only one album is selected
		if (album.json)			oldTitle = album.json.title;
		else if (albums.json)	oldTitle = albums.json.content[albumIDs].title;

		if (!oldTitle) oldTitle = '';
		oldTitle = oldTitle.replace("'", '&apos;');

	}

	buttons = [
		[_a.setTitle(), function() {

			// Get input
			newTitle = $('.message input.text').val();

			// Remove html from input
			newTitle = lychee.removeHTML(newTitle);

			// Set to Untitled when empty
			newTitle = (newTitle==='') ? _a.untitled() : newTitle;

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

		}],
		[_a.cancel(), function() {}]
	];

	modal.show(_a.setTitles({NUM_ALBUMS: albumIDs.length}),
	           _a.setTitlesEnter({NUM_ALBUMS: albumIDs.length}) + "<input class='text' type='text' maxlength='30' placeholder='" + _a.title() + "' value='" + oldTitle + "'>",
	           buttons);

}

album.setDescription = function(photoID) {

	var oldDescription = album.json.description.replace("'", '&apos;'),
		description,
		params,
		buttons;

	buttons = [
		[_a.setDesc(), function() {

			// Get input
			description = $('.message input.text').val();

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

		}],
		[_a.cancel(), function() {}]
	];

	modal.show(_a.setDesc(),
	           _a.setDescEnter() + ": <input class='text' type='text' maxlength='800' placeholder='" + _a.desc() + "' value='" + oldDescription + "'>", buttons);

}

album.setPublic = function(albumID, e) {

	var params,
		password		= '',
		listed			= false,
		downloadable	= false;

	albums.refresh();

	if (!visible.message()&&album.json.public==0) {

		modal.show(_a.shareAlbum(),
		           _a.willBeShared() + ":</p><form>" +
		           "<div class='choice'><input type='checkbox' name='listed' value='listed' checked><h2>" + _a.visible() + "</h2><p>" + _a.visibleDesc() + "</p></div>" +
		           "<div class='choice'><input type='checkbox' name='downloadable' value='downloadable'><h2>" + _a.downloadable() + "</h2><p>" + _a.downloadableDesc() + "</p></div>" +
		           "<div class='choice'><input type='checkbox' name='password' value='password'><h2>" + _a.passwordProtected() + "</h2><p>" + _a.passwordProtectedDesc() + "<input class='text' type='password' placeholder='" + _a.password() + "' value='' style='display: none;'></p></div>" +
		           "</form><p style='display: none;'>",
		           [[_a.shareAlbum(), function() { album.setPublic(album.getID(), e) }],
		            [_a.cancel(), function() {}]], -170);

		$('.message .choice input[name="password"]').on('change', function() {

			if ($(this).prop('checked')===true)	$('.message .choice input.text').show();
			else								$('.message .choice input.text').hide();

		});

		return true;

	}

	if (visible.message()) {

		if ($('.message .choice input[name="password"]:checked').val()==='password') {
			password			= md5($('.message input.text').val());
			album.json.password	= 1;
		} else {
			password			= '';
			album.json.password	= 0;
		}

		if ($('.message .choice input[name="listed"]:checked').val()==='listed')				listed = true;
		if ($('.message .choice input[name="downloadable"]:checked').val()==='downloadable')	downloadable = true;

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
