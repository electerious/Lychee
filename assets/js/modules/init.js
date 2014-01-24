/**
 * @name		Init Module
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

$(document).ready(function(){

	/* Event Name */
	var event_name = (mobileBrowser()) ? "touchend" : "click";

	/* Notifications */
	if (window.webkitNotifications) window.webkitNotifications.requestPermission();
	
	/* Disable ContextMenu */
	$(document).bind("contextmenu", function(e) { e.preventDefault() });

	/* Tooltips */
	if (!mobileBrowser()) $(".tools").tipsy({gravity: 'n', fade: false, delayIn: 0, opacity: 1});

	/* Header */
	$("#hostedwith").on(event_name, function() { window.open(lychee.website,"_newtab") });
	$("#button_signin").on(event_name, lychee.loginDialog);
	$("#button_settings").on(event_name, contextMenu.settings);
	$("#button_share").on(event_name, function(e) {
		if (photo.json.public==1||photo.json.public==2) contextMenu.sharePhoto(photo.getID(), e);
		else photo.setPublic(photo.getID(), e);
	});
	$("#button_share_album").on(event_name, function(e) {
		if (album.json.public==1) contextMenu.shareAlbum(album.getID(), e);
		else modal.show("Share Album", "All photos inside this album will be public and visible for everyone. Existing public photos will have the same sharing permission as this album. Are your sure you want to share this album? <input class='text' type='password' placeholder='password (optional)' value=''>", [["Share Album", function() { album.setPublic(album.getID(), e) }], ["Cancel", function() {}]]);
	});
	$("#button_download").on(event_name, function() { photo.getArchive(photo.getID()) });
	$("#button_trash_album").on(event_name, function() { album.delete(album.getID()) });
	$("#button_move").on(event_name, function(e) { contextMenu.move(photo.getID(), e) });
	$("#button_trash").on(event_name, function() { photo.delete(photo.getID()) });
	$("#button_info_album").on(event_name, function() { view.infobox.show() });
	$("#button_info").on(event_name, function() { view.infobox.show() });
	$("#button_archive").on(event_name, function() { album.getArchive(album.getID()) });
	$("#button_star").on(event_name, function() { photo.setStar(photo.getID()) });

	/* Search */
	$("#search").on("keyup click", function() { search.find($(this).val()) });

	/* Back Buttons */
	$("#button_back_home").on(event_name, function() { lychee.goto("") });
	$("#button_back").on(event_name, function() { lychee.goto(album.getID()) });

	/* Image View */
	lychee.imageview
		.on(event_name, ".arrow_wrapper.previous", function() {
			if (album.json&&album.json.content[photo.getID()]&&album.json.content[photo.getID()].previousPhoto!=="") lychee.goto(album.getID() + "/" + album.json.content[photo.getID()].previousPhoto)
		})
		.on(event_name, ".arrow_wrapper.next", function() {
			if (album.json&&album.json.content[photo.getID()]&&album.json.content[photo.getID()].nextPhoto!=="") lychee.goto(album.getID() + "/" + album.json.content[photo.getID()].nextPhoto)
		});

	/* Infobox */
	$("#infobox")
		.on(event_name, ".header a", function() { view.infobox.hide() })
		.on(event_name, "#edit_title_album", function() { album.setTitle(album.getID()) })
		.on(event_name, "#edit_description_album", function() { album.setDescription(album.getID()) })
		.on(event_name, "#edit_title", function() { photo.setTitle(photo.getID()) })
		.on(event_name, "#edit_description", function() { photo.setDescription(photo.getID()) });

	/* Keyboard */
	Mousetrap
		.bind('u', function() { $("#upload_files").click() })
		.bind('s', function() { if (visible.photo()) $("#button_star").click() })
		.bind('command+backspace', function() { if (visible.photo()&&!visible.message()) photo.delete(photo.getID()) })
		.bind('left', function() { if (visible.photo()) $("#imageview a#previous").click() })
		.bind('right', function() { if (visible.photo()) $("#imageview a#next").click() })
		.bind('i', function() {
			if (visible.infobox()) view.infobox.hide();
			else if (!visible.albums()) view.infobox.show();
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

	/* Document */
	$(document)

		/* Login */
		.on("keyup", "#password", function() { if ($(this).val().length>0) $(this).removeClass("error") })

		/* Header */
		.on(event_name, "#title.editable", function() {
			if (visible.photo()) photo.setTitle(photo.getID());
			else album.setTitle(album.getID());
		})

		/* Navigation */
		.on("click", ".album", function() { lychee.goto($(this).attr("data-id")) })
		.on("click", ".photo", function() { lychee.goto(album.getID() + "/" + $(this).attr("data-id")) })

		/* Modal */
		.on(event_name, ".message .close", modal.close)
		.on(event_name, ".message .button:first", function() { if (modal.fns!=null) modal.fns[0](); if (!visible.signin()) modal.close() })
		.on(event_name, ".message .button:last", function() { if (modal.fns!=null) modal.fns[1](); if (!visible.signin()) modal.close() })

		/* Add Dialog */
		.on(event_name, ".button_add", function(e) { contextMenu.add(e) })

		/* Upload */
		.on("change", "#upload_files", function() { modal.close(); upload.start.local(this.files) })

		/* Context Menu */
		.on("contextmenu", ".photo", function(e) { contextMenu.photo(photo.getID(), e) })
		.on("contextmenu", ".album", function(e) { contextMenu.album(album.getID(), e) })
		.on(event_name, ".contextmenu_bg", contextMenu.close)
		.on("contextmenu", ".contextmenu_bg", contextMenu.close)

		/* Infobox */
		.on(event_name, "#infobox_overlay", view.infobox.hide)

		/* Upload */
		.on("dragover", function(e) { e.preventDefault(); }, false)
		.on("drop", function(e) {
			e.stopPropagation();
			e.preventDefault();
			if (e.originalEvent.dataTransfer.files.length>0) upload.start.local(e.originalEvent.dataTransfer.files);
			else if (e.originalEvent.dataTransfer.getData('Text').length>3) upload.start.url(e.originalEvent.dataTransfer.getData('Text'));
			return true;
		});

	/* Init */
	lychee.init();

});