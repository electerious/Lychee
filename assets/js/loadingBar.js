/**
 * @name		LoadingBar Module
 * @description	This module is used to show and hide the loading bar.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

loadingBar = {

	status: null,

	show: function(status, errorText) {

		if (status==="error") {

			loadingBar.status = "error";

			if (!errorText) errorText = "Whoops, it looks like something went wrong. Please reload the site and try again!";

			lychee.loadingBar
				.removeClass("loading uploading error")
				.addClass(status)
				.html("<h1>Error: <span>" + errorText + "</span></h1>")
				.show()
				.css("height", "40px");
			if (visible.controls()) lychee.header.addClass("error");

			clearTimeout(lychee.loadingBar.data("timeout"));
			lychee.loadingBar.data("timeout", setTimeout(function() { loadingBar.hide(true) }, 3000));

		} else if (loadingBar.status===null) {

			loadingBar.status = "loading";

			clearTimeout(lychee.loadingBar.data("timeout"));
			lychee.loadingBar.data("timeout", setTimeout(function() {
				lychee.loadingBar
					.show()
					.removeClass("loading uploading error")
					.addClass("loading");
				if (visible.controls()) lychee.header.addClass("loading");
			}, 1000));

		}

	},

	hide: function(force_hide) {

		if ((loadingBar.status!=="error"&&loadingBar.status!==null)||force_hide) {

			loadingBar.status = null;
			clearTimeout(lychee.loadingBar.data("timeout"));
			lychee.loadingBar.html("").css("height", "3px");
			if (visible.controls()) lychee.header.removeClass("error loading");
			setTimeout(function() { lychee.loadingBar.hide() }, 300);

		}

	}

};