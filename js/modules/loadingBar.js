/**
 * @name        loadingBar.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * LoadingBar Module
 * This module is used to show and hide the loading bar.
 */

loadingBar = {

	show: function(status, errorTitle, errorText) {

		if (!status) status = "loading";

		switch (status) {

			case "error":
				if (!errorTitle||!errorText) {
					errorTitle = "Error";
					errorText = "Whoops, it looks like something went wrong. Please reload the site and try again!"
				}
				lychee.loadingBar
					.removeClass("loading uploading error")
					.addClass(status)
					.html("<h1>" + errorTitle + ": <span>" + errorText + "</span></h1>")
					.show()
					.css("height", "40px");
				lychee.header.css("margin-Top", "40px");
				$.timer(3000,function(){ loadingBar.hide() });
				break;

			case "loading":
				clearTimeout(lychee.loadingBar.data("timeout"));
				lychee.loadingBar.data("timeout", setTimeout(function () {
					lychee.loadingBar
						.show()
						.removeClass("loading uploading error")
						.addClass(status);
					if (visible.controls()) lychee.header.css("margin-Top", "3px");
				}, 1000));
				break;

		}

	},

	hide: function() {

		clearTimeout(lychee.loadingBar.data("timeout"));
		lychee.loadingBar.html("").css("height", "3px");
		if (visible.controls()) lychee.header.css("marginTop", "0px");
		$.timer(300,function(){ lychee.loadingBar.hide(); });

	}

}