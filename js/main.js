/**
 * @name        main.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 */

/* Modules */
lychee.init("php/api.php", "");

$(document).ready(function(){

	/* Event Name */
	if (mobileBrowser()) event_name = "touchend";
	else event_name = "click";

	/* Toolbar */
	$("#button_signout").on(event_name, function() {
		modal = build.modal("Sign Out", "Are you sure you want to leave and log out?", ["Sign out", "Stay here"], ["lychee.logout();", ""]);
		$("body").append(modal);
	});
	$("#button_download").on(event_name, function() {
		link = $("#image_view #image").css("background-image").replace(/"/g,"").replace(/url\(|\)$/ig, "");
		window.open(link,"_newtab");
	});
	$("#button_share").on(event_name, function(e) {
		if ($("#button_share a.active").length) contextMenu.share(lychee.image_view.attr("data-id"), e.pageX, e.pageY);
		else photos.setPublic(e);
	});
	$("#button_trash_album").on(event_name, function() { albums.deleteDialog(lychee.content.attr("data-id")) });
	$("#button_move").on(event_name, function(e) { contextMenu.move(lychee.image_view.attr("data-id"), e.pageX, e.pageY) });
	$("#button_trash").on(event_name, function() { photos.deleteDialog() });
	$("#button_edit_album").on(event_name, function() { albums.rename() });
	$("#button_edit").on(event_name, function() { photos.rename() });
	$("#button_info").on(event_name, function() { photos.showInfobox() });
	$("#button_archive").on(event_name, function() { albums.getArchive() });
	$("#button_star").on(event_name, function() { photos.setStar() });
	$(".copylink").on(event_name, function() { $(this).select() });

	/* Search */
	$("#search").on("keyup click", function() { search.find($(this).val()) });

	/* Back Buttons */
	$("#button_back_home").on(event_name, function() { lychee.goto("") });
	$("#button_back").on(event_name, function() { lychee.goto("a" + lychee.content.attr("data-id")) });

	/* Image View */
	$("#image_view")
		.on(event_name, "a#previous", photos.previous)
		.on(event_name, "a#next", photos.next);

	/* Infobox */
	$("#infobox")
		.on(event_name, ".header a", function() { photos.hideInfobox() })
		.on(event_name, "#edit_title", function() { photos.rename() })
		.on(event_name, "#edit_description", function() { photos.setDescription() });

	/* Keyboard */
	Mousetrap
		.bind('n', function(e) { $("body").append(build.addModal) })
		.bind('u', function(e) { $("#auswahl").html(""); $("#upload_files").click() })
		.bind('s', function(e) { if (visible.imageview()) $("#button_star").click() })
		.bind('f', function(e) { if (visible.imageview()) $("#button_download").click() })
		.bind('i', function(e) { if (visible.imageview()) photos.showInfobox() })
		.bind('backspace', function(e) { if (visible.imageview()) photos.deleteDialog() })
		.bind('left', function(e) { if (visible.imageview()) photos.previous() })
		.bind('right', function(e) { if (visible.imageview()) photos.next() });

	Mousetrap.bindGlobal('enter', function(e) {
		if ($(".message .button.active").length) $(".message .button.active").addClass("pressed").click()
	});

	Mousetrap.bindGlobal('esc', function(e) {
		e.preventDefault();
		if ($(".message").length&&$(".sign_in").length==0) lychee.closeModal();
		else if (visible.infobox()) photos.hideInfobox();
		else if (visible.imageview()) lychee.goto("a" + lychee.content.attr("data-id"));
		else if (visible.albums()&&$("#search").val().length!=0) search.reset();
	});

	/* Document */
	$(document)

		/* Login */
		.on("keyup", "#password", function() { if ($(this).val().length>0) $(this).removeClass("error") })

		/* Toolbar */
		.on(event_name, "#title.editable", function() { if (visible.imageview()) photos.rename(); else albums.rename(); })

		/* Navigation */
		.on("click", ".album", function() { lychee.goto("a" + $(this).attr("data-id")) })
		.on("click", ".photo", function() {
			if (lychee.content.attr("data-id")!="") lychee.goto("a" + lychee.content.attr("data-id") + "p" + $(this).attr("data-id"));
			else lychee.goto("a" + $(this).attr("data-album-id") + "p" + $(this).attr("data-id"));
		})

		/* Modal */
		.on(event_name, ".message .close", lychee.closeModal)

		/* Add Dialog */
		.on(event_name, ".button_add", function() { $("body").append(build.addModal) })
		.on(event_name, "#add_album", albums.add)
		.on(event_name, "#add_photo", function() { $("#auswahl").html(""); $("#upload_files").click() })

		/* Upload */
		.on("change", "#upload_files", function() { lychee.closeModal(); lychee.upload(this.files); })

		/* Context Menu */
		.on("contextmenu", ".photo", contextMenu.photo)
		.on("contextmenu", ".album", contextMenu.album)
		.on(event_name, ".contextmenu_bg", contextMenu.close)

		/* Infobox */
		.on(event_name, "#infobox_overlay", function() { photos.hideInfobox() })

		/* Controls */
		.bind("mouseenter", lychee.showControls)
		.bind("mouseleave", lychee.hideControls);

	/* Upload */
	document.documentElement.ondrop = function (e) {

		e.stopPropagation();
		e.preventDefault();
		lychee.upload(event.dataTransfer.files);
		return true;

	}

	/* Init */
	lychee.ready();

});