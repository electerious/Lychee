/**
 * @name        main.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 */

$(document).ready(function(){

	/* Init */
	lychee.init();

	/* Event Name */
	var event_name = (mobileBrowser()) ? "touchend" : "click";

	/* Notifications */
	if (window.webkitNotifications) window.webkitNotifications.requestPermission();

	/* Tooltips */
	if (!mobileBrowser()) $(".tools").tipsy({gravity: 'n'});

	/* Header */
	$("#button_share").on(event_name, function(e) {
		if (photo.json.public==1||photo.json.public==2) contextMenu.sharePhoto(photo.getID(), e);
		else photo.setPublic(photo.getID(), e);
	});
	$("#button_share_album").on(event_name, function(e) {
		if (album.json.public==1) contextMenu.shareAlbum(album.getID(), e);
		else modal.show("Share Album", "All photos inside this album will be public and visible for everyone. Existing public photos will have the same sharing permission as this album. Are your sure you want to share this album? <input class='password' type='password' placeholder='password (optional)' value=''>", [["Share Album", function() { album.setPublic(album.getID(), e) }], ["Cancel", function() {}]]);
	});
	$("#button_signout").on(event_name, lychee.logout);
	$("#button_download").on(event_name, function() { window.open(photo.getDirectLink(),"_newtab") });
	$("#button_trash_album").on(event_name, function() { album.delete(album.getID()) });
	$("#button_move").on(event_name, function(e) { contextMenu.move(photo.getID(), e) });
	$("#button_trash").on(event_name, function() { photo.delete() });
	$("#button_edit_album").on(event_name, function() { album.setTitle() });
	$("#button_edit").on(event_name, function() { photo.setTitle(photo.getID()) });
	$("#button_info").on(event_name, function() { view.photo.showInfobox() });
	$("#button_archive").on(event_name, function() { album.getArchive(album.getID()) });
	$("#button_star").on(event_name, function() { photo.setStar(photo.getID()) });

	/* Search */
	$("#search").on("keyup click", function() { search.find($(this).val()) });

	/* Back Buttons */
	$("#button_back_home").on(event_name, function() { lychee.goto("") });
	$("#button_back").on(event_name, function() { lychee.goto("a" + album.getID()) });

	/* Image View */
	lychee.imageview
		.on(event_name, "a#previous", function() {
			if (photo.json&&photo.json.previousPhoto) lychee.goto("a" + album.getID() + "p" + photo.json.previousPhoto)
		})
		.on(event_name, "a#next", function() {
			if (photo.json&&photo.json.nextPhoto) lychee.goto("a" + album.getID() + "p" + photo.json.nextPhoto)
		});

	/* Infobox */
	$("#infobox")
		.on(event_name, ".header a", function() { view.photo.hideInfobox() })
		.on(event_name, "#edit_title", function() { photo.setTitle(photo.getID()) })
		.on(event_name, "#edit_description", function() { photo.setDescription(photo.getID()) });

	/* Keyboard */
	Mousetrap
		.bind('n', function(e) { if (!visible.message()) $("body").append(build.addModal) })
		.bind('u', function(e) { $("#auswahl").html(""); $("#upload_files").click() })
		.bind('s', function(e) { if (visible.photo()) $("#button_star").click() })
		.bind('f', function(e) { if (visible.photo()) $("#button_download").click() })
		.bind('command+backspace', function(e) { if (visible.photo()&&!visible.message()) photo.delete() })
		.bind('left', function(e) { if (visible.photo()) $("#imageview a#previous").click() })
		.bind('right', function(e) { if (visible.photo()) $("#imageview a#next").click() })
		.bind('i', function(e) {
			if (visible.infobox()) view.photo.hideInfobox();
			else if (visible.photo()) view.photo.showInfobox();
		});

	Mousetrap.bindGlobal('enter', function(e) {
		if ($(".message .button.active").length) $(".message .button.active").addClass("pressed").click()
	});

	Mousetrap.bindGlobal(['esc', 'command+up'], function(e) {
		e.preventDefault();
		if (visible.message()) modal.close();
		else if (visible.contextMenu()) contextMenu.close();
		else if (visible.infobox()) view.photo.hideInfobox();
		else if (visible.photo()) lychee.goto("a" + album.getID());
		else if (visible.album()) lychee.goto("");
		else if (visible.albums()&&$("#search").val().length!=0) search.reset();
	});

	/* Document */
	$(document)

		/* Login */
		.on(event_name, "#button_signin", function() { lychee.loginDialog() })
		.on("keyup", "#password", function() { if ($(this).val().length>0) $(this).removeClass("error") })

		/* Header */
		.on(event_name, "#title.editable", function() {
			if (visible.photo()) photo.setTitle(photo.getID());
			else album.setTitle();
		})

		/* Navigation */
		.on("click", ".album", function() { lychee.goto("a" + $(this).attr("data-id")) })
		.on("click", ".photo", function() { lychee.goto("a" + album.getID() + "p" + $(this).attr("data-id")) })

		/* Modal */
		.on(event_name, ".message .close", modal.close)
		.on(event_name, ".message .button:first", function() { modal.fns[0](); modal.close(); })
		.on(event_name, ".message .button:last", function() { modal.fns[1](); modal.close(); })

		/* Add Dialog */
		.on(event_name, ".button_add", function() { $("body").append(build.addModal) })
		.on(event_name, "#add_album", album.add)
		.on(event_name, "#add_link", function() { photo.add.url() })
		.on(event_name, "#add_photo", function() { $("#auswahl").html(""); $("#upload_files").click() })

		/* Upload */
		.on("change", "#upload_files", function() { modal.close(); photo.add.files(this.files); })

		/* Context Menu */
		.on("contextmenu", ".photo", contextMenu.photo)
		.on("contextmenu", ".album", contextMenu.album)
		.on(event_name, ".contextmenu_bg", contextMenu.close)

		/* Infobox */
		.on(event_name, "#infobox_overlay", function() { view.photo.hideInfobox() })

		/* Controls */
		.bind("mouseenter", view.header.show)
		.bind("mouseleave", view.header.hide)

		/* Upload */
		.on("dragover", function(e) { e.preventDefault(); }, false)
		.on("drop", function(e) {
			e.stopPropagation();
			e.preventDefault();
			photo.add.files(e.originalEvent.dataTransfer.files);
			return true;
		});

	/* Run */
	lychee.run();

});