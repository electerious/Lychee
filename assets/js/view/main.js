/**
 * @name		Main
 * @description	Used to view single photos with view.php
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

var header = $("header"),
	headerTitle = $("#title"),
	imageview = $("#imageview"),
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

	/* Direct Link */
	$("#button_direct").on(event_name, function() {

		link = $("#imageview #image").css("background-image").replace(/"/g,"").replace(/url\(|\)$/ig, "");
		window.open(link,"_newtab");

	});

	loadPhotoInfo(gup("p"));

});

function key(e) {

	code = (e.keyCode ? e.keyCode : e.which);
	if (code===27&&visibleInfobox()) { hideInfobox(); e.preventDefault(); }

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

	$("body").append("<div id='infobox_overlay' class='fadeIn'></div>");
	infobox.addClass("active");

}

function hideInfobox() {

	$("#infobox_overlay").removeClass("fadeIn").addClass("fadeOut");
	setTimeout(function() { $("#infobox_overlay").remove() }, 300);
	infobox.removeClass("active");

}

function loadPhotoInfo(photoID) {

	params = "function=getPhoto&photoID=" + photoID + "&albumID=0&password=''";
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {

		if (!data.title) data.title = "Untitled";
		document.title = "Lychee - " + data.title;
		headerTitle.html(data.title);

		data.url = "uploads/big/" + data.url;

		imageview.attr("data-id", photoID);
		if (isPhotoSmall(data)) imageview.html("<div id='image' class='small' style='background-image: url(" + data.url + "); width: " + data.width + "px; height: " + data.height + "px; margin-top: -" + parseInt((data.height/2)-20) + "px; margin-left: -" + data.width/2 + "px;'></div>");
		else imageview.html("<div id='image' style='background-image: url(" + data.url + ");'></div>");
		imageview.removeClass("fadeOut").addClass("fadeIn").show();

		infobox.html(build.infoboxPhoto(data, true)).show();

	}, error: ajaxError });

}

function ajaxError(jqXHR, textStatus, errorThrown) {

	console.log(jqXHR);
	console.log(textStatus);
	console.log(errorThrown);

}