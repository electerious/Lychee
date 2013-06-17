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

	status: null,

	show: function(status, errorTitle, errorText) {

		clearTimeout(lychee.loadingBar.data("timeout"));

		if (status=="error"&&loadingBar.status!="error") {

			loadingBar.status = "error";

			if (!errorTitle) errorTitle = "Error";
			if (!errorText) errorText = "Whoops, it looks like something went wrong. Please reload the site and try again!"

			lychee.loadingBar
				.removeClass("loading uploading error")
				.addClass(status)
				.html("<h1>" + errorTitle + ": <span>" + errorText + "</span></h1>")
				.show()
				.css("height", "40px");
			if (visible.controls()) lychee.header.css("margin-Top", "40px");

			lychee.loadingBar.data("timeout", setTimeout(function () { loadingBar.hide(true) }, 3000));

		} else if (loadingBar.status==null) {

			loadingBar.status = "loading";

			lychee.loadingBar.data("timeout", setTimeout(function () {
				lychee.loadingBar
					.show()
					.removeClass("loading uploading error")
					.addClass("loading");
				if (visible.controls()) lychee.header.css("margin-Top", "3px");
			}, 1000));

		}

	},

	hide: function(force_hide) {

		if ((loadingBar.status!="error"&&loadingBar.status!=null)||force_hide) {

			loadingBar.status = null;
			clearTimeout(lychee.loadingBar.data("timeout"));
			lychee.loadingBar.html("").css("height", "3px");
			if (visible.controls()) lychee.header.css("marginTop", "0px");
			$.timer(300,function(){ lychee.loadingBar.hide(); });

		}

	}

}