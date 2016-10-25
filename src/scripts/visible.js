/**
 * @description This module is used to check if elements are visible or not.
 */

visible = {}

visible.albums = function() {
	if (header.dom('.header__toolbar--public').hasClass('header__toolbar--visible')) return true
	if (header.dom('.header__toolbar--albums').hasClass('header__toolbar--visible')) return true
	return false
}

visible.album = function() {
	if (header.dom('.header__toolbar--album').hasClass('header__toolbar--visible')) return true
	return false
}

visible.photo = function() {
	if ($('#imageview.fadeIn').length>0) return true
	return false
}

visible.search = function() {
	if (search.hash!=null) return true
	return false
}

visible.sidebar = function() {
	if (sidebar.dom().hasClass('active')===true) return true
	return false
}

visible.sidebarbutton = function() {
	if (visible.photo()) return true
	if (visible.album() && $('#button_info_album:visible').length>0) return true
	return false
}

visible.header = function() {
	if (header.dom().hasClass('header--hidden')===true) return false
	return true
}

visible.contextMenu = function() {
	return basicContext.visible()
}

visible.multiselect = function() {
	if ($('#multiselect').length>0) return true
	return false
}