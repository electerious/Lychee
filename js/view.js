/**
 * @name        view.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2012 by Philipp Maurer, Tobias Reich
 */

var header = $("header"),
	headerTitle = $("#title"),
	image_view = $("#image_view"),
	api_path = "php/api.php",
	infobox = $("#infobox");
	
$(document).ready(function(){

	/* Infobox */
	$("#infobox_overlay, #infobox .header a").live("click", function() { hideInfobox() });
	$("#button_info").live("click", function() { showInfobox() });

	/* Download */
	$("#button_download").live("click", function() {
		link = $("#image_view #image").css("background-image").replace(/"/g,"").replace(/url\(|\)$/ig, "");
		window.open(link,"_newtab");
	});
	
	loadPhotoInfo(gup("p"));
	
});

function showInfobox() {

	$("body").append("<div id='infobox_overlay'></div>");
	infobox.css("right", "0px");
	
}

function hideInfobox() {

	$("#infobox_overlay").remove();
	infobox.css("right", "-320px");
	
}

function loadPhotoInfo(photoID) {

	params = "function=getPhotoInfo&photoID=" + photoID;
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {

		if (!data.title) data.title = "Untitled";
		document.title = "Lychee - " + data.title;
		headerTitle.html(data.title);

		image_view.attr("data-id", photoID);
		image_view.html("").append("<div id='image' style='background-image: url(" + data.url + ")'></div>");
		image_view.removeClass("fadeOut").addClass("fadeIn").show();
		
		infobox.html(buildInfobox(data)).show();

	}, error: ajaxError });

}

function ajaxError(jqXHR, textStatus, errorThrown) {

	console.log(jqXHR);
	console.log(textStatus);
	console.log(errorThrown);
	
}