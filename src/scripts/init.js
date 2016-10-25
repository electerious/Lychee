/**
 * @description This module is used for bindings.
 */

$(document).ready(function() {

	// Event Name
	let eventName = lychee.getEventName()

	// Set API error handler
	api.onError = lychee.error

	// Multiselect
	multiselect.bind()

	// Header
	header.bind()

	// Image View
	lychee.imageview
		.on(eventName, '.arrow_wrapper--previous', photo.previous)
		.on(eventName, '.arrow_wrapper--next',     photo.next)

	// Keyboard
	Mousetrap
		.bind([ 'left' ], function() {
			if (visible.photo()) { $('#imageview a#previous').click(); return false }
		})
		.bind([ 'right' ], function() {
			if (visible.photo()) { $('#imageview a#next').click(); return false }
		})
		.bind([ 'u' ], function() {
			if (!visible.photo()) { $('#upload_files').click(); return false }
		})
		.bind([ 's', 'f' ], function() {
			if (visible.photo())       { header.dom('#button_star').click(); return false }
			else if (visible.albums()) { header.dom('.header__search').focus(); return false }
		})
		.bind([ 'r' ], function() {
			if (visible.album())      { album.setTitle(album.getID()); return false }
			else if (visible.photo()) { photo.setTitle([photo.getID()]); return false }
		})
		.bind([ 'd' ], function() {
			if (visible.photo())      { photo.setDescription(photo.getID()); return false }
			else if (visible.album()) { album.setDescription(album.getID()); return false }
		})
		.bind([ 't' ], function() {
			if (visible.photo()) { photo.editTags([photo.getID()]); return false }
		})
		.bind([ 'i' ], function() {
			if (!visible.multiselect()) { sidebar.toggle(); return false }
		})
		.bind([ 'command+backspace', 'ctrl+backspace' ], function() {
			if (visible.photo() && basicModal.visible()===false)      { photo.delete([photo.getID()]); return false }
			else if (visible.album() && basicModal.visible()===false) { album.delete([album.getID()]); return false }
		})

	Mousetrap.bindGlobal('enter', function() {
		if (basicModal.visible()===true) basicModal.action()
	})

	Mousetrap.bindGlobal([ 'esc', 'command+up' ], function() {
		if (basicModal.visible()===true)                                             basicModal.cancel()
		else if (visible.contextMenu())                                              contextMenu.close()
		else if (visible.photo())                                                    lychee.goto(album.getID())
		else if (visible.album())                                                    lychee.goto(album.getParent())
		else if (visible.albums() && header.dom('.header__search').val().length!==0) search.reset()
		return false
	})

	if (eventName==='touchend') {

		$(document)

			// Fullscreen on mobile
			.on('touchend', '#imageview #image', function(e) {
				if (swipe.obj==null || (swipe.offset>=-5&&swipe.offset<=5)) {
					if (visible.header()) header.hide(e)
					else                  header.show()
				}
			})

			// Swipe on mobile
			.swipe().on('swipeStart', function() { if (visible.photo()) swipe.start($('#imageview #image')) })
			.swipe().on('swipeMove',  function(e) { if (visible.photo()) swipe.move(e.swipe) })
			.swipe().on('swipeEnd',   function(e) { if (visible.photo()) swipe.stop(e.swipe, photo.previous, photo.next) })

	}

	// Document
	$(document)

		// Navigation
		.on('click', '.album', function(e) { multiselect.albumClick(e, $(this)) })
		.on('click', '.photo', function(e) { multiselect.photoClick(e, $(this)) })

		// Context Menu
		.on('contextmenu', '.photo', function(e) { multiselect.photoContextMenu(e, $(this)) })
		.on('contextmenu', '.album', function(e) { multiselect.albumContextMenu(e, $(this)) })

		// Upload
		.on('change', '#upload_files', function() { basicModal.close(); upload.start.local(this.files) })

		// Drag and Drop upload
		.on('dragover', function() { return false }, false)
		.on('drop', function(e) {

			// Close open overlays or views which are correlating with the upload
			if (visible.photo())       lychee.goto(album.getID())
			if (visible.contextMenu()) contextMenu.close()

			// Detect if dropped item is a file or a link
			if (e.originalEvent.dataTransfer.files.length>0)                upload.start.local(e.originalEvent.dataTransfer.files)
			else if (e.originalEvent.dataTransfer.getData('Text').length>3) upload.start.url(e.originalEvent.dataTransfer.getData('Text'))

			return false

		})

	// Init
	lychee.init()

})