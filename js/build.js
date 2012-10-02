/**
 * @name        build.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2012 by Philipp Maurer, Tobias Reich
 */

/*
	Build Functions 
	This functions are used to generate HTML-Code.
*/

function buildDivider(title) {

	return "<div class='divider fadeIn'><h1>" + title + "</h1></div>";

}

function buildAlbum(albumJSON) {

	if(!albumJSON) return "";
	if(!albumJSON.thumb0) albumJSON.thumb0 = "img/no_images.png";
	if(!albumJSON.thumb1) albumJSON.thumb1 = "img/no_images.png";
	if(!albumJSON.thumb2) albumJSON.thumb2 = "img/no_images.png";
	if(!albumJSON.title) albumJSON.title = "Untitled";
	if(albumJSON.title.length>18) albumJSON.title = albumJSON.title.substr(0, 18) + "...";

	var album = "";
	album += "<div class='album' data-id='" + albumJSON.id + "'>";
	album +=	"<img src='" + albumJSON.thumb2 + "' width='200' height='200' alt='thumb'>";
	album +=	"<img src='" + albumJSON.thumb1 + "' width='200' height='200' alt='thumb'>";
	album +=	"<img src='" + albumJSON.thumb0 + "' width='200' height='200' alt='thumb'>";
	album += 	"<div class='overlay'>";
	album += 		"<h1>" + albumJSON.title + "</h1>";
	album += 		"<a>" + albumJSON.sysdate + "</a>";
	album += 	"</div>";
	
	if(albumJSON.star=="1") album += "<a class='badge red icon-star'></a>";
	if(albumJSON.public=="1") album += "<a class='badge red icon-rss'></a>";
	if(albumJSON.unsorted=="1") album += "<a class='badge red icon-reorder'></a>";
	
	album += "</div>";
	
	return album;

}

function buildPhoto(photoJSON) {

	if(photoJSON=="") return "";
	if(!photoJSON.title) photoJSON.title = "";
	if(!photoJSON.thumbUrl) photoJSON.thumbUrl = "img/no_image.png";
	if(photoJSON.title.length>18) photoJSON.title = photoJSON.title.substr(0, 18) + "...";

	var photo = "";
	photo += "<div class='photo' data-id='" + photoJSON.id + "'>";
	photo +=	"<img src='" + photoJSON.thumbUrl + "' width='200' height='200' alt='thumb'>";
	photo += 	"<div class='overlay'>";
	photo += 		"<h1>" + photoJSON.title + "</h1>";
	photo += 		"<a>" + photoJSON.sysdate + "</a>";
	photo += 	"</div>";
	
	if(photoJSON.star=="1") photo += "<a class='badge red icon-star'></a>";
	if(photoJSON.public=="1") photo += "<a class='badge red icon-rss'></a>";

	photo += "</div>";
	
	return photo;

}

function buildModal(title, text, button, func) {

	var modal = "";
	modal += "<div class='message_overlay fadeIn'>";
	modal += 	"<div class='message center'>";
	modal += 		"<h1>" + title + "</h1>";
	modal += 		"<a class='close icon-remove-sign'></a>";
	modal += 		"<p>" + text + "</p>";
	
	$.each(button, function(index) {

	if (index==0) modal += "<a onclick='message_click(" + index + ")' class='button active'>" + this + "</a>";
	else modal += "<a onclick='message_click(" + index + ")' class='button'>" + this + "</a>";
	
	});
	
	modal += 	"</div>";
	
	modal += 	"<script>";
	modal += 		"function message_click(action) {";
	modal += 		"switch (action) {";
	
	$.each(func, function(index) {
	
	modal +=			"case " + index + ":";
	modal +=			this.toString();
	modal +=			"break;";
	
	});
	
	modal +=		"} closeModal(); }";
	modal += 	"</script>";
	
	modal += "</div>";
	
	return modal;

}

function buildAddModal() {

	var modal = "";
	modal += "<div class='message_overlay fadeIn'>";
	modal += 	"<div class='message center add'>";
	modal += 		"<h1>Add Album or Photo</h1>";
	modal += 		"<a class='close icon-remove-sign'></a>";
	modal +=		"<div id='add_album' class='add_album'>";
	modal +=			"<div class='icon icon-folder-close'></div>";
	modal +=			"<a>Add new Album</a>";
	modal +=		"</div>";
	modal +=		"<div id='add_photo' class='add_album'>";
	modal +=			"<div class='icon icon-picture'></div>";
	modal +=			"<a>Upload new Photo</a>";
	modal +=		"</div>";
	modal += 	"</div>";	
	modal += "</div>";
	
	return modal;

}

function buildSignInModal() {

	var modal = "";
	modal += "<div class='message_overlay'>";
	modal += 	"<div class='message center'>";
	modal += 		"<h1><a class='icon-lock'></a> Sign in</h1>";
	modal += 		"<div class='sign_in'>";
	modal += 			"<label>Username:</label><input id='username' type='text' name='' value=''>";
	modal += 			"<label>Password:</label><input id='password' type='password' name='' value=''>";
	modal += 		"</div>";
	modal += 	"<a onclick='login()' class='button active'>Sign in</a>";
	modal += 	"</div>";
	modal += "</div>";
	
	return modal;

}

function buildUploadModal() {

	var modal = "";
	modal += "<div class='upload_overlay fadeIn'>";
	modal += 	"<div class='upload_message center'>";
	modal += 		"<a class='icon-upload'></a>";
	modal += 		"<div class='progressbar'><div></div></div>";
	modal += 	"</div>";
	modal += "</div>";
	
	return modal;

}

function buildContextMenu(items) {
	
	var menu = "";
	menu += "<div class='contextmenu_bg'></div>";
	menu += "<div class='contextmenu'>";
	menu +=		"<table>";
	menu +=			"<tbody>";
	
	$.each(items, function(index) {
	
		if (items[index][1].length!=0) {
			menu += "<tr><td onclick='" + items[index][1] + "; closeContextMenu();'>" + items[index][0] + "</td></tr>";
		}
	
	});
	
	menu +=			"</tbody>";
	menu +=		"</table>";
	menu +=	"</div>";
	
	return menu;
	
}

function buildInfobox(photo) {

	var infobox = "";
	infobox += "<div class='header'><h1>About</h1><a class='icon-remove-sign'></a></div>";
	infobox += "<div class='wrapper'>";
	
	if (photo.public==1) photo.public = "Public"; else photo.public = "Private";
	
	infos = [
		["", "Basics"],
		["Name", photo.title],
		["Uploaded", photo.sysdate],
		["Description", photo.description +  " <div id='edit_description'><a class='icon-pencil'></a></div>"],
		["", "Image"],
		["Size", photo.size],
		["Format", photo.type],
		["Resolution", photo.width + " x " + photo.height],
		["", "Camera"],
		["Captured", photo.takedate],
		["Make", photo.make],
		["Type/Model", photo.model],
		["Shutter Speed", photo.shutter],
		["Aperture", photo.aperture],
		["Focal Length", photo.focal],
		["ISO", photo.iso],
		["", "Share"],
		["Privacy", photo.public],
		["Short Link", photo.shortlink]
	];
		
	$.each(infos, function(index) {
	
		if (infos[index][1]==""||infos[index][1]==undefined||infos[index][1]==null) infos[index][1] = "-";
		
		if (infos[index][0]=="") {
		
			infobox += "</table>";
			infobox += "<div class='separater'><h1>" + infos[index][1] + "</h1></div>";
			infobox += "<table id='infos'>";
		
		} else {
		
			infobox += 	"<tr>";
			infobox +=  	"<td>" + infos[index][0] + "</td>";
			infobox +=  	"<td>" + infos[index][1] + "</td>";
			infobox += 	"</tr>";
		
		}
		
	});
	
	infobox += "</table>";
	infobox += "<div class='bumper'></div>";
	infobox += "</div>";
	
	return infobox;

}