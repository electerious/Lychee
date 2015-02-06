/**
 * @description	This module is used for the context menu.
 * @copyright	2015 by Tobias Reich
 */

contextMenu = {}

contextMenu.add = function(e) {

	var items = [
		{ type: 'item', title: build.iconic('image') + 'Upload Photo', fn: function() { $('#upload_files').click() } },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('link-intact') + 'Import from Link', fn: upload.start.url },
		{ type: 'item', title: build.iconic('dropbox', 'ionicons', 'ionicons') + 'Import from Dropbox', fn: upload.start.dropbox },
		{ type: 'item', title: build.iconic('terminal') + 'Import from Server', fn: upload.start.server },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('folder') + 'New Album', fn: album.add }
	];

	basicContext.show(items, e);

	upload.notify();

}

contextMenu.settings = function(e) {

	var items = [
		{ type: 'item', title: build.iconic('person') + 'Change Login', fn: settings.setLogin },
		{ type: 'item', title: build.iconic('sort-ascending') + 'Change Sorting', fn: settings.setSorting },
		{ type: 'item', title: build.iconic('dropbox', 'ionicons', 'ionicons') + 'Set Dropbox', fn: settings.setDropboxKey },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('info') + 'About Lychee', fn: function() { window.open(lychee.website) } },
		{ type: 'item', title: build.iconic('wrench') + 'Diagnostics', fn: function() { window.open('plugins/check/') } },
		{ type: 'item', title: build.iconic('align-left') + 'Show Log', fn: function() { window.open('plugins/displaylog/') } },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('account-logout') + 'Sign Out', fn: lychee.logout }
	];

	basicContext.show(items, e);

}

contextMenu.album = function(albumID, e) {

	if (albumID==='0'||albumID==='f'||albumID==='s'||albumID==='r') return false;

	var items = [
		{ type: 'item', title: build.iconic('pencil') + 'Rename', fn: function() { album.setTitle([albumID]) } },
		{ type: 'item', title: build.iconic('trash') + 'Delete', fn: function() { album.delete([albumID]) } }
	];

	$('.album[data-id="' + albumID + '"]').addClass('active');

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.albumMulti = function(albumIDs, e) {

	multiselect.stopResize();

	var items = [
		{ type: 'item', title: build.iconic('pencil') + 'Rename All', fn: function() { album.setTitle(albumIDs) } },
		{ type: 'item', title: build.iconic('trash') + 'Delete All', fn: function() { album.delete(albumIDs) } }
	];

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.albumTitle = function(albumID, e) {

	var items = [
		{ type: 'item', title: build.iconic('pencil') + 'Rename', fn: function() { album.setTitle([albumID]) } }
	];

	api.post('Album::getAll', {}, function(data) {

		if (data.num>1) {

			items.push({ type: 'separator' });

			// Generate list of albums
			$.each(data.content, function(index) {

				var that	= this,
					title	= '';

				if (!that.thumb0) that.thumb0 = 'src/images/no_cover.svg';

				title = "<img class='cover' width='16' height='16' src='" + that.thumb0 + "'><div class='title'>" + that.title + "</div>";

				if (that.id!=albumID) items.push({ type: 'item', title, fn: function() { lychee.goto(that.id) } });

			});

		}

		basicContext.show(items, e, contextMenu.close);

	});

}

contextMenu.photo = function(photoID, e) {

	// Notice for 'Move':
	// fn must call basicContext.close() first,
	// in order to keep the selection

	var items = [
		{ type: 'item', title: build.iconic('star') + 'Star', fn: function() { photo.setStar([photoID]) } },
		{ type: 'item', title: build.iconic('tag') + 'Tags', fn: function() { photo.editTags([photoID]) } },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('pencil') + 'Rename', fn: function() { photo.setTitle([photoID]) } },
		{ type: 'item', title: build.iconic('layers') + 'Duplicate', fn: function() { photo.duplicate([photoID]) } },
		{ type: 'item', title: build.iconic('folder') + 'Move', fn: function() { basicContext.close(); contextMenu.move([photoID], e); } },
		{ type: 'item', title: build.iconic('trash') + 'Delete', fn: function() { photo.delete([photoID]) } }
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
		{ type: 'item', title: build.iconic('star') + 'Star All', fn: function() { photo.setStar(photoIDs) } },
		{ type: 'item', title: build.iconic('tag') + 'Tag All', fn: function() { photo.editTags(photoIDs) } },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('pencil') + 'Rename All', fn: function() { photo.setTitle(photoIDs) } },
		{ type: 'item', title: build.iconic('layers') + 'Duplicate All', fn: function() { photo.duplicate(photoIDs) } },
		{ type: 'item', title: build.iconic('folder') + 'Move All', fn: function() { basicContext.close(); contextMenu.move(photoIDs, e); } },
		{ type: 'item', title: build.iconic('trash') + 'Delete All', fn: function() { photo.delete(photoIDs) } }
	];

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.photoTitle = function(albumID, photoID, e) {

	var items = [
		{ type: 'item', title: build.iconic('pencil') + 'Rename', fn: function() { photo.setTitle([photoID]) } }
	];

	var data = album.json;

	if (data.num>1) {

		items.push({ type: 'separator' });

		// Generate list of albums
		$.each(data.content, function(index) {

			var that	= this,
				title	= '';

			title = "<img class='cover' width='16' height='16' src='" + that.thumbUrl + "'><div class='title'>" + that.title + "</div>";

			if (that.id!=photoID) items.push({ type: 'item', title, fn: function() { lychee.goto(albumID + '/' + that.id) } });

		});

	}

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.photoMore = function(photoID, e) {

	var items = [
		{ type: 'item', title: build.iconic('fullscreen-enter') + 'Full Photo', fn: function() { window.open(photo.getDirectLink()) } },
		{ type: 'item', title: build.iconic('cloud-download') + 'Download', fn: function() { photo.getArchive(photoID) } }
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
			{ type: 'item', title: 'Unsorted', fn: function() { photo.setAlbum(photoIDs, 0) } },
			{ type: 'separator' }
		];

	}

	api.post('Album::getAll', {}, function(data) {

		if (data.num===0) {

			// Show only 'Add album' when no album available
			items = [
				{ type: 'item', title: 'New Album', fn: album.add }
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

	var link	= photo.getViewLink(photoID),
		file	= 'ionicons';

	if (photo.json.public==='2') link = location.href;

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + link + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('twitter', file, file) + 'Twitter', fn: function() { photo.share(photoID, 0) } },
		{ type: 'item', title: build.iconic('facebook', file, file) + 'Facebook', fn: function() { photo.share(photoID, 1) } },
		{ type: 'item', title: build.iconic('envelope-closed') + 'Mail', fn: function() { photo.share(photoID, 2) } },
		{ type: 'item', title: build.iconic('dropbox', file, file) + 'Dropbox', fn: function() { photo.share(photoID, 3) } },
		{ type: 'item', title: build.iconic('link-intact') + 'Direct Link', fn: function() { window.open(photo.getDirectLink()) } },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('ban') + 'Make Private', fn: function() { photo.setPublic(photoID) } }
	];

	basicContext.show(items, e);
	$('.basicContext input#link').focus().select();

}

contextMenu.shareAlbum = function(albumID, e) {

	var file = 'ionicons';

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + location.href + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('twitter', file, file) + 'Twitter', fn: function() { album.share(0) } },
		{ type: 'item', title: build.iconic('facebook', file, file) + 'Facebook', fn: function() { album.share(1) } },
		{ type: 'item', title: build.iconic('envelope-closed') + 'Mail', fn: function() { album.share(2) } },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('ban') + 'Make Private', fn: function() { album.setPublic(albumID) } }
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