/**
 * @name        build.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Build Module
 * This module is used to generate HTML-Code.
 */

build = {

	divider: function(title) {

		return "<div class='divider fadeIn'><h1>" + title + "</h1></div>";

	},

	album: function(albumJSON) {

		if (!albumJSON) return "";

		var album = ""
			title = albumJSON.title;

		if (title.length>18) title = albumJSON.title.substr(0, 18) + "...";

		album += "<div  class='album' data-id='" + albumJSON.id + "' data-password='" + albumJSON.password + "'>";
		album +=	"<img src='" + albumJSON.thumb2 + "' width='200' height='200' alt='thumb'>";
		album +=	"<img src='" + albumJSON.thumb1 + "' width='200' height='200' alt='thumb'>";
		album +=	"<img src='" + albumJSON.thumb0 + "' width='200' height='200' alt='thumb'>";
		album += 	"<div class='overlay'>";

		if (albumJSON.password&&!lychee.publicMode) album += "<h1><span class='icon-lock'></span> " + title + "</h1>";
		else album += "<h1>" + title + "</h1>";

		album += 		"<a>" + albumJSON.sysdate + "</a>";
		album += 	"</div>";

		if(!lychee.publicMode&&albumJSON.star==1) album += "<a class='badge red icon-star'></a>";
		if(!lychee.publicMode&&albumJSON.public==1) album += "<a class='badge red icon-share'></a>";
		if(!lychee.publicMode&&albumJSON.unsorted==1) album += "<a class='badge red icon-reorder'></a>";

		album += "</div>";

		return album;

	},

	photo: function(photoJSON) {

		if (!photoJSON) return "";

		var photo = "",
			title = photoJSON.title;

		if (title.length>18) title = photoJSON.title.substr(0, 18) + "...";

		photo += "<div class='photo' data-album-id='" + photoJSON.album + "' data-id='" + photoJSON.id + "'>";
		photo +=	"<img src='" + photoJSON.thumbUrl + "' width='200' height='200' alt='thumb'>";
		photo += 	"<div class='overlay'>";
		photo += 		"<h1>" + title + "</h1>";
		photo += 		"<a>" + photoJSON.sysdate + "</a>";
		photo += 	"</div>";

		if (photoJSON.star==1) photo += "<a class='badge red icon-star'></a>";
		if (!lychee.publicMode&&photoJSON.public==1&&album.json.public!=1) photo += "<a class='badge red icon-share'></a>";

		photo += "</div>";

		return photo;

	},

	no_content: function(typ) {

		var no_content = "";

		no_content += "<div class='no_content fadeIn'>";
		no_content += 	"<a class='icon icon-" + typ + "'></a>";

		if (typ=="search") no_content += "<p>No results</p>";
		else if (typ=="picture") no_content += "<p>No public albums</p>";

		no_content += "</div>";

		return no_content;

	},

	modal: function(title, text, button) {

		var modal = "";

		modal += "<div class='message_overlay fadeIn'>";
		modal += 	"<div class='message center'>";
		modal += 		"<h1>" + title + "</h1>";
		modal += 		"<a class='close icon-remove-sign'></a>";
		modal += 		"<p>" + text + "</p>";

		$.each(button, function(index) {

			if (this[0]!="") {

				if (index==0) modal += "<a class='button active'>" + this[0] + "</a>";
				else modal += "<a class='button'>" + this[0] + "</a>";

			}

		});

		modal += 	"</div>";
		modal += "</div>";

		return modal;

	},

	addModal: function() {

		var modal = "";

		modal += "<div class='message_overlay fadeIn'>";
		modal += 	"<div class='message center add'>";
		modal += 		"<h1>Add Album or Photo</h1>";
		modal += 		"<a class='close icon-remove-sign'></a>";
		modal +=		"<div id='add_album' class='add_album'>";
		modal +=			"<div class='icon icon-folder-close'></div>";
		modal +=			"<a>New Album</a>";
		modal +=		"</div>";
		modal +=		"<div id='add_link' class='add_album'>";
		modal +=			"<div class='icon icon-link'></div>";
		modal +=			"<a>Import Link</a>";
		modal +=		"</div>";
		modal +=		"<div id='add_photo' class='add_album'>";
		modal +=			"<div class='icon icon-picture'></div>";
		modal +=			"<a>Upload Photo</a>";
		modal +=		"</div>";
		modal += 	"</div>";
		modal += "</div>";

		return modal;

	},

	signInModal: function() {

		var modal = "";

		modal += "<div class='message_overlay'>";
		modal += 	"<div class='message center'>";
		modal += 		"<h1><a class='icon-lock'></a> Sign In</h1>";
		modal += 		"<div class='sign_in'>";
		modal += 			"<input id='username' type='text' name='' value='' placeholder='username'>";
		modal += 			"<input id='password' type='password' name='' value='' placeholder='password'>";
		modal += 		"</div>";
		modal +=		"<div id='version'>Version " + lychee.version + "<span> &#8211; <a target='_blank' href='" + lychee.updateURL + "'>Update available!</a><span></div>";
		modal += 		"<a onclick='lychee.login()' class='button active'>Sign in</a>";
		modal += 	"</div>";
		modal += "</div>";

		return modal;

	},

	uploadModal: function() {

		var modal = "";

		modal += "<div class='upload_overlay fadeIn'>";
		modal += 	"<div class='upload_message center'>";
		modal += 		"<a class='icon-upload'></a>";
		modal += 		"<div class='progressbar'><div></div></div>";
		modal += 	"</div>";
		modal += "</div>";

		return modal;

	},

	contextMenu: function(items) {

		var menu = "";

		menu += "<div class='contextmenu_bg'></div>";
		menu += "<div class='contextmenu'>";
		menu +=		"<table>";
		menu +=			"<tbody>";

		$.each(items, function(index) {

			if (items[index][0]=="separator"&&items[index][1]==-1) menu += "<tr class='separator'></tr>";
			else if (items[index][1]==-1) menu += "<tr class='no_hover'><td>" + items[index][0] + "</td></tr>";
			else if (items[index][2]!=undefined) menu += "<tr><td onclick='" + items[index][2] + "; window.contextMenu.close();'>" + items[index][0] + "</td></tr>";
			else menu += "<tr><td onclick='window.contextMenu.fns[" + items[index][1] + "](); window.contextMenu.close();'>" + items[index][0] + "</td></tr>";

		});

		menu +=			"</tbody>";
		menu +=		"</table>";
		menu +=	"</div>";

		return menu;

	},

	infobox: function(photoJSON, forView) {

		if (!photoJSON) return "";

		var infobox = "",
			public,
			editTitleHTML,
			editDescriptionHTML,
			infos;

		infobox += "<div class='header'><h1>About</h1><a class='icon-remove-sign'></a></div>";
		infobox += "<div class='wrapper'>";

		switch (photoJSON.public) {
			case "0":
				public = "Private";
				break;
			case "1":
				public = "Public";
				break;
			case "2":
				public = "Public (Album)";
				break;
			default:
				public = "-";
				break;
		}

		editTitleHTML = (forView==true||lychee.publicMode) ? "" : " <div id='edit_title'><a class='icon-pencil'></a></div>";
		editDescriptionHTML = (forView==true||lychee.publicMode) ? "" : " <div id='edit_description'><a class='icon-pencil'></a></div>";

		infos = [
			["", "Basics"],
			["Name", photoJSON.title + editTitleHTML],
			["Uploaded", photoJSON.sysdate],
			["Description", photoJSON.description + editDescriptionHTML],
			["", "Image"],
			["Size", photoJSON.size],
			["Format", photoJSON.type],
			["Resolution", photoJSON.width + " x " + photoJSON.height],
			["", "Camera"],
			["Captured", photoJSON.takedate],
			["Make", photoJSON.make],
			["Type/Model", photoJSON.model],
			["Shutter Speed", photoJSON.shutter],
			["Aperture", photoJSON.aperture],
			["Focal Length", photoJSON.focal],
			["ISO", photoJSON.iso],
			["", "Share"],
			["Visibility", public]
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
				infobox +=  	"<td class='attr_" + infos[index][0].toLowerCase() + "'>" + infos[index][1] + "</td>";
				infobox += 	"</tr>";

			}

		});

		infobox += "</table>";
		infobox += "<div class='bumper'></div>";
		infobox += "</div>";

		return infobox;

	}

}