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
		{ type: 'item', title: build.iconic('dropbox', 'ionicons') + 'Import from Dropbox', fn: upload.start.dropbox },
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
		{ type: 'item', title: build.iconic('dropbox', 'ionicons') + 'Set Dropbox', fn: settings.setDropboxKey },
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

	// Notice for 'Merge':
	// fn must call basicContext.close() first,
	// in order to keep the selection

	if (albumID==='0'||albumID==='f'||albumID==='s'||albumID==='r') return false;

	var items = [
		{ type: 'item', title: build.iconic('pencil') + 'Rename', fn: function() { album.setTitle([albumID]) } },
		{ type: 'item', title: build.iconic('collapse-left') + 'Merge', fn: function () { basicContext.close(); contextMenu.mergeAlbum(albumID, e) } },
		{ type: 'item', title: build.iconic('trash') + 'Delete', fn: function() { album.delete([albumID]) } }
	];

	// Remove merge when there is only one album
	if (albums.json&&albums.json.albums&&Object.keys(albums.json.albums).length<=1) items.splice(1, 1);

	$('.album[data-id="' + albumID + '"]').addClass('active');

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.albumMulti = function(albumIDs, e) {

	multiselect.stopResize();

	var items = [
		{ type: 'item', title: build.iconic('pencil') + 'Rename All', fn: function() { album.setTitle(albumIDs) } },
		{ type: 'item', title: build.iconic('collapse-left') + 'Merge All', fn: function () { album.merge(albumIDs) } },
		{ type: 'item', title: build.iconic('trash') + 'Delete All', fn: function() { album.delete(albumIDs) } }
	];

	basicContext.show(items, e, contextMenu.close);

}

contextMenu.albumTitle = function(albumID, e) {

	var items = [];

	api.post('Album::getAll', {}, function(data) {

		if (data.num>1) {

			// Generate list of albums
			$.each(data.albums, function(index) {

				var that	= this,
					title	= '';

				if (!that.thumbs[0]) that.thumbs[0] = 'src/images/no_cover.svg';

				title = "<img class='cover' width='16' height='16' src='" + that.thumbs[0] + "'><div class='title'>" + that.title + "</div>";

				if (that.id!=albumID) items.unshift({ type: 'item', title, fn: function() { lychee.goto(that.id) } });

			});

			items.unshift({ type: 'separator' });

		}

		items.unshift({ type: 'item', title: build.iconic('pencil') + 'Rename', fn: function() { album.setTitle([albumID]) } });

		basicContext.show(items, e, contextMenu.close);

	});

}

contextMenu.mergeAlbum = function(albumID, e) {

    var items = [];

    api.post('Album::getAll', {}, function(data) {

        $.each(data.albums, function(){

            var that = this;

            if (!that.thumbs[0]) that.thumbs[0] = 'src/images/no_cover.svg';
            that.contextTitle = "<img class='cover' width='16' height='16' src='" + that.thumbs[0] + "'><div class='title'>" + that.title + "</div>";

            if (that.id!=album.getID()) {
                items.unshift({ type: 'item', title: that.contextTitle, fn: function() { album.merge([albumID, that.id]) } });
            }

        });

        if (items.length===0) return false;

        basicContext.show(items, e, contextMenu.close);

    })

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

	api.post('Album::getAll', {}, function(data) {

		if (data.num===0) {

			// Show only 'Add album' when no album available
			items = [
				{ type: 'item', title: 'New Album', fn: album.add }
			];

		} else {

			// Generate list of albums
			$.each(data.albums, function(index) {

				var that = this;

				if (!that.thumbs[0]) that.thumbs[0] = 'src/images/no_cover.svg';
				that.title = "<img class='cover' width='16' height='16' src='" + that.thumbs[0] + "'><div class='title'>" + that.title + "</div>";

				if (that.id!=album.getID()) items.unshift({ type: 'item', title: that.title, fn: function() { photo.setAlbum(photoIDs, that.id) } });

			});

			// Show Unsorted when unsorted is not the current album
			if (album.getID()!=='0') {

				items.unshift({ type: 'separator' });
				items.unshift({ type: 'item', title: 'Unsorted', fn: function() { photo.setAlbum(photoIDs, 0) } });

			}

		}

		basicContext.show(items, e, contextMenu.close);

	});

}

contextMenu.sharePhoto = function(photoID, e) {

	var link		= photo.getViewLink(photoID),
		iconClass	= 'ionicons';

	if (photo.json.public==='2') link = location.href;

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + link + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('twitter', iconClass) + 'Twitter', fn: function() { photo.share(photoID, 0) } },
		{ type: 'item', title: build.iconic('facebook', iconClass) + 'Facebook', fn: function() { photo.share(photoID, 1) } },
		{ type: 'item', title: build.iconic('envelope-closed') + 'Mail', fn: function() { photo.share(photoID, 2) } },
		{ type: 'item', title: build.iconic('dropbox', iconClass) + 'Dropbox', fn: function() { photo.share(photoID, 3) } },
		{ type: 'item', title: build.iconic('link-intact') + 'Direct Link', fn: function() { window.open(photo.getDirectLink()) } },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('ban') + 'Make Private', fn: function() { photo.setPublic(photoID) } }
	];

	basicContext.show(items, e);
	$('.basicContext input#link').focus().select();

}

contextMenu.shareAlbum = function(albumID, e) {

	var iconClass = 'ionicons';

	var items = [
		{ type: 'item', title: '<input readonly id="link" value="' + location.href + '">', fn: function() {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('twitter', iconClass) + 'Twitter', fn: function() { album.share(0) } },
		{ type: 'item', title: build.iconic('facebook', iconClass) + 'Facebook', fn: function() { album.share(1) } },
		{ type: 'item', title: build.iconic('envelope-closed') + 'Mail', fn: function() { album.share(2) } },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('pencil') + 'Edit Sharing', fn: function() { album.setPublic(albumID, true, e) } },
		{ type: 'item', title: build.iconic('ban') + 'Make Private', fn: function() { album.setPublic(albumID, false) } }
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