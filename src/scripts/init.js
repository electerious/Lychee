/**
 * @description	This module is used for bindings.
 * @copyright	2015 by Tobias Reich
 */

$(document).ready(function() {

	/* Event Name */
	var touchendSupport	= (/Android|iPhone|iPad|iPod/i).test(navigator.userAgent || navigator.vendor || window.opera) && ('ontouchend' in document.documentElement),
		eventName		= (touchendSupport===true ? 'touchend' : 'click');

	/* Set API error handler */
	api.onError = lychee.error;

	/* Multiselect */
	multiselect.bind();

	/* Header */
	header.bind();

	/* Image View */
	lychee.imageview
		.on(eventName, '.arrow_wrapper--previous',	photo.previous)
		.on(eventName, '.arrow_wrapper--next',		photo.next);

	/* Keyboard */
	Mousetrap
		.bind('left',			function() { if (visible.photo()) $('#imageview a#previous').click() })
		.bind('right',			function() { if (visible.photo()) $('#imageview a#next').click() })
		.bind('u',	function() { $('#upload_files').click() })
		.bind(['s', 'f'], function(e) {
			if (visible.photo())		header.dom('#button_star').click();
			else if (visible.albums())	header.dom('#search').focus();
			return false;
		})
		.bind('r', function(e) {
			e.preventDefault();
			if (visible.album())		album.setTitle(album.getID());
			else if (visible.photo())	photo.setTitle([photo.getID()]);
		})
		.bind('d', function(e) {
			e.preventDefault();
			if (visible.photo())		photo.setDescription(photo.getID());
			else if (visible.album())	album.setDescription(album.getID());
		})
		.bind('t', function(e) {
			if (visible.photo()) {
				e.preventDefault();
				photo.editTags([photo.getID()]);
			}
		})
		.bind('i', function() {
			if (visible.multiselect())		return false;
			else							sidebar.toggle();
		})
		.bind(['command+backspace', 'ctrl+backspace'], function() {
			if (visible.photo()&&!visible.message())		photo.delete([photo.getID()]);
			else if (visible.album()&&!visible.message())	album.delete([album.getID()]);
		})
		.bind(['command+a', 'ctrl+a'], function() {
			if (visible.album()&&!visible.message())		multiselect.selectAll();
			else if (visible.albums()&&!visible.message())	multiselect.selectAll();
		});

	Mousetrap.bindGlobal('enter', function() {
		if (basicModal.visible()===true) basicModal.action();
	});

	Mousetrap.bindGlobal(['esc', 'command+up'], function(e) {
		e.preventDefault();
		if (basicModal.visible()===true)							basicModal.cancel();
		else if (visible.contextMenu())								contextMenu.close();
		else if (visible.photo())									lychee.goto(album.getID());
		else if (visible.album())									lychee.goto('');
		else if (visible.albums()&&$('#search').val().length!==0)	search.reset();
	});


	if ('ontouchend' in document.documentElement) {

		$(document)

			/* Fullscreen on mobile */
			.on('touchend', '#image', function(e) {
				if (swipe.obj===null||(swipe.offset>=-5&&swipe.offset<=5)) {
					if (visible.header())	header.hide(e, 0);
					else					header.show();
				}
			})

			/* Swipe on mobile */
			.swipe().on('swipeStart',	function() { if (visible.photo()) swipe.start($('#image')) })
			.swipe().on('swipeMove',	function(e) { if (visible.photo()) swipe.move(e.swipe) })
			.swipe().on('swipeEnd',		function(e) { if (visible.photo()) swipe.stop(e.swipe, photo.previous, photo.next) });

	}

	/* Document */
	$(document)

		/* Login */
		.on('keyup', '#password', function() { if ($(this).val().length>0) $(this).removeClass('error') })

		/* Navigation */
		.on('click', '.album', function() { lychee.goto($(this).attr('data-id')) })
		.on('click', '.photo', function() { lychee.goto(album.getID() + '/' + $(this).attr('data-id')) })

		/* Context Menu */
		.on('contextmenu', '.photo', function(e) { contextMenu.photo(photo.getID(), e) })
		.on('contextmenu', '.album', function(e) { contextMenu.album(album.getID(), e) })

		/* Upload */
		.on('change', '#upload_files',				function() { basicModal.close(); upload.start.local(this.files) })
		.on('dragover',								function(e) { e.preventDefault(); }, false)
		.on('drop', function(e) {

			e.stopPropagation();
			e.preventDefault();

			// Close open overlays or views which are correlating with the upload
			if (visible.photo())		lychee.goto(album.getID());
			if (visible.contextMenu())	contextMenu.close();

			// Detect if dropped item is a file or a link
			if (e.originalEvent.dataTransfer.files.length>0)				upload.start.local(e.originalEvent.dataTransfer.files);
			else if (e.originalEvent.dataTransfer.getData('Text').length>3)	upload.start.url(e.originalEvent.dataTransfer.getData('Text'));

			return true;

		});

	/* Init */
	lychee.init();

});