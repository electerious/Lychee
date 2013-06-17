/**
 * @name        view.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 */

var header = $("header"),
	headerTitle = $("#title"),
	image_view = $("#image_view"),
	api_path = "php/api.php",
	infobox = $("#infobox");

$(document).ready(function(){

	/* Event Name */
	if (mobileBrowser()) event_name = "touchend";
	else event_name = "click";

	/* Window */
	$(window).keydown(key);

	/* Infobox */
	$(document).on(event_name, "#infobox .header a", function() { hideInfobox() });
	$(document).on(event_name, "#infobox_overlay", function() { hideInfobox() });
	$("#button_info").on(event_name, function() { showInfobox() });

	/* Download */
	$("#button_download").on(event_name, function() {
		link = $("#image_view #image").css("background-image").replace(/"/g,"").replace(/url\(|\)$/ig, "");
		window.open(link,"_newtab");
	});

	loadPhotoInfo(gup("p"));

});

function key(e) {

	code = (e.keyCode ? e.keyCode : e.which);
	if (code==27&&visibleInfobox()) { hideInfobox(); e.preventDefault(); }

}

function visibleInfobox() {

	if (parseInt(infobox.css("right").replace("px", ""))<0) return false;
	else return true;

}

function isPhotoSmall(photo) {

	size = [
		["width", false],
		["height", false]
	];

	if (photo.width<$(window).width()-60) size["width"] = true;
	if (photo.height<$(window).height()-100) size["height"] = true;

	if (size["width"]&&size["height"]) return true;
	else return false;

}

function showInfobox() {

	$("body").append("<div id='infobox_overlay'></div>");
	infobox.css("right", "0px");

}

function hideInfobox() {

	$("#infobox_overlay").remove();
	infobox.css("right", "-320px");

}

function loadPhotoInfo(photoID) {

	params = "function=getPhotoInfo&photoID=" + photoID + "&password=''";
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {

		if (!data.title) data.title = "Untitled";
		document.title = "Lychee - " + data.title;
		headerTitle.html(data.title);

		image_view.attr("data-id", photoID);
		if (isPhotoSmall(data)) image_view.html("<div id='image' class='small' style='background-image: url(" + data.url + "); width: " + data.width + "px; height: " + data.height + "px; margin-top: -" + parseInt((data.height/2)-20) + "px; margin-left: -" + data.width/2 + "px;'></div>");
		else image_view.html("<div id='image' style='background-image: url(" + data.url + "); top: 70px; right: 30px; bottom: 30px; left: 30px;'></div>");
		image_view.removeClass("fadeOut").addClass("fadeIn").show();

		infobox.html(build.infobox(data, true)).show();

	}, error: ajaxError });

}

function ajaxError(jqXHR, textStatus, errorThrown) {

	console.log(jqXHR);
	console.log(textStatus);
	console.log(errorThrown);

}