/**
 * @description This module is used for the context menu.
 * @copyright   2015 by Tobias Reich
 */

contextMenu = {}

contextMenu.add = function(e) {

	let items = [
		{ type: 'item', title: build.iconic('image') + 'Upload Photo', fn: () => $('#upload_files').click() },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('link-intact') + 'Import from Link', fn: upload.start.url },
		{ type: 'item', title: build.iconic('dropbox', 'ionicons') + 'Import from Dropbox', fn: upload.start.dropbox },
		{ type: 'item', title: build.iconic('terminal') + 'Import from Server', fn: upload.start.server },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('folder') + 'New Album', fn: album.add }
	]

	basicContext.show(items, e.originalEvent)

	upload.notify()

}

contextMenu.settings = function(e) {

	let items = [
		{ type: 'item', title: build.iconic('person') + 'Change Login', fn: settings.setLogin },
		{ type: 'item', title: build.iconic('sort-ascending') + 'Change Sorting', fn: settings.setSorting },
		{ type: 'item', title: build.iconic('dropbox', 'ionicons') + 'Set Dropbox', fn: settings.setDropboxKey },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('info') + 'About Lychee', fn: () => window.open(lychee.website) },
		{ type: 'item', title: build.iconic('wrench') + 'Diagnostics', fn: () => window.open('plugins/check/') },
		{ type: 'item', title: build.iconic('align-left') + 'Show Log', fn: () => window.open('plugins/displaylog/') },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('account-logout') + 'Sign Out', fn: lychee.logout }
	]

	basicContext.show(items, e.originalEvent)

}

contextMenu.album = function(albumID, e) {

	// Notice for 'Merge':
	// fn must call basicContext.close() first,
	// in order to keep the selection

	if (albumID==='0' || albumID==='f' || albumID==='s' || albumID==='r') return false

	// Show merge-item when there's more than one album
	let showMerge = (albums.json && albums.json.albums && Object.keys(albums.json.albums).length>1)

	let items = [
		{ type: 'item', title: build.iconic('pencil') + 'Rename', fn: () => album.setTitle([albumID]) },
		{ type: 'item', title: build.iconic('collapse-left') + 'Merge', visible: showMerge, fn: () => { basicContext.close(); contextMenu.mergeAlbum(albumID, e) } },
		{ type: 'item', title: build.iconic('trash') + 'Delete', fn: () => album.delete([albumID]) }
	]

	$('.album[data-id="' + albumID + '"]').addClass('active')

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.albumMulti = function(albumIDs, e) {

	multiselect.stopResize()

	// Automatically merge selected albums when albumIDs contains more than one album
	// Show list of albums otherwise
	let autoMerge = (albumIDs.length>1 ? true : false)

	// Show merge-item when there's more than one album
	let showMerge = (albums.json && albums.json.albums && Object.keys(albums.json.albums).length>1)

	let items = [
		{ type: 'item', title: build.iconic('pencil') + 'Rename All', fn: () => album.setTitle(albumIDs) },
		{ type: 'item', title: build.iconic('collapse-left') + 'Merge All', visible: showMerge && autoMerge, fn: () => album.merge(albumIDs) },
		{ type: 'item', title: build.iconic('collapse-left') + 'Merge', visible: showMerge && !autoMerge, fn: () => { basicContext.close(); contextMenu.mergeAlbum(albumIDs[0], e) } },
		{ type: 'item', title: build.iconic('trash') + 'Delete All', fn: () => album.delete(albumIDs) }
	]

	items.push()

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.albumTitle = function(albumID, e) {

	api.post('Album::getAll', {}, function(data) {

		let items = []

		if (data.albums && data.num>1) {

			// Generate list of albums
			$.each(data.albums, function() {

				if (!this.thumbs[0]) this.thumbs[0] = 'src/images/no_cover.svg'

				let title = `<img class='cover' width='16' height='16' src='${ this.thumbs[0] }'><div class='title'>${ this.title }</div>`

				if (this.id!=albumID) items.push({ type: 'item', title, fn: () => lychee.goto(this.id) })

			})

			items.unshift({ type: 'separator' })

		}

		items.unshift({ type: 'item', title: build.iconic('pencil') + 'Rename', fn: () => album.setTitle([albumID]) })

		basicContext.show(items, e.originalEvent, contextMenu.close)

	})

}

contextMenu.mergeAlbum = function(albumID, e) {

	api.post('Album::getAll', {}, function(data) {

		let items = []

		if (data.albums && data.num>1) {

			$.each(data.albums, function() {

				if (!this.thumbs[0]) this.thumbs[0] = 'src/images/no_cover.svg'

				let title = `<img class='cover' width='16' height='16' src='${ this.thumbs[0] }'><div class='title'>${ this.title }</div>`

				if (this.id!=albumID) items.push({ type: 'item', title, fn: () => album.merge([albumID, this.id]) })

			})

		}

		if (items.length===0) return false

		basicContext.show(items, e.originalEvent, contextMenu.close)

	})

}

contextMenu.photo = function(photoID, e) {

	// Notice for 'Move':
	// fn must call basicContext.close() first,
	// in order to keep the selection

	let items = [
		{ type: 'item', title: build.iconic('star') + 'Star', fn: () => photo.setStar([photoID]) },
		{ type: 'item', title: build.iconic('tag') + 'Tags', fn: () => photo.editTags([photoID]) },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('pencil') + 'Rename', fn: () => photo.setTitle([photoID]) },
		{ type: 'item', title: build.iconic('layers') + 'Duplicate', fn: () => photo.duplicate([photoID]) },
		{ type: 'item', title: build.iconic('folder') + 'Move', fn: () => { basicContext.close(); contextMenu.move([photoID], e) } },
		{ type: 'item', title: build.iconic('trash') + 'Delete', fn: () => photo.delete([photoID]) }
	]

	$('.photo[data-id="' + photoID + '"]').addClass('active')

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.photoMulti = function(photoIDs, e) {

	// Notice for 'Move All':
	// fn must call basicContext.close() first,
	// in order to keep the selection and multiselect

	multiselect.stopResize()

	let items = [
		{ type: 'item', title: build.iconic('star') + 'Star All', fn: () => photo.setStar(photoIDs) },
		{ type: 'item', title: build.iconic('tag') + 'Tag All', fn: () => photo.editTags(photoIDs) },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('pencil') + 'Rename All', fn: () => photo.setTitle(photoIDs) },
		{ type: 'item', title: build.iconic('layers') + 'Duplicate All', fn: () => photo.duplicate(photoIDs) },
		{ type: 'item', title: build.iconic('folder') + 'Move All', fn: () => { basicContext.close(); contextMenu.move(photoIDs, e) } },
		{ type: 'item', title: build.iconic('trash') + 'Delete All', fn: () => photo.delete(photoIDs) }
	]

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.photoTitle = function(albumID, photoID, e) {

	let items = [
		{ type: 'item', title: build.iconic('pencil') + 'Rename', fn: () => photo.setTitle([photoID]) }
	]

	let data = album.json

	if (data.content!==false && data.num>1) {

		items.push({ type: 'separator' })

		// Generate list of albums
		$.each(data.content, function(index) {

			let title = `<img class='cover' width='16' height='16' src='${ this.thumbUrl }'><div class='title'>${ this.title }</div>`

			if (this.id!=photoID) items.push({ type: 'item', title, fn: () => lychee.goto(albumID + '/' + this.id) })

		})

	}

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.photoMore = function(photoID, e) {

	// Show download-item when
	// a) Public mode is off
	// b) Downloadable is 1 and public mode is on
	let showDownload = lychee.publicMode===false || ((album.json && album.json.downloadable && album.json.downloadable==='1') && lychee.publicMode===true)

	let items = [
		{ type: 'item', title: build.iconic('fullscreen-enter') + 'Full Photo', fn: () => window.open(photo.getDirectLink()) },
		{ type: 'item', title: build.iconic('cloud-download') + 'Download', visible: showDownload, fn: () => photo.getArchive(photoID) }
	]

	basicContext.show(items, e.originalEvent)

}

contextMenu.move = function(photoIDs, e) {

	var items = []

	api.post('Album::getAll', {}, function(data) {

		if (data.num===0) {

			// Show only 'Add album' when no album available
			items = [
				{ type: 'item', title: 'New Album', fn: album.add }
			]

		} else {

			// Generate list of albums
			$.each(data.albums, function() {

				if (!this.thumbs[0]) this.thumbs[0] = 'src/images/no_cover.svg'

				let title = `<img class='cover' width='16' height='16' src='${ this.thumbs[0] }'><div class='title'>${ this.title }</div>`

				if (this.id!=album.getID()) items.push({ type: 'item', title, fn: () => photo.setAlbum(photoIDs, this.id) })

			})

			// Show Unsorted when unsorted is not the current album
			if (album.getID()!=='0') {

				items.unshift({ type: 'separator' })
				items.unshift({ type: 'item', title: 'Unsorted', fn: () => photo.setAlbum(photoIDs, 0) })

			}

		}

		basicContext.show(items, e.originalEvent, contextMenu.close)

	})

}

contextMenu.sharePhoto = function(photoID, e) {

	let link      = photo.getViewLink(photoID),
		iconClass = 'ionicons'

	if (photo.json.public==='2') link = location.href

	let items = [
		{ type: 'item', title: `<input readonly id="link" value="${ link }">`, fn: () => {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('twitter', iconClass) + 'Twitter', fn: () => photo.share(photoID, 'twitter') },
		{ type: 'item', title: build.iconic('facebook', iconClass) + 'Facebook', fn: () => photo.share(photoID, 'facebook') },
		{ type: 'item', title: build.iconic('envelope-closed') + 'Mail', fn: () => photo.share(photoID, 'mail') },
		{ type: 'item', title: build.iconic('dropbox', iconClass) + 'Dropbox', fn: () => photo.share(photoID, 'dropbox') },
		{ type: 'item', title: build.iconic('link-intact') + 'Direct Link', fn: () => window.open(photo.getDirectLink()) },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('ban') + 'Make Private', fn: () => photo.setPublic(photoID) }
	]

	basicContext.show(items, e.originalEvent)
	$('.basicContext input#link').focus().select()

}

contextMenu.shareAlbum = function(albumID, e) {

	let iconClass = 'ionicons'

	let items = [
		{ type: 'item', title: `<input readonly id="link" value="${ location.href }">`, fn: () => {}, class: 'noHover' },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('twitter', iconClass) + 'Twitter', fn: () => album.share('twitter') },
		{ type: 'item', title: build.iconic('facebook', iconClass) + 'Facebook', fn: () => album.share('facebook') },
		{ type: 'item', title: build.iconic('envelope-closed') + 'Mail', fn: () => album.share('mail') },
		{ type: 'separator' },
		{ type: 'item', title: build.iconic('pencil') + 'Edit Sharing', fn: () => album.setPublic(albumID, true, e) },
		{ type: 'item', title: build.iconic('ban') + 'Make Private', fn: () => album.setPublic(albumID, false) }
	]

	basicContext.show(items, e.originalEvent)
	$('.basicContext input#link').focus().select()

}

contextMenu.close = function() {

	if (!visible.contextMenu()) return false

	basicContext.close()

	$('.photo.active, .album.active').removeClass('active')
	if (visible.multiselect()) multiselect.close()

}