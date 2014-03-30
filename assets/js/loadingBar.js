/**
 * @name		LoadingBar Module
 * @description	This module is used to show and hide the loading bar.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

loadingBar = {

	status: null,

	show: function(status, errorText) {

		if (status==='error') {

			// Set status
			loadingBar.status = 'error';

			// Parse text
			if (errorText) errorText = errorText.replace('<br>', '');
			if (!errorText) errorText = 'Whoops, it looks like something went wrong. Please reload the site and try again!';

			// Move header down
			if (visible.controls()) lychee.header.addClass('error');

			// Modify loading
			lychee.loadingBar
				.removeClass('loading uploading error')
				.addClass(status)
				.html('<h1>Error: <span>' + errorText + '</span></h1>')
				.show()
				.css('height', '40px');

			// Set timeout
			clearTimeout(lychee.loadingBar.data('timeout'));
			lychee.loadingBar.data('timeout', setTimeout(function() { loadingBar.hide(true) }, 3000));

			return true;

		}

		if (loadingBar.status===null) {

			// Set status
			loadingBar.status = 'loading';

			// Set timeout
			clearTimeout(lychee.loadingBar.data('timeout'));
			lychee.loadingBar.data('timeout', setTimeout(function() {

				// Move header down
				if (visible.controls()) lychee.header.addClass('loading');

				// Modify loading
				lychee.loadingBar
					.removeClass('loading uploading error')
					.addClass('loading')
					.show();

			}, 1000));

			return true;

		}

	},

	hide: function(force) {

		if ((loadingBar.status!=='error'&&loadingBar.status!==null)||force) {

			// Remove status
			loadingBar.status = null;

			// Move header up
			if (visible.controls()) lychee.header.removeClass('error loading');

			// Modify loading
			lychee.loadingBar
				.html('')
				.css('height', '3px');

			// Set timeout
			clearTimeout(lychee.loadingBar.data('timeout'));
			setTimeout(function() { lychee.loadingBar.hide() }, 300);

		}

	}

};