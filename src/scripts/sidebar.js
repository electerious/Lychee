/**
 * @description	This module takes care of the sidebar.
 * @copyright	2015 by Tobias Reich
 */

sidebar = {

	_dom: $('#sidebar')

}

sidebar.dom = function(selector) {

	if (selector===undefined||selector===null||selector==='') return sidebar._dom;
	return sidebar._dom.find(selector);

}

sidebar.bind = function() {

	// This function should be called after building and appending
	// the sidebars content to the DOM

	// Event Name
	var eventName = ('ontouchend' in document.documentElement) ? 'touchend' : 'click';

	sidebar.dom('#edit_title').on(eventName, function() {
		if (visible.photo())		photo.setTitle([photo.getID()]);
		else if (visible.album())	album.setTitle([album.getID()]);
	});

	sidebar.dom('#edit_description').on(eventName, function() {
		if (visible.photo())		photo.setDescription(photo.getID());
		else if (visible.album())	album.setDescription(album.getID());
	});

	sidebar.dom('#edit_tags')		.on(eventName, function() { photo.editTags([photo.getID()]) });
	sidebar.dom('#tags .tag span')	.on(eventName, function() { photo.deleteTag(photo.getID(), $(this).data('index')) });

	return true;

}

sidebar.toggle = function() {

	if (visible.sidebar()||
		visible.sidebarbutton()) {

			header.dom('.button--info').toggleClass('active')
			lychee.content.toggleClass('sidebar');
			sidebar.dom().toggleClass('active');

			return true;

	}

	return false;

}

sidebar.setSelectable = function(selectable = true) {

	// Attributes/Values inside the sidebar are selectable by default.
	// Selection needs to be deactivated to prevent an unwanted selection
	// while using multiselect.

	if (selectable===true)	sidebar.dom().removeClass('notSelectable');
	else					sidebar.dom().addClass('notSelectable');

}

sidebar.changeAttr = function(attr, value, editable = false) {

	if (attr===undefined||attr===null||attr==='') return false;

	// This will add an edit-icon next to the value when editable is true.
	// The id of the edit-icon always starts with 'edit_' followed by the name of the attribute.
	if (editable===true) value = value + ' ' + build.editIcon('edit_' + attr);

	sidebar.dom('.attr_' + attr).html(value);

	// The new edit-icon needs an event, therefore the binding function
	// should be executed again after changing the value
	if (editable===true) sidebar.bind();

	return true;

}