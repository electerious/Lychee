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
	version = "1.0.2";

$(document).ready(function(){

	/* Event Name */
	if (mobileBrowser()) event_name = "touchend";
	else event_name = "click";

	/* Login */
	$("#password").live("keyup", function() {
		if ($(this).val().length>0) $(this).removeClass("error");
	});

	/* Add Dialog */
	$(".button_add").live(event_name, function() { $("body").append(buildAddModal) });
	$("#add_album").live(event_name, addAlbum);
	$("#add_photo").live(event_name, function() { $("#auswahl").html(""); $("#upload_files").click() });

	/* Toolbar Buttons */
	$("#button_signout").live(event_name, function() {
		modal = buildModal("Sign Out", "Are you sure you want to leave and log out?", ["Sign out", "Stay here"], ["logout();", ""]);
		$("body").append(modal);
	});
	$("#button_download").live(event_name, function() {
		link = $("#image_view #image").css("background-image").replace(/"/g,"").replace(/url\(|\)$/ig, "");
		window.open(link,"_newtab");
	});
	$("#button_move").live(event_name, function(e) {
		showContextMenuMove(image_view.attr("data-id"), e.pageX, e.pageY);
	});
	$("#button_trash_album").live(event_name, function() {
		if (content.attr("data-id")=="0") deleteUnsorted();
		else deleteAlbum();
	});
	$("#button_trash").live(event_name, function() { deletePhoto() });
	$("#button_edit_album").live(event_name, function() { renameAlbum() });
	$("#button_edit").live(event_name, function() { renamePhoto() });
	$("#button_info").live(event_name, function() { showInfobox() });
	$("#button_archive").live(event_name, function() { getAlbumArchive() });
	$("#button_sync").live(event_name, function() { syncFolder() });

	/* Rename Album/Photo via Titlebar */
	$("#title.editable").live(event_name, function() {
		if (visibleImageview()) renamePhoto(); else renameAlbum();
	});

	/* Context Menu */
	$(".photo").live("contextmenu", function(e) {
		e.preventDefault();
		showContextMenuPhoto($(this).attr("data-id"), e.pageX, e.pageY);
	});
	$(".contextmenu_bg").live(event_name, closeContextMenu);

	/* Star/Share Photo */
	$("#button_star").live(event_name, setPhotoStar);
	$("#button_share").live(event_name, function(e) {
		if ($("#button_share a.active").length) showContextMenuShare(image_view.attr("data-id"), e.pageX, e.pageY);
		else setPhotoPublic(e);
	});
	$(".copylink").live(event_name, function() { $(this).select() });

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
	$("#button_back_home").live(event_name, function() { setURL("") });
	$("#button_back").live(event_name, function() { setURL("a" + content.attr("data-id")) });

	/* Close Modal */
	$(".message a.close").live(event_name, closeModal);

	/* Image View */
	$("#image_view a#previous").live(event_name, loadPreviousPhoto);
	$("#image_view a#next").live(event_name, loadNextPhoto);

	/* Infobox */
	$("#infobox_overlay, #infobox .header a").live(event_name, function() { hideInfobox() });
	$("#edit_description").live(event_name, function() { setPhotoDescription() });

	/* Window */
	$(window).keydown(key);
	$(window).bind("popstate", getURL);
	$(window).bind("mouseleave", hideControls);
	$(window).bind("mouseenter", showControls);

	/* Init */
	if ((BrowserDetect.browser=="Explorer")||(BrowserDetect.browser=="Safari"&&BrowserDetect.version<5)||(BrowserDetect.browser=="Chrome"&&BrowserDetect.version<18)||(BrowserDetect.browser=="Firefox"&&BrowserDetect.version<15)) {

		modal = buildModal("Browser not supported", "You are currently using an outdated or unsupported Browser. This site might not work properly. Please consider to update your Browser!", ["Leave"], ["location.href = 'http://browsehappy.com';"]);
		$("body").append(modal);

	} else init();

});