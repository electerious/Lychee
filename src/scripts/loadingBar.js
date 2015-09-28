/**
 * @description This module is used to show and hide the loading bar.
 * @copyright   2015 by Tobias Reich
 */

loadingBar = {

	status : null,
	_dom   : $('#loading')

}

loadingBar.dom = function(selector) {

	if (selector==null || selector==='') return loadingBar._dom
	return loadingBar._dom.find(selector)

}

loadingBar.show = function(status, errorText) {

	if (status==='error') {

		// Set status
		loadingBar.status = 'error'

		// Parse text
		if (errorText)  errorText = errorText.replace('<br>', '')
		if (!errorText) errorText = 'Whoops, it looks like something went wrong. Please reload the site and try again!'

		// Move header down
		if (visible.header()) header.dom().addClass('header__error')

		// Modify loading
		loadingBar.dom()
			.removeClass('loading uploading error')
			.html(`<h1>Error: <span>${ errorText }</span></h1>`)
			.addClass(status)
			.show()

		// Set timeout
		clearTimeout(loadingBar._timeout)
		loadingBar._timeout = setTimeout(() => loadingBar.hide(true), 3000)

		return true

	}

	if (loadingBar.status===null) {

		// Set status
		loadingBar.status = 'loading'

		// Set timeout
		clearTimeout(loadingBar._timeout)
		loadingBar._timeout = setTimeout(() => {

			// Move header down
			if (visible.header()) header.dom().addClass('header__loading')

			// Modify loading
			loadingBar.dom()
				.removeClass('loading uploading error')
				.html('')
				.addClass('loading')
				.show()

		}, 1000)

		return true

	}

}

loadingBar.hide = function(force) {

	if ((loadingBar.status!=='error' && loadingBar.status!=null) || force) {

		// Remove status
		loadingBar.status = null

		// Move header up
		header.dom().removeClass('header__error header__loading')

		// Set timeout
		clearTimeout(loadingBar._timeout)
		setTimeout(() => loadingBar.dom().hide(), 300)

	}

}