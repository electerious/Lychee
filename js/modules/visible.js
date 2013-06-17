/**
 * @name        visible.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Visible Module
 * This module is used to check if elements are visible or not.
 */

visible = {

	albums: function() {
		if ($("#tools_albums").css("display")=="block") return true;
		else return false;
	},

	imageview: function() {
		if ($("#image_view.fadeIn").length>0) return true;
		else return false;
	},

	infobox: function() {
		if (parseInt(lychee.infobox.css("right").replace("px", ""))==-320) return false;
		else return true;
	},

	controls: function() {
		if (lychee.loadingBar.css("opacity")>0) return true;
		else return false;
	}

}