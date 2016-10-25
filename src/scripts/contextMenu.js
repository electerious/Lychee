/**
 * @description This module is used for the context menu.
 */

const buildAlbumList = function(albums, exclude, action, parent = 0, layer = 0) {

	let items = []

	for (i in albums) {
		if ((layer==0 && !albums[i].parent) || albums[i].parent==parent) {

			let album = albums[i]

			let thumb = 'src/images/no_cover.svg'
			if (album.thumbs && album.thumbs[0]) thumb = album.thumbs[0]
			else if (album.thumbUrl)             thumb = album.thumbUrl

			if (album.title==='') album.title = 'Untitled'

			let prefix = (layer > 0 ? '&nbsp;&nbsp;'.repeat(layer - 1) + '└ ' : '')

			let html = lychee.html`
			           ${ prefix }
			           <img class='cover' width='16' height='16' src='$${ thumb }'>
			           <div class='title'>$${ album.title }</div>
			           `

			items.push({
				title: html,
				disabled: (exclude.indexOf(album.id)!==-1),
				fn: () => action(album)
			})

			items = items.concat(buildAlbumList(albums, exclude, action, album.id, layer + 1))

		}
	}

	return items

}

const getAlbumFrom = function(albums, id) {

	for (a in albums) {
		if (albums[a].id == id) return albums[a]
	}

	return null

}

const getSubIDs = function(albums, albumID) {

	let ids = [ albumID ]

	for (a in albums) {
		if (albums[a].parent==albumID) {

			let sub = getSubIDs(albums, albums[a].id)
			for (id in sub)
				ids.push(sub[id])

		}
	}

	return ids

}

contextMenu = {}

contextMenu.add = function(albumID, e) {

	let items = [
		{ title: build.iconic('image') + 'Upload Photo', fn: () => $('#upload_files').click() },
		{ },
		{ title: build.iconic('link-intact') + 'Import from Link', fn: upload.start.url },
		{ title: build.iconic('dropbox', 'ionicons') + 'Import from Dropbox', fn: upload.start.dropbox },
		{ title: build.iconic('terminal') + 'Import from Server', fn: upload.start.server },
		{ },
		{ title: build.iconic('folder') + 'New Album', fn: () => album.add(albumID) }
	]

	basicContext.show(items, e.originalEvent)

	upload.notify()

}

contextMenu.settings = function(e) {

	let items = [
		{ title: build.iconic('person') + 'Change Login', fn: settings.setLogin },
		{ title: build.iconic('sort-ascending') + 'Change Sorting', fn: settings.setSorting },
		{ title: build.iconic('dropbox', 'ionicons') + 'Set Dropbox', fn: settings.setDropboxKey },
		{ },
		{ title: build.iconic('info') + 'About Lychee', fn: () => window.open(lychee.website) },
		{ title: build.iconic('wrench') + 'Diagnostics', fn: () => window.open('plugins/Diagnostics/') },
		{ title: build.iconic('align-left') + 'Show Log', fn: () => window.open('plugins/Log/') },
		{ },
		{ title: build.iconic('account-logout') + 'Sign Out', fn: lychee.logout }
	]

	basicContext.show(items, e.originalEvent)

}

contextMenu.album = function(albumID, e) {

	// Notice for 'Merge':
	// fn must call basicContext.close() first,
	// in order to keep the selection

	if (album.isSmartID(albumID)) return false

	let items = [
		{ title: build.iconic('pencil') + 'Rename', fn: () => album.setTitle([ albumID ]) },
		{ title: build.iconic('collapse-left') + 'Merge', fn: () => { basicContext.close(); contextMenu.mergeAlbum(albumID, e) } },
		{ title: build.iconic('folder') + 'Move', fn: () => { basicContext.close(); contextMenu.moveAlbum([ albumID ], e) } },
		{ title: build.iconic('trash') + 'Delete', fn: () => album.delete([ albumID ]) }
	]

	multiselect.select('.album[data-id="' + albumID + '"]')

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.albumMulti = function(albumIDs, e) {

	multiselect.stopResize()

	// Automatically merge selected albums when albumIDs contains more than one album
	// Show list of albums otherwise
	let autoMerge = (albumIDs.length>1 ? true : false)

	let items = [
		{ title: build.iconic('pencil') + 'Rename All', fn: () => album.setTitle(albumIDs) },
		{ title: build.iconic('collapse-left') + 'Merge All', visible: autoMerge, fn: () => album.merge(albumIDs) },
		{ title: build.iconic('collapse-left') + 'Merge', visible: !autoMerge, fn: () => { basicContext.close(); contextMenu.mergeAlbum(albumIDs[0], e) } },
		{ title: build.iconic('folder') + 'Move All', fn: () => { basicContext.close(); contextMenu.moveAlbum(albumIDs, e) } },
		{ title: build.iconic('trash') + 'Delete All', fn: () => album.delete(albumIDs) }
	]

	items.push()

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.albumTitle = function(albumID, e) {

	api.post('Albums::get', { parent: -1 }, function(data) {

		let items = []

		if (data.albums && data.num>1) {

			items = buildAlbumList(data.albums, [ albumID ], (a) => lychee.goto(a.id))

			items.unshift({ })

		}

		items.unshift({ title: build.iconic('pencil') + 'Rename', fn: () => album.setTitle([ albumID ]) })

		basicContext.show(items, e.originalEvent, contextMenu.close)

	})

}

contextMenu.mergeAlbum = function(albumID, e) {

	api.post('Albums::get', { parent: -1 }, function(data) {

		let items = []

		if (data.albums && data.num>1) {

			let selalbum = albums.getByID(albumID)
			let title = selalbum.title

			// Disable all parents
			// It's not possible to move them into us
			let exclude = [ albumID ]
			let a = getAlbumFrom(data.albums, selalbum.parent)
			while (a!=null) {
				exclude.push(a.id)
				a = getAlbumFrom(data.albums, a.parent)
			}

			items = buildAlbumList(data.albums, exclude, (a) => album.merge([ albumID, a.id ], [ title, a.title ]))

		}

		if (items.length===0) return false

		basicContext.show(items, e.originalEvent, contextMenu.close)

	})

}

contextMenu.moveAlbum = function(albumIDs, e) {

	api.post('Albums::get', { parent: -1 }, function(data) {

		let items = []

		if (data.albums && data.num>1) {

			let title = albums.getByID(albumIDs[0]).title
			// Disable all childs
			// It's not possible to move us into them
			let exclude = []
			for (i in albumIDs) {
				let sub = getSubIDs(data.albums, String(albumIDs[i]))
				for (s in sub)
					exclude.push(sub[s])
			}

			items = buildAlbumList(data.albums, exclude, (a) => album.move([ a.id ].concat(albumIDs), [ a.title, title ]), 0, 1)

			items.unshift({ title: 'Root', fn: () => album.move([ 0 ].concat(albumIDs), [ 'Root', title ]) })

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
		{ title: build.iconic('star') + 'Star', fn: () => photo.setStar([ photoID ]) },
		{ title: build.iconic('tag') + 'Tags', fn: () => photo.editTags([ photoID ]) },
		{ },
		{ title: build.iconic('pencil') + 'Rename', fn: () => photo.setTitle([ photoID ]) },
		{ title: build.iconic('layers') + 'Duplicate', fn: () => photo.duplicate([ photoID ]) },
		{ title: build.iconic('folder') + 'Move', fn: () => { basicContext.close(); contextMenu.move([ photoID ], e) } },
		{ title: build.iconic('trash') + 'Delete', fn: () => photo.delete([ photoID ]) }
	]

	multiselect.select('.photo[data-id="' + photoID + '"]')

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.photoMulti = function(photoIDs, e) {

	multiselect.stopResize()

	// Notice for 'Move All':
	// fn must call basicContext.close() first,
	// in order to keep the selection and multiselect

	let items = [
		{ title: build.iconic('star') + 'Star All', fn: () => photo.setStar(photoIDs) },
		{ title: build.iconic('tag') + 'Tag All', fn: () => photo.editTags(photoIDs) },
		{ },
		{ title: build.iconic('pencil') + 'Rename All', fn: () => photo.setTitle(photoIDs) },
		{ title: build.iconic('layers') + 'Duplicate All', fn: () => photo.duplicate(photoIDs) },
		{ title: build.iconic('folder') + 'Move All', fn: () => { basicContext.close(); contextMenu.move(photoIDs, e) } },
		{ title: build.iconic('trash') + 'Delete All', fn: () => photo.delete(photoIDs) }
	]

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.photoTitle = function(albumID, photoID, e) {

	let items = [
		{ title: build.iconic('pencil') + 'Rename', fn: () => photo.setTitle([ photoID ]) }
	]

	let data = album.json

	if (data.content!==false && data.num>1) {

		items.push({ })

		items = items.concat(buildAlbumList(data.content, [ photoID ], (a) => lychee.goto(albumID + '/' + a.id)))

	}

	basicContext.show(items, e.originalEvent, contextMenu.close)

}

contextMenu.photoMore = function(photoID, e) {

	// Show download-item when
	// a) Public mode is off
	// b) Downloadable is 1 and public mode is on
	let showDownload = lychee.publicMode===false || ((album.json && album.json.downloadable && album.json.downloadable==='1') && lychee.publicMode===true)

	let items = [
		{ title: build.iconic('fullscreen-enter') + 'Full Photo', fn: () => window.open(photo.getDirectLink()) },
		{ title: build.iconic('cloud-download') + 'Download', visible: showDownload, fn: () => photo.getArchive(photoID) }
	]

	basicContext.show(items, e.originalEvent)

}

contextMenu.move = function(photoIDs, e) {

	let items = []

	api.post('Albums::get', { parent: -1 }, function(data) {

		if (data.num===0) {

			// Show only 'Add album' when no album available
			items = [
				{ title: 'New Album', fn: album.add }
			]

		} else {

			items = buildAlbumList(data.albums, [ album.getID() ], (a) => photo.setAlbum(photoIDs, a.id))

			// Show Unsorted when unsorted is not the current album
			if (album.getID()!=='0') {

				items.unshift({ })
				items.unshift({ title: 'Unsorted', fn: () => photo.setAlbum(photoIDs, 0) })

			}

		}

		basicContext.show(items, e.originalEvent, contextMenu.close)

	})

}

contextMenu.sharePhoto = function(photoID, e) {

	let link      = photo.getViewLink(photoID)
	let iconClass = 'ionicons'

	let items = [
		{ title: `<input readonly id="link" value="${ link }">`, fn: () => {}, class: 'basicContext__item--noHover' },
		{ },
		{ title: build.iconic('twitter', iconClass) + 'Twitter', fn: () => photo.share(photoID, 'twitter') },
		{ title: build.iconic('facebook', iconClass) + 'Facebook', fn: () => photo.share(photoID, 'facebook') },
		{ title: build.iconic('envelope-closed') + 'Mail', fn: () => photo.share(photoID, 'mail') },
		{ title: build.iconic('dropbox', iconClass) + 'Dropbox', visible: lychee.publicMode===false, fn: () => photo.share(photoID, 'dropbox') },
		{ title: build.iconic('link-intact') + 'Direct Link', fn: () => window.open(photo.getDirectLink()) },
		{ },
		{ title: build.iconic('ban') + 'Make Private', visible: lychee.publicMode===false, fn: () => photo.setPublic(photoID) }
	]

	if (lychee.publicMode===true) items.splice(7, 1)

	basicContext.show(items, e.originalEvent)
	$('.basicContext input#link').focus().select()

}

contextMenu.shareAlbum = function(albumID, e) {

	let iconClass = 'ionicons'

	let items = [
		{ title: `<input readonly id="link" value="${ location.href }">`, fn: () => {}, class: 'basicContext__item--noHover' },
		{ },
		{ title: build.iconic('twitter', iconClass) + 'Twitter', fn: () => album.share('twitter') },
		{ title: build.iconic('facebook', iconClass) + 'Facebook', fn: () => album.share('facebook') },
		{ title: build.iconic('envelope-closed') + 'Mail', fn: () => album.share('mail') },
		{ },
		{ title: build.iconic('pencil') + 'Edit Sharing', visible: lychee.publicMode===false, fn: () => album.setPublic(albumID, true, e) },
		{ title: build.iconic('ban') + 'Make Private', visible: lychee.publicMode===false, fn: () => album.setPublic(albumID, false) }
	]

	if (lychee.publicMode===true) items.splice(5, 1)

	basicContext.show(items, e.originalEvent)
	$('.basicContext input#link').focus().select()

}

contextMenu.close = function() {

	if (!visible.contextMenu()) return false

	basicContext.close()

	multiselect.deselect('.photo.active, .album.active')
	if (visible.multiselect()) multiselect.close()

}