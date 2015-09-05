/**
 * @description This module takes care of the header.
 * @copyright   2015 by Tobias Reich
 */

header = {

	_dom: $('header')

}

header.dom = function(selector) {

	if (selector==null || selector==='') return header._dom
	return header._dom.find(selector)

}

header.bind = function() {

	// Event Name
	let eventName = lychee.getEventName()

	/* Buttons */
	header.dom('#title').on(eventName, function(e) {
		if (!$(this).hasClass('editable')) return false
		if (visible.photo())               contextMenu.photoTitle(album.getID(), photo.getID(), e)
		else                               contextMenu.albumTitle(album.getID(), e)
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
	header.dom('.button_add')         .on(eventName, contextMenu.add)
	header.dom('#button_more')        .on(eventName, function(e) { contextMenu.photoMore(photo.getID(), e) })
	header.dom('#button_move')        .on(eventName, function(e) { contextMenu.move([photo.getID()], e) })
	header.dom('#hostedwith')         .on(eventName, function() { window.open(lychee.website) })
	header.dom('#button_trash_album') .on(eventName, function() { album.delete([album.getID()]) })
	header.dom('#button_trash')       .on(eventName, function() { photo.delete([photo.getID()]) })
	header.dom('#button_archive')     .on(eventName, function() { album.getArchive(album.getID()) })
	header.dom('#button_star')        .on(eventName, function() { photo.setStar([photo.getID()]) })
	header.dom('#button_back_home')   .on(eventName, function() { lychee.goto('') })
	header.dom('#button_back')        .on(eventName, function() { lychee.goto(album.getID()) })

	/* Search */
	header.dom('#search').on('keyup click', function() { search.find($(this).val()) })
	header.dom('#clearSearch').on(eventName, function () {
		header.dom('#search').focus()
		search.reset()
	})

	return true

}

header.show = function() {

	let newMargin = (-1 * ($('#imageview #image').height()/2) + 20)

	clearTimeout($(window).data('timeout'))

	lychee.imageview.removeClass('full')
	header.dom().removeClass('hidden')

	// Adjust position or size of photo
	if ($('#imageview #image.small').length>0) $('#imageview #image').css('margin-top', newMargin)
	else                                       $('#imageview #image').removeClass('full')

	return true

}

header.hide = function(e, delay = 500) {

	if (visible.photo() && !visible.sidebar() && !visible.contextMenu() && basicModal.visible()===false) {

		clearTimeout($(window).data('timeout'))

		$(window).data('timeout', setTimeout(function() {

			let newMargin = (-1 * ($('#imageview #image').height()/2))

			lychee.imageview.addClass('full')
			header.dom().addClass('hidden')

			// Adjust position or size of photo
			if ($('#imageview #image.small').length>0) $('#imageview #image').css('margin-top', newMargin)
			else                                       $('#imageview #image').addClass('full')

		}, delay))

		return true

	}

	return false

}

header.setTitle = function(title = 'Untitled') {

	let $title = header.dom('#title'),
	    html   = lychee.html`$${ title }${ build.iconic('caret-bottom') }`

	$title.html(html)

	return true

}

header.setMode = function(mode) {

	let albumID = album.getID()

	switch (mode) {

		case 'albums':

			header.dom().removeClass('view')
			$('#tools_album, #tools_photo').hide()
			$('#tools_albums').show()

			return true
			break

		case 'album':

			header.dom().removeClass('view')
			$('#tools_albums, #tools_photo').hide()
			$('#tools_album').show()

			// Hide download button when album empty
			album.json.content === false ? $('#button_archive').hide() : $('#button_archive').show()

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

			header.dom().addClass('view')
			$('#tools_albums, #tools_album').hide()
			$('#tools_photo').show()

			return true
			break

	}

	return false

}

header.setEditable = function(editable) {

	let $title = header.dom('#title')

	// Hide editable icon when not logged in
	if (lychee.publicMode===true) editable = false

	if (editable) $title.addClass('editable')
	else          $title.removeClass('editable')

	return true

}