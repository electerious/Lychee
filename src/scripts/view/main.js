/**
 * @description Used to view single photos with view.php
 */

// Sub-implementation of lychee -------------------------------------------------------------- //

let lychee = {}

lychee.content = $('.content')

lychee.escapeHTML = function(html = '') {

	// Ensure that html is a string
	html += ''

	// Escape all critical characters
	html = html.replace(/&/g, '&amp;')
	           .replace(/</g, '&lt;')
	           .replace(/>/g, '&gt;')
	           .replace(/"/g, '&quot;')
	           .replace(/'/g, '&#039;')
	           .replace(/`/g, '&#96;')

	return html

}

lychee.html = function(literalSections, ...substs) {

	// Use raw literal sections: we don’t want
	// backslashes (\n etc.) to be interpreted
	let raw    = literalSections.raw
	let result = ''

	substs.forEach((subst, i) => {

		// Retrieve the literal section preceding
		// the current substitution
		let lit = raw[i]

		// If the substitution is preceded by a dollar sign,
		// we escape special characters in it
		if (lit.slice(-1)==='$') {
			subst = lychee.escapeHTML(subst)
			lit   = lit.slice(0, -1)
		}

		result += lit
		result += subst

	})

	// Take care of last literal section
	// (Never fails, because an empty template string
	// produces one literal section, an empty string)
	result += raw[raw.length - 1]

	return result

}

lychee.getEventName = function() {

	let touchendSupport = (/Android|iPhone|iPad|iPod/i).test(navigator.userAgent || navigator.vendor || window.opera) && ('ontouchend' in document.documentElement)
	let eventName       = (touchendSupport===true ? 'touchend' : 'click')

	return eventName

}

// Sub-implementation of photo -------------------------------------------------------------- //

let photo = {}

photo.share = function(photoID, service) {

	let url  = location.toString()

	switch (service) {
		case 'twitter':
			window.open(`https://twitter.com/share?url=${ encodeURI(url) }`)
			break
		case 'facebook':
			window.open(`http://www.facebook.com/sharer.php?u=${ encodeURI(url) }`)
			break
		case 'mail':
			location.href = `mailto:?subject=&body=${ encodeURI(url) }`
			break
	}

}

photo.getDirectLink = function() {

	return $('#imageview img').attr('src').replace(/"/g,'').replace(/url\(|\)$/ig, '')

}

// Sub-implementation of contextMenu -------------------------------------------------------------- //

let contextMenu = {}

contextMenu.sharePhoto = function(photoID, e) {

	let iconClass = 'ionicons'

	let items = [
		{ title: build.iconic('twitter', iconClass) + 'Twitter', fn: () => photo.share(photoID, 'twitter') },
		{ title: build.iconic('facebook', iconClass) + 'Facebook', fn: () => photo.share(photoID, 'facebook') },
		{ title: build.iconic('envelope-closed') + 'Mail', fn: () => photo.share(photoID, 'mail') },
		{ title: build.iconic('link-intact') + 'Direct Link', fn: () => window.open(photo.getDirectLink(), '_newtab') }
	]

	basicContext.show(items, e.originalEvent)

}

// Main -------------------------------------------------------------- //

let loadingBar = { show() {}, hide() {} }
let imageview  = $('#imageview')

$(document).ready(function() {

	// Save ID of photo
	let photoID = gup('p')

	// Set API error handler
	api.onError = error

	// Share
	header.dom('#button_share').on('click', function(e) {
		contextMenu.sharePhoto(photoID, e)
	})

	// Infobox
	header.dom('#button_info').on('click', sidebar.toggle)

	// Load photo
	loadPhotoInfo(photoID)

})

const loadPhotoInfo = function(photoID) {

	let params = {
		photoID,
		albumID  : 0,
		password : ''
	}

	api.post('Photo::get', params, function(data) {

		if (data==='Warning: Photo private!' || data==='Warning: Wrong password!') {

			$('body').append(build.no_content('question-mark'))
			$('body').removeClass('view')
			header.dom().remove()
			return false

		}

		// Set title
		if (!data.title) data.title = 'Untitled'
		document.title = 'Lychee - ' + data.title
		header.dom('.header__title').html(lychee.escapeHTML(data.title))

		// Render HTML
		imageview.html(build.imageview(data, true))
		imageview.find('.arrow_wrapper').remove()
		imageview.addClass('fadeIn').show()

		// Render Sidebar
		let structure = sidebar.createStructure.photo(data)
		let html      = sidebar.render(structure)

		sidebar.dom('.sidebar__wrapper').html(html)
		sidebar.bind()

	})

}

const error = function(errorThrown, params, data) {

	console.error({
		description : errorThrown,
		params      : params,
		response    : data
	})

	loadingBar.show('error', errorThrown)

}