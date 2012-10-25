/**
 * @name        main.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2012 by Philipp Maurer, Tobias Reich
 */

var header = $("header"),
	headerTitle = $("#title"),
	content = $("#content"),
	image_view = $("#image_view"),
	loading = $("#loading"),
	infobox = $("#infobox"),
	api_path = "php/api.php",
	version = "1.0.1";

$(document).ready(function(){

	/* Login */
	$("#password").live("keyup", function() {
		if ($(this).val().length>0) $(this).removeClass("error");
	});

	/* Add Dialog */
	$(".button_add").live("click", function() { $("body").append(buildAddModal) });
	$("#add_album").live("click", addAlbum);
	$("#add_photo").live("click", function() { $("#auswahl").html(""); $("#upload_files").click() });

	/* Toolbar Buttons */
	$("#button_signout").live("click", function() {
		modal = buildModal("Sign Out", "Are you sure you want to leave and log out?", ["Sign out", "Stay here"], ["logout();", ""]);
		$("body").append(modal);
	});
	$("#button_download").live("click", function() {
		link = $("#image_view #image").css("background-image").replace(/"/g,"").replace(/url\(|\)$/ig, "");
		window.open(link,"_newtab");
	});
	$("#button_move").live("click", function(e) {
		showContextMenuMove(image_view.attr("data-id"), e.pageX, e.pageY);
	});
	$("#button_trash_album").live("click", function() { 
		if (content.attr("data-id")=="0") deleteUnsorted();
		else deleteAlbum();
	});
	$("#button_trash").live("click", function() { deletePhoto() });
	$("#button_edit_album").live("click", function() { renameAlbum() });
	$("#button_edit").live("click", function() { renamePhoto() });
	$("#button_info").live("click", function() { showInfobox() });
	$("#button_archive").live("click", function() { getAlbumArchive() });
	$("#button_sync").live("click", function() { syncFolder() });

	/* Rename Album/Photo via Titlebar */
	$("#title.editable").live("click", function() {
		if (visibleImageview()) renamePhoto(); else renameAlbum();
	});
	
	/* Context Menu */
	$(".photo").live("contextmenu", function(e) {
		e.preventDefault();
		showContextMenuPhoto($(this).attr("data-id"), e.pageX, e.pageY);
	});
	$(".contextmenu_bg").live("click", closeContextMenu);

	/* Star/Share Photo */
	$("#button_star").live("click", setPhotoStar);
	$("#button_share").live("click", function(e) {
		if ($("#button_share a.active").length) showContextMenuShare(image_view.attr("data-id"), e.pageX, e.pageY);
		else setPhotoPublic(e);
	});
	$(".copylink").live("click", function() { $(this).select() });
	
	/* Upload */
	$("#upload_files").live("change", function() {
		closeModal();
		handleFiles(this.files);
		$("#upload_button").click();
	});
	
	/* Search */
	$("#search").live("keyup", function() { search($(this).val()) });

	/* Nav Forward */
	$(".album").live("click", function() { setURL("a" + $(this).attr("data-id")) });
	$(".photo").live("click", function() { setURL("a" + content.attr("data-id") + "p" + $(this).attr("data-id")) });

	/* Nav Back */
	$("#button_back_home").live("click", function() { setURL("") });
	$("#button_back").live("click", function() { setURL("a" + content.attr("data-id")) });

	/* Close Modal */
	$(".message a.close").live("click", closeModal);

	/* Image View */
	$("#image_view a#previous").live("click", loadPreviousPhoto);
	$("#image_view a#next").live("click", loadNextPhoto);
	
	/* Infobox */
	$("#infobox_overlay, #infobox .header a").live("click", function() { hideInfobox() });
	$("#edit_description").live("click", function() { setPhotoDescription() });
	
	/* Window */
	$(window).keydown(key);
	$(window).bind("popstate", getURL);
	$(window).bind("mouseleave", hideControls);
	$(window).bind("mouseenter", showControls);
	
	/* Init */
	if ((BrowserDetect.browser=="Explorer")||(BrowserDetect.browser=="Safari"&&BrowserDetect.version<5)||(BrowserDetect.browser=="Chrome"&&BrowserDetect.version<18)||(BrowserDetect.browser=="Firefox"&&BrowserDetect.version<14)) {
		
		modal = buildModal("Browser not supported", "You are currently using an outdated or unsupported Browser. This site might not work properly. Please consider to update your Browser!", ["Leave"], ["location.href = 'http://browsehappy.com';"]);
		$("body").append(modal);
		
	} else init();
	
});