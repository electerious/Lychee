/**
 * @name        Visible Module
 * @description	This module is used to check if elements are visible or not.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

visible = {

	albums: function() {
		if ($('#tools_albums').css('display')==='block') return true;
		else return false;
	},

	album: function() {
		if ($('#tools_album').css('display')==='block') return true;
		else return false;
	},

	photo: function() {
		if ($('#imageview.fadeIn').length>0) return true;
		else return false;
	},

	search: function() {
		if (search.code!==null&&search.code!=='') return true;
		else return false;
	},

	infobox: function() {
		if ($('#infobox.active').length>0) return true;
		else return false;
	},

	controls: function() {
		if (lychee.loadingBar.css('opacity')<1) return false;
		else return true;
	},

	message: function() {
		if ($('.message').length>0) return true;
		else return false;
	},

	signin: function() {
		if ($('.message .sign_in').length>0) return true;
		else return false;
	},

	contextMenu: function() {
		if ($('.contextmenu').length>0) return true;
		else return false;
	},

	multiselect: function() {
		if ($('#multiselect').length>0) return true;
		else return false;
	}

};