/**
 * @description This module takes care of the header.
 */

header = {

	_dom: $('.header')

}

header.dom = function(selector) {

	if (selector==null || selector==='') return header._dom
	return header._dom.find(selector)

}

header.bind = function() {

	// Event Name
	let eventName = lychee.getEventName()

	header.dom('.header__title').on(eventName, function(e) {

		if ($(this).hasClass('header__title--editable')===false) return false

		if (visible.photo()) contextMenu.photoTitle(album.getID(), photo.getID(), e)
		else                 contextMenu.albumTitle(album.getID(), e)

	})

	header.dom('#button_share').on(eventName, function(e) {
		if (photo.json.public==='1' || photo.json.public==='2') contextMenu.sharePhoto(photo.getID(), e)
		else                                                    photo.setPublic(photo.getID(), e)
	})

	header.dom('#button_share_album').on(eventName, function(e) {
		if (album.json.public==='1') contextMenu.shareAlbum(album.getID(), e)
		else                         album.setPublic(album.getID(), true, e)
	})

	header.dom('#button_signin')      .on(eventName, lychee.loginDialog)
	header.dom('#button_settings')    .on(eventName, contextMenu.settings)
	header.dom('#button_info_album')  .on(eventName, sidebar.toggle)
	header.dom('#button_info')        .on(eventName, sidebar.toggle)
	header.dom('.button_add')         .on(eventName, function(e) { contextMenu.add(album.getID(), e) })
	header.dom('#button_more')        .on(eventName, function(e) { contextMenu.photoMore(photo.getID(), e) })
	header.dom('#button_move')        .on(eventName, function(e) { contextMenu.move([ photo.getID() ], e) })
	header.dom('.header__hostedwith') .on(eventName, function() { window.open(lychee.website) })
	header.dom('#button_trash_album') .on(eventName, function() { album.delete([ album.getID() ]) })
	header.dom('#button_trash')       .on(eventName, function() { photo.delete([ photo.getID() ]) })
	header.dom('#button_archive')     .on(eventName, function() { album.getArchive(album.getID()) })
	header.dom('#button_star')        .on(eventName, function() { photo.setStar([ photo.getID() ]) })
	header.dom('#button_back_home')   .on(eventName, function() { lychee.goto(album.getParent()) })
	header.dom('#button_back')        .on(eventName, function() { lychee.goto(album.getID()) })

	header.dom('.header__search').on('keyup click', function() { search.find($(this).val()) })
	header.dom('.header__clear').on(eventName, function() {
		header.dom('.header__search').focus()
		search.reset()
	})

	return true

}

header.show = function() {

	lychee.imageview.removeClass('full')
	header.dom().removeClass('header--hidden')

	return true

}

header.hide = function(e) {

	if (visible.photo() && !visible.sidebar() && !visible.contextMenu() && basicModal.visible()===false) {

		lychee.imageview.addClass('full')
		header.dom().addClass('header--hidden')

		return true

	}

	return false

}

header.setTitle = function(title = 'Untitled') {

	let $title = header.dom('.header__title')
	let html   = lychee.html`$${ title }${ build.iconic('caret-bottom') }`

	$title.html(html)

	return true

}

header.setMode = function(mode) {

	if (mode==='albums' && lychee.publicMode===true) mode = 'public'

	switch (mode) {

		case 'public':

			header.dom().removeClass('header--view')
			header.dom('.header__toolbar--albums, .header__toolbar--album, .header__toolbar--photo').removeClass('header__toolbar--visible')
			header.dom('.header__toolbar--public').addClass('header__toolbar--visible')

			return true
			break

		case 'albums':

			header.dom().removeClass('header--view')
			header.dom('.header__toolbar--public, .header__toolbar--album, .header__toolbar--photo').removeClass('header__toolbar--visible')
			header.dom('.header__toolbar--albums').addClass('header__toolbar--visible')

			return true
			break

		case 'album':

			let albumID = album.getID()

			header.dom().removeClass('header--view')
			header.dom('.header__toolbar--public, .header__toolbar--albums, .header__toolbar--photo').removeClass('header__toolbar--visible')
			header.dom('.header__toolbar--album').addClass('header__toolbar--visible')

			// Hide download button when album empty
			if (album.json.content===false && album.subjson.num==0) $('#button_archive').hide()
			else                                                    $('#button_archive').show()

			// Hide download button when not logged in and album not downloadable
			if (lychee.publicMode===true && album.json.downloadable==='0') $('#button_archive').hide()

			if (albumID==='s' || albumID==='f' || albumID==='r') {
				$('#button_info_album, #button_trash_album, #button_share_album').hide()
			} else if (albumID==='0') {
				$('#button_info_album, #button_share_album').hide()
				$('#button_trash_album').show()
			} else {
				$('#button_info_album, #button_trash_album, #button_share_album').show()
			}

			return true
			break

		case 'photo':

			header.dom().addClass('header--view')
			header.dom('.header__toolbar--public, .header__toolbar--albums, .header__toolbar--album').removeClass('header__toolbar--visible')
			header.dom('.header__toolbar--photo').addClass('header__toolbar--visible')

			return true
			break

	}

	return false

}

header.setEditable = function(editable) {

	let $title = header.dom('.header__title')

	// Hide editable icon when not logged in
	if (lychee.publicMode===true) editable = false

	if (editable) $title.addClass('header__title--editable')
	else          $title.removeClass('header__title--editable')

	return true

}