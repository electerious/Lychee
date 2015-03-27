/**
 * @description	Takes care of every action a photo can handle and execute.
 * @copyright	2014 by Tobias Reich
 */

var _p = i18n.photo;

photo = {

	json:	null,
	cache:	null

}

photo.getID = function() {

	var id;

	if (photo.json) id = photo.json.id;
	else id = $('.photo:hover, .photo.active').attr('data-id');

	if (id) return id;
	else return false;

}

photo.load = function(photoID, albumID) {

	var params,
		checkPasswd;

	params = 'getPhoto&photoID=' + photoID + '&albumID=' + albumID + '&password=' + password.value;
	lychee.api(params, function(data) {

		if (data==='Warning: Wrong password!') {
			checkPasswd = function() {
				if (password.value!=='') photo.load(photoID, albumID);
				else setTimeout(checkPasswd, 250);
			};
			checkPasswd();
			return false;
		}

		photo.json = data;
		if (!visible.photo()) view.photo.show();
		view.photo.init();

		lychee.imageview.show();
		setTimeout(function() {
			lychee.content.show();
			//photo.preloadNext(photoID, albumID);
		}, 300);

	});

}

// Preload the next photo for better response time
photo.preloadNext = function(photoID) {

	var nextPhoto,
		url;

	// Never preload on mobile devices with bare RAM and
	// mostly mobile internet
	if (mobileBrowser()) return false;

	if (album.json &&
	   album.json.content &&
	   album.json.content[photoID] &&
	   album.json.content[photoID].nextPhoto!='') {

		nextPhoto	= album.json.content[photoID].nextPhoto;
		url			= album.json.content[nextPhoto].url;

		photo.cache			= new Image();
		photo.cache.src		= url;
		photo.cache.onload	= function() { photo.cache = null };

	}

}

photo.parse = function() {

	if (!photo.json.title) photo.json.title = _p.untitled();

}

photo.previous = function(animate) {

	var delay = 0;

	if (photo.getID()!==false&&
		album.json&&
		album.json.content[photo.getID()]&&
		album.json.content[photo.getID()].previousPhoto!=='') {

			if (animate===true) {

				delay = 200;

				$('#image').css({
					WebkitTransform:	'translateX(100%)',
					MozTransform:		'translateX(100%)',
					transform:			'translateX(100%)',
					opacity:			0
				});

			}

			setTimeout(function() {
				if (photo.getID()===false) return false;
				lychee.goto(album.getID() + '/' + album.json.content[photo.getID()].previousPhoto)
			}, delay);

	}

}

photo.next = function(animate) {

	var delay = 0;

	if (photo.getID()!==false&&
		album.json&&
		album.json.content[photo.getID()]&&
		album.json.content[photo.getID()].nextPhoto!=='') {

			if (animate===true) {

				delay = 200;

				$('#image').css({
					WebkitTransform:	'translateX(-100%)',
					MozTransform:		'translateX(-100%)',
					transform:			'translateX(-100%)',
					opacity:			0
				});

			}

			setTimeout(function() {
				if (photo.getID()===false) return false;
				lychee.goto(album.getID() + '/' + album.json.content[photo.getID()].nextPhoto);
			}, delay);

	}

}

photo.duplicate = function(photoIDs) {

	var params;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	albums.refresh();

	params = 'duplicatePhoto&photoIDs=' + photoIDs;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);
		else album.load(album.getID());

	});

}

photo.delete = function(photoIDs) {

	var params,
		buttons,
		photoTitle;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	if (photoIDs.length===1) {

		// Get title if only one photo is selected
		if (visible.photo())	photoTitle = photo.json.title;
		else					photoTitle = album.json.content[photoIDs].title;

		// Fallback for photos without a title
		if (photoTitle==='')	photoTitle = _p.untitled();

	}

	buttons = [
		['', function() {

			var nextPhoto		= '',
				previousPhoto	= '';

			photoIDs.forEach(function(id, index, array) {

				// Change reference for the next and previous photo
				if (album.json.content[id].nextPhoto!==''||album.json.content[id].previousPhoto!=='') {

					nextPhoto		= album.json.content[id].nextPhoto;
					previousPhoto	= album.json.content[id].previousPhoto;

					album.json.content[previousPhoto].nextPhoto = nextPhoto;
					album.json.content[nextPhoto].previousPhoto = previousPhoto;

				}

				album.json.content[id] = null;
				view.album.content.delete(id);

			});

			albums.refresh();

			// Go to next photo if there is a next photo and
			// next photo is not the current one. Show album otherwise.
			if (visible.photo()&&nextPhoto!==''&&nextPhoto!==photo.getID()) lychee.goto(album.getID() + '/' + nextPhoto);
			else if (!visible.albums()) lychee.goto(album.getID());

			params = 'deletePhoto&photoIDs=' + photoIDs;
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		['', function() {}]
	];

	buttons[0][0] = _p.delPhotos({NUM_PHOTOS: photoIDs.length});
	buttons[1][0] = _p.keepPhotos({NUM_PHOTOS: photoIDs.length});

	modal.show(buttons[0][0], _p.delPhotosAreYouSure({NUM_PHOTOS: photoIDs.length, PHOTO_TITLE: photoTitle}), buttons);

}

photo.setTitle = function(photoIDs) {

	var oldTitle = '',
		newTitle,
		params,
		buttons;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	if (photoIDs.length===1) {
		// Get old title if only one photo is selected
		if (photo.json)			oldTitle = photo.json.title;
		else if (album.json)	oldTitle = album.json.content[photoIDs].title;
		oldTitle = oldTitle.replace("'", '&apos;');
	}

	buttons = [
		[_p.setTitle(), function() {

			// Get input
			newTitle = $('.message input.text').val();

			// Remove html from input
			newTitle = lychee.removeHTML(newTitle);

			if (visible.photo()) {
				photo.json.title = (newTitle==='') ? _p.untitled() : newTitle;
				view.photo.title();
			}

			photoIDs.forEach(function(id, index, array) {
				album.json.content[id].title = newTitle;
				view.album.content.title(id);
			});

			params = 'setPhotoTitle&photoIDs=' + photoIDs + '&title=' + escape(encodeURI(newTitle));
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		[_p.cancel(), function() {}]
	];

	modal.show(_p.setTitles({NUM_PHOTOS: photoIDs.length}),
	           _p.setTitlesEnter({NUM_PHOTOS: photoIDs.length}) + "<input class='text' type='text' maxlength='30' placeholder='" + _p.title() + "' value='" + oldTitle + "'>",
	           buttons);

}

photo.setAlbum = function(photoIDs, albumID) {

	var params,
		nextPhoto,
		previousPhoto;

	if (!photoIDs) return false;
	if (visible.photo) lychee.goto(album.getID());
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	photoIDs.forEach(function(id, index, array) {

		// Change reference for the next and previous photo
		if (album.json.content[id].nextPhoto!==''||album.json.content[id].previousPhoto!=='') {

			nextPhoto		= album.json.content[id].nextPhoto;
			previousPhoto	= album.json.content[id].previousPhoto;

			album.json.content[previousPhoto].nextPhoto = nextPhoto;
			album.json.content[nextPhoto].previousPhoto = previousPhoto;

		}

		album.json.content[id] = null;
		view.album.content.delete(id);

	});

	albums.refresh();

	params = 'setPhotoAlbum&photoIDs=' + photoIDs + '&albumID=' + albumID;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

photo.setStar = function(photoIDs) {

	var params;

	if (!photoIDs) return false;
	if (visible.photo()) {
		photo.json.star = (photo.json.star==0) ? 1 : 0;
		view.photo.star();
	}

	photoIDs.forEach(function(id, index, array) {
		album.json.content[id].star = (album.json.content[id].star==0) ? 1 : 0;
		view.album.content.star(id);
	});

	albums.refresh();

	params = 'setPhotoStar&photoIDs=' + photoIDs;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

photo.setPublic = function(photoID, e) {

	var params;

	if (photo.json.public==2) {

		modal.show(_p.pubAlbum(), _p.pubAlbumInfo(),
		           [[_p.showAlbum(), function() { lychee.goto(photo.json.original_album) }],
		            [_p.close(), function() {}]]);
		return false;

	}

	if (visible.photo()) {

		photo.json.public = (photo.json.public==0) ? 1 : 0;
		view.photo.public();
		if (photo.json.public==1) contextMenu.sharePhoto(photoID, e);

	}

	album.json.content[photoID].public = (album.json.content[photoID].public==0) ? 1 : 0;
	view.album.content.public(photoID);

	albums.refresh();

	params = 'setPhotoPublic&photoID=' + photoID;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

photo.setDescription = function(photoID) {

	var oldDescription = photo.json.description.replace("'", '&apos;'),
		description,
		params,
		buttons;

	buttons = [
		[_p.setDesc(), function() {

			// Get input
			description = $('.message input.text').val();

			// Remove html from input
			description = lychee.removeHTML(description);

			if (visible.photo()) {
				photo.json.description = description;
				view.photo.description();
			}

			params = 'setPhotoDescription&photoID=' + photoID + '&description=' + escape(encodeURI(description));
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

			});

		}],
		[_p.cancel(), function() {}]
	];

	modal.show(_p.setDesc(),
	           _p.setDescEnter() + ": <input class='text' type='text' maxlength='800' placeholder='" + _p.description() + "' value='" + oldDescription + "'>",
	           buttons);

}

photo.editTags = function(photoIDs) {

	var oldTags		= '',
		tags		= '',
		buttons;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	// Get tags
	if (visible.photo())						oldTags = photo.json.tags;
	if (visible.album()&&photoIDs.length===1)	oldTags = album.json.content[photoIDs].tags;
	if (visible.album()&&photoIDs.length>1) {
		var same = true;
		photoIDs.forEach(function(id, index, array) {
			if(album.json.content[id].tags===album.json.content[photoIDs[0]].tags&&same===true) same = true;
			else same = false;
		});
		if (same) oldTags = album.json.content[photoIDs[0]].tags;
	}

	// Improve tags
	oldTags = oldTags.replace(/,/g, ', ');

	buttons = [
		[_p.setTags(), function() {

			tags = $('.message input.text').val();

			photo.setTags(photoIDs, tags);

		}],
		[_p.cancel(), function() {}]
	];

	modal.show(_p.setTags(),
	           _p.setTagsEnter({NUM_PHOTOS: photoIDs.length}) + ": <input class='text' type='text' maxlength='800' placeholder='" + _p.tags() + "' value='" + oldTags + "'>",
	           buttons);

}

photo.setTags = function(photoIDs, tags) {

	var params;

	if (!photoIDs) return false;
	if (photoIDs instanceof Array===false) photoIDs = [photoIDs];

	// Parse tags
	tags = tags.replace(/(\ ,\ )|(\ ,)|(,\ )|(,{1,}\ {0,})|(,$|^,)/g, ',');
	tags = tags.replace(/,$|^,|(\ ){0,}$/g, '');

	// Remove html from input
	tags = lychee.removeHTML(tags);

	if (visible.photo()) {
		photo.json.tags = tags;
		view.photo.tags();
	}

	photoIDs.forEach(function(id, index, array) {
		album.json.content[id].tags = tags;
	});

	params = 'setPhotoTags&photoIDs=' + photoIDs + '&tags=' + tags;
	lychee.api(params, function(data) {

		if (data!==true) lychee.error(null, params, data);

	});

}

photo.deleteTag = function(photoID, index) {

	var tags;

	// Remove
	tags = photo.json.tags.split(',');
	tags.splice(index, 1);

	// Save
	photo.json.tags = tags.toString();
	photo.setTags([photoID], photo.json.tags);

}

photo.share = function(photoID, service) {

	var link		= '',
		url			= photo.getViewLink(photoID),
		filename	= 'unknown';

	switch (service) {
		case 0:
			link = 'https://twitter.com/share?url=' + encodeURI(url);
			break;
		case 1:
			link = 'http://www.facebook.com/sharer.php?u=' + encodeURI(url) + '&t=' + encodeURI(photo.json.title);
			break;
		case 2:
			link = 'mailto:?subject=' + encodeURI(photo.json.title) + '&body=' + encodeURI(url);
			break;
		case 3:
			lychee.loadDropbox(function() {
				filename = photo.json.title + '.' + photo.getDirectLink().split('.').pop();
				Dropbox.save(photo.getDirectLink(), filename);
			});
			break;
		default:
			link = '';
			break;
	}

	if (link.length>5) location.href = link;

}

photo.getSize = function() {

	// Size can be 'big', 'medium' or 'small'
	// Default is big
	// Small is centered in the middle of the screen
	var size		= 'big',
		scaled		= false,
		hasMedium	= photo.json.medium!=='',
		pixelRatio	= window.devicePixelRatio,
		view		= {
			width:	$(window).width()-60,
			height:	$(window).height()-100
		};

	// Detect if the photo will be shown scaled,
	// because the screen size is smaller than the photo
	if (photo.json.width>view.width||
		photo.json.height>view.height) scaled = true;

	// Calculate pixel ratio of screen
	if (pixelRatio!==undefined&&pixelRatio>1) {
		view.width	= view.width * pixelRatio;
		view.height	= view.height * pixelRatio;
	}

	// Medium available and
	// Medium still bigger than screen
	if (hasMedium===true&&
		(1920>view.width&&1080>view.height)) size = 'medium';

	// Photo not scaled
	// Photo smaller then screen
	if (scaled===false&&
		(photo.json.width<view.width&&
		photo.json.width<view.height)) size = 'small';

	return size;

}

photo.getArchive = function(photoID) {

	var link,
		url = 'php/api.php?function=getPhotoArchive&photoID=' + photoID;

	if (location.href.indexOf('index.html')>0)	link = location.href.replace(location.hash, '').replace('index.html', url);
	else										link = location.href.replace(location.hash, '') + url;

	if (lychee.publicMode) link += '&password=' + password.value;

	location.href = link;

}

photo.getDirectLink = function() {

	var url = '';

	if (photo.json&&
		photo.json.url&&
		photo.json.url!=='') url = photo.json.url;

	return url;

}

photo.getViewLink = function(photoID) {

	var url = 'view.php?p=' + photoID;

	if (location.href.indexOf('index.html')>0)	return location.href.replace('index.html' + location.hash, url);
	else										return location.href.replace(location.hash, url);

}
