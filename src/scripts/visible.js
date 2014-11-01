/**
 * @name        Visible Module
 * @description	This module is used to check if elements are visible or not.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

visible = {}

visible.albums = function() {
	if ($('#tools_albums').css('display')==='block') return true;
	else return false;
}

visible.album = function() {
	if ($('#tools_album').css('display')==='block') return true;
	else return false;
}

visible.photo = function() {
	if ($('#imageview.fadeIn').length>0) return true;
	else return false;
}

visible.search = function() {
	if (search.code!==null&&search.code!=='') return true;
	else return false;
}

visible.infobox = function() {
	if ($('#infobox.active').length>0) return true;
	else return false;
}

visible.infoboxbutton = function() {
	if (visible.albums()) return false;
	if (visible.photo()) return true;
	if (visible.album()&&$('#button_info_album:visible').length>0) return true;
	else return false;
}

visible.controls = function() {
	if (lychee.loadingBar.css('opacity')<1) return false;
	else return true;
}

visible.message = function() {
	if ($('.message').length>0) return true;
	else return false;
}

visible.signin = function() {
	if ($('.message .sign_in').length>0) return true;
	else return false;
}

visible.contextMenu = function() {
	if ($('.contextContainer').length>0) return true;
	else return false;
}

visible.multiselect = function() {
	if ($('#multiselect').length>0) return true;
	else return false;
}