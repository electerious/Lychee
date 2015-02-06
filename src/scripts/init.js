/**
 * @description	This module is used for bindings.
 * @copyright	2015 by Tobias Reich
 */

$(document).ready(function() {

	/* Event Name */
	var eventName = ('ontouchend' in document.documentElement) ? 'touchend' : 'click';

	/* Multiselect */
	$('#content')	.on('mousedown', 	function(e) { if (e.which===1) multiselect.show(e) });
	$(document)		.on('mouseup',		function(e) { if (e.which===1) multiselect.getSelection(e) });

	/* Header */
	header.dom('#title').on(eventName, function(e) {
		if (!$(this).hasClass('editable'))	return false;
		if (visible.photo())				contextMenu.photoTitle(album.getID(), photo.getID(), e);
		else								contextMenu.albumTitle(album.getID(), e);
	});
	header.dom('#button_share').on(eventName, function(e) {
		if (photo.json.public==1||photo.json.public==2)	contextMenu.sharePhoto(photo.getID(), e);
		else											photo.setPublic(photo.getID(), e);
	});
	header.dom('#button_share_album').on(eventName, function(e) {
		if (album.json.public==1)	contextMenu.shareAlbum(album.getID(), e);
		else						album.setPublic(album.getID(), e);
	});
	header.dom('#button_signin')		.on(eventName, lychee.loginDialog);
	header.dom('#button_settings')		.on(eventName, contextMenu.settings);
	header.dom('#button_info_album')	.on(eventName, view.infobox.show);
	header.dom('#button_info')			.on(eventName, view.infobox.show);
	header.dom('.button_add')			.on(eventName, contextMenu.add);
	header.dom('#button_more')			.on(eventName, function(e) { contextMenu.photoMore(photo.getID(), e) });
	header.dom('#button_move')			.on(eventName, function(e) { contextMenu.move([photo.getID()], e) });
	header.dom('#hostedwith')			.on(eventName, function() { window.open(lychee.website) });
	header.dom('#button_trash_album')	.on(eventName, function() { album.delete([album.getID()]) });
	header.dom('#button_trash')			.on(eventName, function() { photo.delete([photo.getID()]) });
	header.dom('#button_archive')		.on(eventName, function() { album.getArchive(album.getID()) });
	header.dom('#button_star')			.on(eventName, function() { photo.setStar([photo.getID()]) });
	header.dom('#button_back_home')		.on(eventName, function() { lychee.goto('') });
	header.dom('#button_back')			.on(eventName, function() { lychee.goto(album.getID()) });

	/* Search */
	header.dom('#search').on('keyup click', function() { search.find($(this).val()) });

	/* Clear Search */
	header.dom('#clearSearch').on(eventName, function () {
		header.dom('#search').focus();
		search.reset();
	});

	/* Infobox */
	lychee.infobox.find('.header .close').on(eventName, view.infobox.hide);

	/* Image View */
	lychee.imageview
		.on(eventName, '.arrow_wrapper--previous',	photo.previous)
		.on(eventName, '.arrow_wrapper--next',		photo.next);

	/* Infobox */
	lychee.infobox
		.on(eventName, '#edit_title_album',			function() { album.setTitle([album.getID()]) })
		.on(eventName, '#edit_description_album',	function() { album.setDescription(album.getID()) })
		.on(eventName, '#edit_title',				function() { photo.setTitle([photo.getID()]) })
		.on(eventName, '#edit_description',			function() { photo.setDescription(photo.getID()) })
		.on(eventName, '#edit_tags',				function() { photo.editTags([photo.getID()]) })
		.on(eventName, '#tags .tag span',			function() { photo.deleteTag(photo.getID(), $(this).data('index')) });

	/* Keyboard */
	Mousetrap
		.bind('left',			function() { if (visible.photo()) $('#imageview a#previous').click() })
		.bind('right',			function() { if (visible.photo()) $('#imageview a#next').click() })
		.bind('u',	function() { $('#upload_files').click() })
		.bind(['s', 'f'], function(e) {
			if (visible.photo()) {
				header.dom('#button_star').click();
			} else if (visible.albums()) {
				e.preventDefault();
				header.dom('#search').focus();
			}
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
			if (visible.infobox())				view.infobox.hide();
			else if (visible.multiselect())		return false;
			else if (visible.infoboxbutton())	view.infobox.show();
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
		else if (visible.infobox())									view.infobox.hide();
		else if (visible.photo())									lychee.goto(album.getID());
		else if (visible.album())									lychee.goto('');
		else if (visible.albums()&&$('#search').val().length!==0)	search.reset();
	});


	if ('ontouchend' in document.documentElement) {

		$(document)

			/* Fullscreen on mobile */
			.on('touchend', '#image', function(e) {
				if (swipe.obj===null||(swipe.offset>=-5&&swipe.offset<=5)) {
					if (visible.controls())	header.hide(e, 0);
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

		/* Infobox */
		.on(eventName, '#infobox_overlay', view.infobox.hide)

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