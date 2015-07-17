/**
 * @description Select multiple albums or photos.
 * @copyright   2015 by Tobias Reich
 */

multiselect = {}

multiselect.position = {

	top    : null,
	right  : null,
	bottom : null,
	left   : null

}

multiselect.bind = function() {

	$('#content').on('mousedown', (e) => { if (e.which===1) multiselect.show(e) })

	return true

}

multiselect.show = function(e) {

	if (lychee.publicMode)                          return false
	if (!visible.albums() && !visible.album())      return false
	if ($('.album:hover, .photo:hover').length!==0) return false
	if (visible.search())                           return false
	if (visible.multiselect())                      $('#multiselect').remove()

	sidebar.setSelectable(false)

	multiselect.position.top    = e.pageY
	multiselect.position.right  = -1 * (e.pageX - $(document).width())
	multiselect.position.bottom = -1 * (multiselect.position.top - $(window).height())
	multiselect.position.left   = e.pageX

	$('body').append(build.multiselect(multiselect.position.top, multiselect.position.left))

	$(document)
		.on('mousemove', multiselect.resize)
		.on('mouseup', (e) => { if (e.which===1) multiselect.getSelection(e) })

}

multiselect.selectAll = function() {

	if (lychee.publicMode)                   return false
	if (visible.search())                    return false
	if (!visible.albums() && !visible.album) return false
	if (visible.multiselect())               $('#multiselect').remove()

	sidebar.setSelectable(false)

	multiselect.position.top    = 70
	multiselect.position.right  = 40
	multiselect.position.bottom = 90
	multiselect.position.left   = 20

	$('body').append(build.multiselect(multiselect.position.top, multiselect.position.left))

	let documentSize = {
		width  : $(document).width(),
		height : $(document).height()
	}

	let newSize = {
		width  : documentSize.width - multiselect.position.right + 2,
		height : documentSize.height - multiselect.position.bottom
	}

	let e = {
		pageX : documentSize.width - (multiselect.position.right / 2),
		pageY : documentSize.height - multiselect.position.bottom
	}

	$('#multiselect').css(newSize)

	multiselect.getSelection(e)

}

multiselect.resize = function(e) {

	if (multiselect.position.top    === null ||
	    multiselect.position.right  === null ||
	    multiselect.position.bottom === null ||
	    multiselect.position.left   === null) return false

	let newSize      = {},
	    documentSize = {}

	// Get the position of the mouse
	let mousePos = {
		x : e.pageX,
		y : e.pageY
	}

	// Default CSS
	let newCSS = {
		top    : null,
		bottom : null,
		height : null,
		left   : null,
		right  : null,
		width  : null
	}

	if (mousePos.y>=multiselect.position.top) {

		documentSize.height = $(document).height()

		// Do not leave the screen
		newSize.height = mousePos.y - multiselect.position.top
		if ((multiselect.position.top+newSize.height)>=documentSize.height) {
			newSize.height -= (multiselect.position.top + newSize.height) - documentSize.height + 2
		}

		newCSS.top    = multiselect.position.top
		newCSS.bottom = 'inherit'
		newCSS.height = newSize.height

	} else {

		newCSS.top    = 'inherit'
		newCSS.bottom = multiselect.position.bottom
		newCSS.height = multiselect.position.top - e.pageY

	}

	if (mousePos.x>=multiselect.position.left) {

		documentSize.width = $(document).width()

		// Do not leave the screen
		newSize.width = mousePos.x - multiselect.position.left
		if ((multiselect.position.left+newSize.width)>=documentSize.width) {
			newSize.width -= (multiselect.position.left + newSize.width) - documentSize.width + 2
		}

		newCSS.right = 'inherit'
		newCSS.left  = multiselect.position.left
		newCSS.width = newSize.width

	} else {

		newCSS.right = multiselect.position.right
		newCSS.left  = 'inherit'
		newCSS.width = multiselect.position.left - e.pageX

	}

	// Updated all CSS properties at once
	$('#multiselect').css(newCSS)

}

multiselect.stopResize = function() {

	$(document).off('mousemove mouseup')

}

multiselect.getSize = function() {

	if (!visible.multiselect()) return false

	let $elem  = $('#multiselect'),
	    offset = $elem.offset()

	return {
		top    : offset.top,
		left   : offset.left,
		width  : parseInt($elem.css('width').replace('px', '')),
		height : parseInt($elem.css('height').replace('px', ''))
	}

}

multiselect.getSelection = function(e) {

	let tolerance = 150,
	    ids       = [],
	    size      = multiselect.getSize()

	if (visible.contextMenu())  return false
	if (!visible.multiselect()) return false

	$('.photo, .album').each(function() {

		let offset = $(this).offset()

		if (offset.top>=(size.top-tolerance) &&
			offset.left>=(size.left-tolerance) &&
			(offset.top+206)<=(size.top+size.height+tolerance) &&
			(offset.left+206)<=(size.left+size.width+tolerance)) {

				let id = $(this).data('id')

				if (id!=='0' && id!==0 && id!=='f' && id!=='s' && id!=='r' && id!=null) {

					ids.push(id)
					$(this).addClass('active')

				}

		}

	})

	if (ids.length!==0 && visible.album())       contextMenu.photoMulti(ids, e)
	else if (ids.length!==0 && visible.albums()) contextMenu.albumMulti(ids, e)
	else                                         multiselect.close()

}

multiselect.close = function() {

	sidebar.setSelectable(true)

	multiselect.stopResize()

	multiselect.position.top    = null
	multiselect.position.right  = null
	multiselect.position.bottom = null
	multiselect.position.left   = null

	lychee.animate('#multiselect', 'fadeOut')
	setTimeout(() => $('#multiselect').remove(), 300)

}