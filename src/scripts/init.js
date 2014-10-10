/**
 * @name		Init Module
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

$(document).ready(function(){

	/* Event Name */
	var event_name = (mobileBrowser()) ? "touchend" : "click";

	/* Disable ContextMenu */
	$(document).bind("contextmenu", function(e) { e.preventDefault() });

	/* Tooltips */
	if (!mobileBrowser()) $(".tools").tipsy({gravity: 'n', fade: false, delayIn: 0, opacity: 1});

	/* Multiselect */
	$("#content").on("mousedown", multiselect.show);
	$(document).on("mouseup", multiselect.getSelection);

	/* Header */
	$("#hostedwith").on(event_name, function() { window.open(lychee.website) });
	$("#button_signin").on(event_name, lychee.loginDialog);
	$("#button_settings").on("click", contextMenu.settings);
	$("#button_share").on(event_name, function(e) {
		if (photo.json.public==1||photo.json.public==2) contextMenu.sharePhoto(photo.getID(), e);
		else photo.setPublic(photo.getID(), e);
	});
	$("#button_share_album").on(event_name, function(e) {
		if (album.json.public==1) contextMenu.shareAlbum(album.getID(), e);
		else album.setPublic(album.getID(), e);
	});
	$("#button_more").on(event_name, function(e) { contextMenu.photoMore(photo.getID(), e) });
	$("#button_trash_album").on(event_name, function() { album.delete([album.getID()]) });
	$("#button_move").on(event_name, function(e) { contextMenu.move([photo.getID()], e) });
	$("#button_trash").on(event_name, function() { photo.delete([photo.getID()]) });
	$("#button_info_album").on(event_name, function() { view.infobox.show() });
	$("#button_info").on(event_name, function() { view.infobox.show() });
	$("#button_archive").on(event_name, function() { album.getArchive(album.getID()) });
	$("#button_star").on(event_name, function() { photo.setStar([photo.getID()]) });

	/* Search */
	$("#search").on("keyup click", function() { search.find($(this).val()) });

	/* Clear Search */
	$("#clearSearch").on(event_name, function () {
		$("#search").focus();
		search.reset();
	});

	/* Back Buttons */
	$("#button_back_home").on(event_name, function() { lychee.goto("") });
	$("#button_back").on(event_name, function() { lychee.goto(album.getID()) });

	/* Image View */
	lychee.imageview
		.on(event_name, ".arrow_wrapper.previous", photo.previous)
		.on(event_name, ".arrow_wrapper.next", photo.next);

	/* Infobox */
	$("#infobox")
		.on(event_name, ".header a", function() { view.infobox.hide() })
		.on(event_name, "#edit_title_album", function() { album.setTitle([album.getID()]) })
		.on(event_name, "#edit_description_album", function() { album.setDescription(album.getID()) })
		.on(event_name, "#edit_title", function() { photo.setTitle([photo.getID()]) })
		.on(event_name, "#edit_description", function() { photo.setDescription(photo.getID()) })
		.on(event_name, "#edit_tags", function() { photo.editTags([photo.getID()]) })
		.on(event_name, "#tags .tag span", function() { photo.deleteTag(photo.getID(), $(this).data('index')) });

	/* Keyboard */
	Mousetrap
		.bind('left', function() { if (visible.photo()) $("#imageview a#previous").click() })
		.bind('right', function() { if (visible.photo()) $("#imageview a#next").click() })
		.bind(['u', 'ctrl+u'], function() { $("#upload_files").click() })
		.bind(['s', 'ctrl+s', 'f', 'ctrl+f'], function(e) {
			if (visible.photo()) {
				$("#button_star").click();
			} else if (visible.albums()) {
				e.preventDefault();
				$("#search").focus();
			}
		})
		.bind(['r', 'ctrl+r'], function(e) {
			e.preventDefault();
			if (visible.album()) album.setTitle(album.getID());
			else if (visible.photo()) photo.setTitle([photo.getID()]);
		})
		.bind(['d', 'ctrl+d'], function(e) {
			e.preventDefault();
			if (visible.photo()) photo.setDescription(photo.getID());
			else if (visible.album()) album.setDescription(album.getID());
		})
		.bind(['t', 'ctrl+t'], function(e) {
			if (visible.photo()) {
				e.preventDefault();
				photo.editTags([photo.getID()]);
			}
		})
		.bind(['i', 'ctrl+i'], function() {
			if (visible.infobox()) view.infobox.hide();
			else if (visible.multiselect()) return false;
			else if (visible.infoboxbutton()) view.infobox.show();
		})
		.bind(['command+backspace', 'ctrl+backspace'], function() {
			if (visible.photo()&&!visible.message()) photo.delete([photo.getID()]);
			else if (visible.album()&&!visible.message()) album.delete([album.getID()]);
		})
		.bind(['command+a', 'ctrl+a'], function() {
			if (visible.album()&&!visible.message()) multiselect.selectAll();
			else if (visible.albums()&&!visible.message()) multiselect.selectAll();
		});

	Mousetrap.bindGlobal('enter', function() {
		if ($(".message .button.active").length) $(".message .button.active").addClass("pressed").click()
	});

	Mousetrap.bindGlobal(['esc', 'command+up'], function(e) {
		e.preventDefault();
		if (visible.message()&&$(".message .close").length>0) modal.close();
		else if (visible.contextMenu()) contextMenu.close();
		else if (visible.infobox()) view.infobox.hide();
		else if (visible.photo()) lychee.goto(album.getID());
		else if (visible.album()) lychee.goto("");
		else if (visible.albums()&&$("#search").val().length!==0) search.reset();
	});


	if (mobileBrowser()) {

		$(document)

			/* Fullscreen on mobile */
			.on('touchend', '#image', function(e) {
				if (swipe.obj===null||(swipe.offset>=-5&&swipe.offset<=5)) {
					if (visible.controls()) view.header.hide(e, 0);
					else view.header.show();
				}
			})

			/* Swipe on mobile */
			.swipe().on('swipeStart', function() { if (visible.photo()) swipe.start($("#image")) })
			.swipe().on('swipeMove', function(e) { if (visible.photo()) swipe.move(e.swipe) })
			.swipe().on('swipeEnd', function(e) { if (visible.photo()) swipe.stop(e.swipe, photo.previous, photo.next) });

	}

	/* Document */
	$(document)

		/* Login */
		.on("keyup", "#password", function() { if ($(this).val().length>0) $(this).removeClass("error") })

		/* Header */
		.on(event_name, "#title.editable", function() {
			if (visible.photo()) photo.setTitle([photo.getID()]);
			else album.setTitle([album.getID()]);
		})

		/* Navigation */
		.on("click", ".album", function() { lychee.goto($(this).attr("data-id")) })
		.on("click", ".photo", function() { lychee.goto(album.getID() + "/" + $(this).attr("data-id")) })

		/* Modal */
		.on(event_name, ".message .close", modal.close)
		.on(event_name, ".message .button:first", function() { if (modal.fns!==null) modal.fns[0](); if (!visible.signin()) modal.close() })
		.on(event_name, ".message .button:last", function() { if (modal.fns!==null) modal.fns[1](); if (!visible.signin()) modal.close() })

		/* Add Dialog */
		.on(event_name, ".button_add", function(e) { contextMenu.add(e) })

		/* Context Menu */
		.on("contextmenu", ".photo", function(e) { contextMenu.photo(photo.getID(), e) })
		.on("contextmenu", ".album", function(e) { contextMenu.album(album.getID(), e) })
		.on(event_name, ".contextmenu_bg", contextMenu.close)
		.on("contextmenu", ".contextmenu_bg", contextMenu.close)

		/* Infobox */
		.on(event_name, "#infobox_overlay", view.infobox.hide)

		/* Upload */
		.on("change", "#upload_files", function() { modal.close(); upload.start.local(this.files) })
		.on(event_name, ".upload_message a.close", upload.close)
		.on("dragover", function(e) { e.preventDefault(); }, false)
		.on("drop", function(e) {

			e.stopPropagation();
			e.preventDefault();

			// Close open overlays or views which are correlating with the upload
			if (visible.photo()) lychee.goto(album.getID());
			if (visible.contextMenu()) contextMenu.close();

			// Detect if dropped item is a file or a link
			if (e.originalEvent.dataTransfer.files.length>0)				upload.start.local(e.originalEvent.dataTransfer.files);
			else if (e.originalEvent.dataTransfer.getData('Text').length>3)	upload.start.url(e.originalEvent.dataTransfer.getData('Text'));

			return true;

		});

	/* Init */
	lychee.init();

});