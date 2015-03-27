/**
 * @description	This module is used for the context menu.
 * @copyright	2014 by Tobias Reich
 */

var _cm = i18n.contextMenu;

contextMenu = {}

contextMenu.add = function(e) {

	var items = [
		{ type: 'item', title: _cm.uploadPhoto(), icon: 'icon-picture', fn: function() { $('#upload_files').click() } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.importLink(), icon: 'icon-link', fn: upload.start.url },
		{ type: 'item', title: _cm.importDropbox(), icon: 'icon-folder-open', fn: upload.start.dropbox },
		{ type: 'item', title: _cm.importServer(), icon: 'icon-hdd', fn: upload.start.server },
		{ type: 'separator' },
		{ type: 'item', title: _cm.newAlbum(), icon: 'icon-folder-close', fn: album.add }
	];

	basicContext.show(items, e);

	upload.notify();

}

contextMenu.settings = function(e) {

	var items = [
		{ type: 'item', title: _cm.changeLogin(), icon: 'icon-user', fn: settings.setLogin },
		{ type: 'item', title: _cm.changeSort(), icon: 'icon-sort', fn: settings.setSorting },
		{ type: 'item', title: _cm.setDropbox(), icon: 'icon-folder-open', fn: settings.setDropboxKey },
		{ type: 'separator' },
		{ type: 'item', title: _cm.about(), icon: 'icon-info-sign', fn: function() { window.open(lychee.website) } },
		{ type: 'item', title: _cm.diag(), icon: 'icon-dashboard', fn: function() { window.open('plugins/check/') } },
		{ type: 'item', title: _cm.log(), icon: 'icon-list', fn: function() { window.open('plugins/displaylog/') } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.signOut(), icon: 'icon-signout', fn: lychee.logout }
	];

	basicContext.show(items, e);

}

contextMenu.album = function(albumID, e) {

	if (albumID==='0'||albumID==='f'||albumID==='s'||albumID==='r') return false;

	var items = [
		{ type: 'item', title: _cm.rename(), icon: 'icon-edit', fn: function() { album.setTitle([albumID]) } },
		{ type: 'item', title: _cm.delete(), icon: 'icon-trash', fn: function() { album.delete([albumID]) } }
	];

	$('.album[data-id="' + albumID + '"]').addClass('active');

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.albumMulti = function(albumIDs, e) {

	multiselect.stopResize();

	var items = [
		{ type: 'item', title: _cm.renameAll(), icon: 'icon-edit', fn: function() { album.setTitle(albumIDs) } },
		{ type: 'item', title: _cm.deleteAll(), icon: 'icon-trash', fn: function() { album.delete(albumIDs) } }
	];

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.photo = function(photoID, e) {

	// Notice for 'Move':
	// fn must call basicContext.close() first,
	// in order to keep the selection

	var items = [
		{ type: 'item', title: _cm.star(), icon: 'icon-star', fn: function() { photo.setStar([photoID]) } },
		{ type: 'item', title: _cm.tags(), icon: 'icon-tags', fn: function() { photo.editTags([photoID]) } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.rename(), icon: 'icon-edit', fn: function() { photo.setTitle([photoID]) } },
		{ type: 'item', title: _cm.duplicate(), icon: 'icon-copy', fn: function() { photo.duplicate([photoID]) } },
		{ type: 'item', title: _cm.move(), icon: 'icon-folder-open', fn: function() { basicContext.close(); contextMenu.move([photoID], e); } },
		{ type: 'item', title: _cm.delete(), icon: 'icon-trash', fn: function() { photo.delete([photoID]) } }
	];

	$('.photo[data-id="' + photoID + '"]').addClass('active');

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.photoMulti = function(photoIDs, e) {

	// Notice for 'Move All':
	// fn must call basicContext.close() first,
	// in order to keep the selection and multiselect

	multiselect.stopResize();

	var items = [
		{ type: 'item', title: _cm.starAll(), icon: 'icon-star', fn: function() { photo.setStar(photoIDs) } },
		{ type: 'item', title: _cm.tagsAll(), icon: 'icon-tags', fn: function() { photo.editTags(photoIDs) } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.renameAll(), icon: 'icon-edit', fn: function() { photo.setTitle(photoIDs) } },
		{ type: 'item', title: _cm.duplicateAll(), icon: 'icon-copy', fn: function() { photo.duplicate(photoIDs) } },
		{ type: 'item', title: _cm.moveAll(), icon: 'icon-folder-open', fn: function() { basicContext.close(); contextMenu.move(photoIDs, e); } },
		{ type: 'item', title: _cm.deleteAll(), icon: 'icon-trash', fn: function() { photo.delete(photoIDs) } }
	];

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.photoMore = function(photoID, e) {

	var items = [
		{ type: 'item', title: _cm.fullPhoto(), icon: 'icon-resize-full', fn: function() { window.open(photo.getDirectLink()) } },
		{ type: 'item', title: _cm.download(), icon: 'icon-circle-arrow-down', fn: function() { photo.getArchive(photoID) } }
	];

	// Remove download-item when
	// 1) In public mode
	// 2) Downloadable not 1 or not found
	if (!(album.json&&album.json.downloadable&&album.json.downloadable==='1')&&
		lychee.publicMode===true) items.splice(1, 1);

	basicContext.show(items, e);

}

contextMenu.move = function(photoIDs, e) {

	var items = [];

	// Show Unsorted when unsorted is not the current album
	if (album.getID()!=='0') {

		items = [
			{ type: 'item', title: _cm.unsorted(), fn: function() { photo.setAlbum(photoIDs, 0) } },
			{ type: 'separator' }
		];

	}

	lychee.api('getAlbums', function(data) {

		if (data.num===0) {

			// Show only 'Add album' when no album available
			items = [
				{ type: 'item', title: _cm.newAlbum(), fn: album.add }
			];

		} else {

			// Generate list of albums
			$.each(data.content, function(index) {

				var that = this;

				if (!that.thumb0) that.thumb0 = 'src/images/no_cover.svg';
				that.title = "<img class='albumCover' width='16' height='16' src='" + that.thumb0 + "'><div class='albumTitle'>" + that.title + "</div>";

				if (that.id!=album.getID()) items.push({ type: 'item', title: that.title, fn: function() { photo.setAlbum(photoIDs, that.id) } });

			});

		}

		basicContext.show(items, e, contextMenu.close);

	});

}

contextMenu.sharePhoto = function(photoID, e) {

	var link = photo.getViewLink(photoID);
	if (photo.json.public==='2') link = location.href;

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + link + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: _cm.makePrivate(), icon: 'icon-eye-close', fn: function() { photo.setPublic(photoID) } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.twitter(), icon: 'icon-twitter', fn: function() { photo.share(photoID, 0) } },
		{ type: 'item', title: _cm.facebook(), icon: 'icon-facebook', fn: function() { photo.share(photoID, 1) } },
		{ type: 'item', title: _cm.mail(), icon: 'icon-envelope', fn: function() { photo.share(photoID, 2) } },
		{ type: 'item', title: _cm.dropbox(), icon: 'icon-hdd', fn: function() { photo.share(photoID, 3) } },
		{ type: 'item', title: _cm.directLink(), icon: 'icon-link', fn: function() { window.open(photo.getDirectLink()) } }
	];

	basicContext.show(items, e);
	$('.basicContext input#link').focus().select();

}

contextMenu.shareAlbum = function(albumID, e) {

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + location.href + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: _cm.makePrivate(), icon: 'icon-eye-close', fn: function() { album.setPublic(albumID) } },
		{ type: 'separator' },
		{ type: 'item', title: _cm.twitter(), icon: 'icon-twitter', fn: function() { album.share(0) } },
		{ type: 'item', title: _cm.facebook(), icon: 'icon-facebook', fn: function() { album.share(1) } },
		{ type: 'item', title: _cm.mail(), icon: 'icon-envelope', fn: function() { album.share(2) } }
	];

	basicContext.show(items, e);
	$('.basicContext input#link').focus().select();

}

contextMenu.close = function() {

	if (!visible.contextMenu()) return false;

	basicContext.close();

	$('.photo.active, .album.active').removeClass('active');
	if (visible.multiselect()) multiselect.close();

}
