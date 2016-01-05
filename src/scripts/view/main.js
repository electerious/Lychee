/**
 * @description Used to view single photos with view.php
 * @copyright   2015 by Tobias Reich
 */

// Sub-implementation of Lychee -------------------------------------------------------------- //

let lychee = {}

lychee.content = $('.content')

lychee.getEventName = function() {

	let touchendSupport = (/Android|iPhone|iPad|iPod/i).test(navigator.userAgent || navigator.vendor || window.opera) && ('ontouchend' in document.documentElement),
	    eventName       = (touchendSupport===true ? 'touchend' : 'click')

	return eventName

}

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
	let raw    = literalSections.raw,
	    result = ''

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
	result += raw[raw.length-1]

	return result

}

// Main -------------------------------------------------------------- //

let loadingBar = { show() {}, hide() {} },
    imageview  = $('#imageview')

$(document).ready(function() {

	// Event Name
	let eventName = lychee.getEventName()

	// Set API error handler
	api.onError = error

	// Infobox
	header.dom('#button_info').on(eventName, sidebar.toggle)

	// Direct Link
	header.dom('#button_direct').on(eventName, function() {

		let link = $('#imageview #image').css('background-image').replace(/"/g,'').replace(/url\(|\)$/ig, '')
		window.open(link, '_newtab')

	})

	loadPhotoInfo(gup('p'))

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
		let structure = sidebar.createStructure.photo(data),
		    html      = sidebar.render(structure)

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