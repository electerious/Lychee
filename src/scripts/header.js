/**
 * @description	This module takes care of the header.
 * @copyright	2015 by Tobias Reich
 */

header = {

	_dom: $('header')

}

header.dom = function(selector) {

	if (selector===undefined||selector===null||selector==='') return header._dom;
	return header._dom.find(selector);

}

header.show = function() {

	var newMargin = -1*($('#imageview #image').height()/2)+20;

	clearTimeout($(window).data('timeout'));

	lychee.imageview.removeClass('full');
	header.dom().removeClass('hidden');
	lychee.loadingBar.css('opacity', 1);

	// Adjust position or size of photo
	if ($('#imageview #image.small').length>0)	$('#imageview #image').css('margin-top', newMargin);
	else										$('#imageview #image').removeClass('full');

}

header.hide = function(e, delay) {

	var newMargin = -1*($('#imageview #image').height()/2);

	if (delay===undefined) delay = 500;

	if (visible.photo()&&!visible.infobox()&&!visible.contextMenu()&&!visible.message()) {

		clearTimeout($(window).data('timeout'));

		$(window).data('timeout', setTimeout(function() {

			lychee.imageview.addClass('full');
			header.dom().addClass('hidden');
			lychee.loadingBar.css('opacity', 0);

			// Adjust position or size of photo
			if ($('#imageview #image.small').length>0)	$('#imageview #image').css('margin-top', newMargin);
			else										$('#imageview #image').addClass('full');

		}, delay));

	}

}

header.setTitle = function(title) {

	var $title	= header.dom('#title'),
		title	= title || 'Untitled';

	$title.html(title + build.iconic('caret-bottom'));

}

header.setMode = function(mode) {

	var albumID = album.getID();

	switch (mode) {

		case 'albums':

			header.dom().removeClass('view');
			$('#tools_album, #tools_photo').hide();
			$('#tools_albums').show();

			break;

		case 'album':

			header.dom().removeClass('view');
			$('#tools_albums, #tools_photo').hide();
			$('#tools_album').show();

			// Hide download button when album empty
			album.json.content === false ? $('#button_archive').hide() : $('#button_archive').show();

			// Hide download button when not logged in and album not downloadable
			if (lychee.publicMode&&album.json.downloadable==='0') $('#button_archive').hide();

			if (albumID==='s'||albumID==='f'||albumID==='r') {
				$('#button_info_album, #button_trash_album, #button_share_album').hide();
			} else if (albumID==='0') {
				$('#button_info_album, #button_share_album').hide();
				$('#button_trash_album').show();
			} else {
				$('#button_info_album, #button_trash_album, #button_share_album').show();
			}

			break;

		case 'photo':

			header.dom().addClass('view');
			$('#tools_albums, #tools_album').hide();
			$('#tools_photo').show();

			break;

	}

}

header.setEditable = function(editable) {

	var $title = header.dom('#title');

	// Hide editable icon when not logged in
	if (lychee.publicMode===true) editable = false;

	if (editable)	$title.addClass('editable');
	else			$title.removeClass('editable');

}