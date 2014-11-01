/**
 * @description	This module is used for the context menu.
 * @copyright	2014 by Tobias Reich
 */

contextMenu = {}

contextMenu.add = function(e) {

	var items = [
		{ type: 'item', title: 'Upload Photo', icon: 'icon-picture', fn: function() { $('#upload_files').click() } },
		{ type: 'separator' },
		{ type: 'item', title: 'Import from Link', icon: 'icon-link', fn: upload.start.url },
		{ type: 'item', title: 'Import from Dropbox', icon: 'icon-folder-open', fn: upload.start.dropbox },
		{ type: 'item', title: 'Import from Server', icon: 'icon-hdd', fn: upload.start.server },
		{ type: 'separator' },
		{ type: 'item', title: 'New Album', icon: 'icon-folder-close', fn: album.add }
	];

	context.show(items, e);

	upload.notify();

}

contextMenu.settings = function(e) {

	var items = [
		{ type: 'item', title: 'Change Login', icon: 'icon-user', fn: settings.setLogin },
		{ type: 'item', title: 'Change Sorting', icon: 'icon-sort', fn: settings.setSorting },
		{ type: 'item', title: 'Set Dropbox', icon: 'icon-folder-open', fn: settings.setDropboxKey },
		{ type: 'separator' },
		{ type: 'item', title: 'About Lychee', icon: 'icon-info-sign', fn: function() { window.open(lychee.website) } },
		{ type: 'item', title: 'Diagnostics', icon: 'icon-dashboard', fn: function() { window.open('plugins/check/') } },
		{ type: 'item', title: 'Show Log', icon: 'icon-list', fn: function() { window.open('plugins/displaylog/') } },
		{ type: 'separator' },
		{ type: 'item', title: 'Sign Out', icon: 'icon-signout', fn: lychee.logout }
	];

	context.show(items, e);

}

contextMenu.album = function(albumID, e) {

	if (albumID==='0'||albumID==='f'||albumID==='s'||albumID==='r') return false;

	var items = [
		{ type: 'item', title: 'Rename', icon: 'icon-edit', fn: function() { album.setTitle([albumID]) } },
		{ type: 'item', title: 'Delete', icon: 'icon-trash', fn: function() { album.delete([albumID]) } }
	];

	$('.album[data-id="' + albumID + '"]').addClass('active');

	context.show(items, e, function() {
		$('.photo.active, .album.active').removeClass('active');
		context.close();
	});

}

contextMenu.albumMulti = function(albumIDs, e) {

	multiselect.stopResize();

	var items = [
		{ type: 'item', title: 'Rename All', icon: 'icon-edit', fn: function() { album.setTitle(albumIDs) } },
		{ type: 'item', title: 'Delete All', icon: 'icon-trash', fn: function() { album.delete(albumIDs) } }
	];

	context.show(items, e, function() {
		context.close();
		$('.photo.active, .album.active').removeClass('active');
		if (visible.multiselect()) multiselect.close();
	});

}

contextMenu.photo = function(photoID, e) {

	var items = [
		{ type: 'item', title: 'Star', icon: 'icon-star', fn: function() { photo.setStar([photoID]) } },
		{ type: 'item', title: 'Tags', icon: 'icon-tags', fn: function() { photo.editTags([photoID]) } },
		{ type: 'separator' },
		{ type: 'item', title: 'Rename', icon: 'icon-edit', fn: function() { photo.setTitle([photoID]) } },
		{ type: 'item', title: 'Duplicate', icon: 'icon-copy', fn: function() { photo.duplicate([photoID]) } },
		{ type: 'item', title: 'Move', icon: 'icon-folder-open', fn: function() { contextMenu.move([photoID], e) } },
		{ type: 'item', title: 'Delete', icon: 'icon-trash', fn: function() { photo.delete([photoID]) } }
	];

	$('.photo[data-id="' + photoID + '"]').addClass('active');

	context.show(items, e, function() {
		context.close();
		$('.photo.active, .album.active').removeClass('active');
	});

}

contextMenu.photoMulti = function(photoIDs, e) {

	multiselect.stopResize();

	var items = [
		{ type: 'item', title: 'Star All', icon: 'icon-star', fn: function() { photo.setStar(photoIDs) } },
		{ type: 'item', title: 'Tag All', icon: 'icon-tags', fn: function() { photo.editTags(photoIDs) } },
		{ type: 'separator' },
		{ type: 'item', title: 'Rename All', icon: 'icon-edit', fn: function() { photo.setTitle(photoIDs) } },
		{ type: 'item', title: 'Duplicate All', icon: 'icon-copy', fn: function() { photo.duplicate(photoIDs) } },
		{ type: 'item', title: 'Move All', icon: 'icon-folder-open', fn: function() { contextMenu.move(photoIDs, e) } },
		{ type: 'item', title: 'Delete All', icon: 'icon-trash', fn: function() { photo.delete(photoIDs) } }
	];

	context.show(items, e, function() {
		context.close();
		$('.photo.active, .album.active').removeClass('active');
		if (visible.multiselect()) multiselect.close();
	});

}

contextMenu.photoMore = function(photoID, e) {

	var items = [
		{ type: 'item', title: 'Full Photo', icon: 'icon-resize-full', fn: function() { window.open(photo.getDirectLink()) } },
		{ type: 'item', title: 'Download', icon: 'icon-circle-arrow-down', fn: function() { photo.getArchive(photoID) } }
	];

	// Remove download-item when
	// 1) In public mode
	// 2) Downloadable not 1 or not found
	if (!(album.json&&album.json.downloadable&&album.json.downloadable==='1')&&
		lychee.publicMode===true) items.splice(1, 1);

	context.show(items, e);

}

contextMenu.move = function(photoIDs, e) {

	var items = [];

	// Show Unsorted when unsorted is not the current album
	if (album.getID()!=='0') {

		items = [
			{ type: 'item', title: 'Unsorted', fn: function() { photo.setAlbum([photoIDs], 0) } },
			{ type: 'separator' }
		];

	}

	lychee.api('getAlbums', function(data) {

		if (data.num===0) {

			// Show 'Add album' when no album available
			items = [
				{ type: 'item', title: 'New Album', fn: album.add }
			];

		} else {

			// Generate list of albums
			$.each(data.content, function(index) {
				var that = this;
				if (that.id!=album.getID()) items.push({ type: 'item', title: that.title, fn: function() { photo.setAlbum([photoIDs], that.id) } });
			});

		}

		context.show(items, e);

	});

}

contextMenu.sharePhoto = function(photoID, e) {

	var link = photo.getViewLink(photoID);
	if (photo.json.public==='2') link = location.href;

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + link + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: 'Make Private', icon: 'icon-eye-close', fn: function() { photo.setPublic(photoID) } },
		{ type: 'separator' },
		{ type: 'item', title: 'Twitter', icon: 'icon-twitter', fn: function() { photo.share(photoID, 0) } },
		{ type: 'item', title: 'Facebook', icon: 'icon-facebook', fn: function() { photo.share(photoID, 1) } },
		{ type: 'item', title: 'Mail', icon: 'icon-envelope', fn: function() { photo.share(photoID, 2) } },
		{ type: 'item', title: 'Dropbox', icon: 'icon-hdd', fn: function() { photo.share(photoID, 3) } },
		{ type: 'item', title: 'Direct Link', icon: 'icon-link', fn: function() { window.open(photo.getDirectLink()) } }
	];

	context.show(items, e);
	$('.context input#link').focus().select();

}

contextMenu.shareAlbum = function(albumID, e) {

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + location.href + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: 'Make Private', icon: 'icon-eye-close', fn: function() { album.setPublic(albumID) } },
		{ type: 'separator' },
		{ type: 'item', title: 'Twitter', icon: 'icon-twitter', fn: function() { album.share(0) } },
		{ type: 'item', title: 'Facebook', icon: 'icon-facebook', fn: function() { album.share(1) } },
		{ type: 'item', title: 'Mail', icon: 'icon-envelope', fn: function() { album.share(2) } }
	];

	context.show(items, e);
	$('.context input#link').focus().select();

}

contextMenu.close = function(leaveSelection) {

	if (!visible.contextMenu()) return false;

	context.close();

	if (leaveSelection!==true) {
		$('.photo.active, .album.active').removeClass('active');
		if (visible.multiselect()) multiselect.close();
	}

}