/**
 * @description Used to view single photos with view.php
 * @copyright   2015 by Tobias Reich
 */

let lychee = {
	content: $('#content'),
	getEventName() {

		let touchendSupport = (/Android|iPhone|iPad|iPod/i).test(navigator.userAgent || navigator.vendor || window.opera) && ('ontouchend' in document.documentElement),
		    eventName       = (touchendSupport===true ? 'touchend' : 'click')

		return eventName

	}
}

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

const getPhotoSize = function(photo) {

	// Size can be 'big', 'medium' or 'small'
	// Default is big
	// Small is centered in the middle of the screen
	let size       = 'big',
	    scaled     = false,
	    hasMedium  = photo.medium!=='',
	    pixelRatio = window.devicePixelRatio,
	    view       = {
	    	width  : $(window).width() - 60,
	    	height : $(window).height() - 100
	    }

	// Detect if the photo will be shown scaled,
	// because the screen size is smaller than the photo
	if (photo.width>view.width || photo.height>view.height) scaled = true

	// Calculate pixel ratio of screen
	if (pixelRatio!=null && pixelRatio>1) {
		view.width  = view.width * pixelRatio
		view.height = view.height * pixelRatio
	}

	// Medium available and
	// Medium still bigger than screen
	if (hasMedium===true && (1920>view.width && 1080>view.height)) size = 'medium'

	// Photo not scaled
	// Photo smaller then screen
	if (scaled===false && (photo.width<view.width&& photo.width<view.height)) size = 'small'

	return size

}

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
		header.dom('#title').html(data.title)

		let size = getPhotoSize(data)

		// Render HTML
		imageview.html(build.imageview(data, size, true))
		imageview.find('.arrow_wrapper').remove()
		imageview.addClass('fadeIn').show()

		// Render Sidebar
		let structure = sidebar.createStructure.photo(data),
		    html      = sidebar.render(structure)

		sidebar.dom('.wrapper').html(html)
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