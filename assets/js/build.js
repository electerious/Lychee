/**
 * @name		Build Module
 * @description	This module is used to generate HTML-Code.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

build = {

	divider: function(title) {

		return "<div class='divider fadeIn'><h1>" + title + "</h1></div>";

	},

	editIcon: function(id) {

		return "<div id='" + id + "' class='edit'><a class='icon-pencil'></a></div>";

	},

	multiselect: function(top, left) {

		return "<div id='multiselect' style='top: " + top + "px; left: " + left + "px;'></div>";

	},

	album: function(albumJSON) {

		if (!albumJSON) return "";

		var album = "",
			longTitle = "",
			title = albumJSON.title,
			typeThumb = "";

		if (title!==null&&title.length>18) {
			title = albumJSON.title.substr(0, 18) + "...";
			longTitle = albumJSON.title;
		}

		if (albumJSON.thumb0.split('.').pop()==="svg") typeThumb = "nonretina";

		album += "<div  class='album' data-id='" + albumJSON.id + "' data-password='" + albumJSON.password + "'>";
		album +=	"<img src='" + albumJSON.thumb2 + "' width='200' height='200' alt='thumb' data-type='nonretina'>";
		album +=	"<img src='" + albumJSON.thumb1 + "' width='200' height='200' alt='thumb' data-type='nonretina'>";
		album +=	"<img src='" + albumJSON.thumb0 + "' width='200' height='200' alt='thumb' data-type='" + typeThumb + "'>";
		album +=	"<div class='overlay'>";

		if (albumJSON.password&&!lychee.publicMode) album += "<h1><span class='icon-lock'></span> " + title + "</h1>";
		else album += "<h1 title='" + longTitle + "'>" + title + "</h1>";

		album +=		"<a>" + albumJSON.sysdate + "</a>";
		album +=	"</div>";

		if (!lychee.publicMode) {

			if(albumJSON.star==1)		album += "<a class='badge red icon-star'></a>";
			if(albumJSON.public==1)		album += "<a class='badge red icon-share'></a>";
			if(albumJSON.unsorted==1)	album += "<a class='badge red icon-reorder'></a>";
			if(albumJSON.recent==1)		album += "<a class='badge red icon-time'></a>";

		}

		album += "</div>";

		return album;

	},

	photo: function(photoJSON) {

		if (!photoJSON) return "";

		var photo = "",
			longTitle = "",
			title = photoJSON.title;

		if (title!==null&&title.length>18) {
			title = photoJSON.title.substr(0, 18) + "...";
			longTitle = photoJSON.title;
		}

		photo += "<div class='photo' data-album-id='" + photoJSON.album + "' data-id='" + photoJSON.id + "'>";
		photo +=	"<img src='" + photoJSON.thumbUrl + "' width='200' height='200' alt='thumb'>";
		photo +=	"<div class='overlay'>";
		photo +=		"<h1 title='" + longTitle + "'>" + title + "</h1>";

		if (photoJSON.cameraDate==1) {
			photo += "<a><span class='icon-camera' title='Photo Date'></span>" + photoJSON.sysdate + "</a>";
		} else {
			photo += "<a>" + photoJSON.sysdate + "</a>";
		}

		photo +=	"</div>";

		if (photoJSON.star==1) photo += "<a class='badge red icon-star'></a>";
		if (!lychee.publicMode&&photoJSON.public==1&&album.json.public!=1) photo += "<a class='badge red icon-share'></a>";

		photo += "</div>";

		return photo;

	},

	imageview: function(photoJSON, isSmall, visibleControls) {

		if (!photoJSON) return "";

		var view = "";

		view += "<div class='arrow_wrapper previous'><a id='previous' class='icon-caret-left'></a></div>";
		view += "<div class='arrow_wrapper next'><a id='next' class='icon-caret-right'></a></div>";

		if (isSmall) {

			if (visibleControls)
				view += "<div id='image' class='small' style='background-image: url(" + photoJSON.url + "); width: " + photoJSON.width + "px; height: " + photoJSON.height + "px; margin-top: -" + parseInt(photoJSON.height/2-20) + "px; margin-left: -" + photoJSON.width/2 + "px;'></div>";
			else
				view += "<div id='image' class='small' style='background-image: url(" + photoJSON.url + "); width: " + photoJSON.width + "px; height: " + photoJSON.height + "px; margin-top: -" + parseInt(photoJSON.height/2) + "px; margin-left: -" + photoJSON.width/2 + "px;'></div>";

		} else {

			if (visibleControls)
				view += "<div id='image' style='background-image: url(" + photoJSON.url + ")'></div>";
			else
				view += "<div id='image' style='background-image: url(" + photoJSON.url + ");' class='full'></div>";

		}

		return view;

	},

	no_content: function(typ) {

		var no_content = "";

		no_content += "<div class='no_content fadeIn'>";
		no_content +=	"<a class='icon icon-" + typ + "'></a>";

		if (typ==="search")		no_content += "<p>No results</p>";
		else if (typ==="share")	no_content += "<p>No public albums</p>";
		else if (typ==="cog")	no_content += "<p>No configuration</p>";

		no_content += "</div>";

		return no_content;

	},

	modal: function(title, text, button, marginTop, closeButton) {

		var modal = "",
			custom_style = "";

		if (marginTop) custom_style = "style='margin-top: " + marginTop + "px;'";

		modal += "<div class='message_overlay fadeIn'>";
		modal +=	"<div class='message center'" + custom_style + ">";
		modal +=		"<h1>" + title + "</h1>";

		if (closeButton!==false) {

			modal +=		"<a class='close icon-remove-sign'></a>";

		}

		modal +=		"<p>" + text + "</p>";

		$.each(button, function(index) {

			if (this[0]!=="") {

				if (index===0) modal += "<a class='button active'>" + this[0] + "</a>";
				else modal += "<a class='button'>" + this[0] + "</a>";

			}

		});

		modal +=	"</div>";
		modal += "</div>";

		return modal;

	},

	signInModal: function() {

		var modal = "";

		modal += "<div class='message_overlay'>";
		modal +=	"<div class='message center'>";
		modal +=		"<h1><a class='icon-lock'></a> Sign In</h1>";
		modal +=		"<a class='close icon-remove-sign'></a>";
		modal +=		"<div class='sign_in'>";
		modal +=			"<input id='username' type='text' value='' placeholder='username' autocapitalize='off' autocorrect='off'>";
		modal +=			"<input id='password' type='password' value='' placeholder='password'>";
		modal +=		"</div>";
		modal +=		"<div id='version'>Version " + lychee.version + "<span> &#8211; <a target='_blank' href='" + lychee.updateURL + "'>Update available!</a><span></div>";
		modal +=		"<a onclick='lychee.login()' class='button active'>Sign in</a>";
		modal +=	"</div>";
		modal += "</div>";

		return modal;

	},

	uploadModal: function(title, files) {

		var modal = "";

		modal += "<div class='upload_overlay fadeIn'>";
		modal +=	"<div class='upload_message center'>";
		modal +=		"<h1>" + title + "</h1>";
		modal +=		"<a class='close icon-remove-sign'></a>";
		modal +=		"<div class='rows'>";

		for (var i = 0; i < files.length; i++) {

			if (files[i].name.length>40) files[i].name = files[i].name.substr(0, 17) + "..." + files[i].name.substr(files[i].name.length-20, 20);

			modal += "<div class='row'>";
			modal +=	"<a class='name'>" + lychee.escapeHTML(files[i].name) + "</a>";

			if (files[i].supported===true)	modal += "<a class='status'></a>";
			else							modal += "<a class='status error'>Not supported</a>";

			modal +=	"<p class='notice'></p>";
			modal += "</div>";

		}

		modal +=		"</div>";
		modal +=	"</div>";
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

			if (items[index][0]==="separator"&&items[index][1]===-1) menu += "<tr class='separator'></tr>";
			else if (items[index][1]===-1) menu += "<tr class='no_hover'><td>" + items[index][0] + "</td></tr>";
			else if (items[index][2]!=undefined) menu += "<tr><td onclick='" + items[index][2] + "; window.contextMenu.close();'>" + items[index][0] + "</td></tr>";
			else menu += "<tr><td onclick='window.contextMenu.fns[" + items[index][1] + "](); window.contextMenu.close();'>" + items[index][0] + "</td></tr>";

		});

		menu +=			"</tbody>";
		menu +=		"</table>";
		menu +=	"</div>";

		return menu;

	},

	tags: function(tags, forView) {

		var html = "",
			editTagsHTML = (forView===true||lychee.publicMode) ? "" : " " + build.editIcon("edit_tags");

		if (tags!=="") {

			tags = tags.split(",");

			tags.forEach(function(tag, index, array) {

				html += "<a class='tag'>" + tag + "<span class='icon-remove' data-index='" + index + "'></span></a>";

			});

			html += editTagsHTML;

		} else {


			html = "<div class='empty'>No Tags" + editTagsHTML + "</div>";

		}

		return html;

	},

	infoboxPhoto: function(photoJSON, forView) {

		if (!photoJSON) return "";

		var infobox = "",
			public,
			editTitleHTML,
			editDescriptionHTML,
			infos,
			exifHash = "";

		infobox += "<div class='header'><h1>About</h1><a class='icon-remove-sign'></a></div>";
		infobox += "<div class='wrapper'>";

		switch (photoJSON.public) {
			case "0":
				public = "No";
				break;
			case "1":
				public = "Yes";
				break;
			case "2":
				public = "Yes (Album)";
				break;
			default:
				public = "-";
				break;
		}

		editTitleHTML = (forView===true||lychee.publicMode) ? "" : " " + build.editIcon("edit_title");
		editDescriptionHTML = (forView===true||lychee.publicMode) ? "" : " " + build.editIcon("edit_description");

		infos = [
			["", "Basics"],
			["Title", photoJSON.title + editTitleHTML],
			["Uploaded", photoJSON.sysdate],
			["Description", photoJSON.description + editDescriptionHTML],
			["", "Image"],
			["Size", photoJSON.size],
			["Format", photoJSON.type],
			["Resolution", photoJSON.width + " x " + photoJSON.height],
			["Tags", build.tags(photoJSON.tags, forView)]
		];

		exifHash = photoJSON.takestamp+photoJSON.make+photoJSON.model+photoJSON.shutter+photoJSON.aperture+photoJSON.focal+photoJSON.iso;

		if (exifHash!="0"&&exifHash!=="null") {

			infos = infos.concat([
				["", "Camera"],
				["Captured", photoJSON.takedate],
				["Make", photoJSON.make],
				["Type/Model", photoJSON.model],
				["Shutter Speed", photoJSON.shutter],
				["Aperture", photoJSON.aperture],
				["Focal Length", photoJSON.focal],
				["ISO", photoJSON.iso]
			]);

		}

		infos = infos.concat([
			["", "Share"],
			["Public", public]
		]);

		$.each(infos, function(index) {

			if (infos[index][1]===""||infos[index][1]===undefined||infos[index][1]===null) infos[index][1] = "-";

			switch (infos[index][0]) {

				case "":		// Separator
								infobox += "</table>";
								infobox += "<div class='separator'><h1>" + infos[index][1] + "</h1></div>";
								infobox += "<table>";
								break;

				case "Tags":	// Tags
								if (forView!==true&&!lychee.publicMode) {
									infobox += "</table>";
									infobox += "<div class='separator'><h1>" + infos[index][0] + "</h1></div>";
									infobox += "<div id='tags'>" + infos[index][1] + "</div>";
								}
								break;

				default:		// Item
								infobox +=	"<tr>";
								infobox +=		"<td>" + infos[index][0] + "</td>";
								infobox +=		"<td class='attr_" + infos[index][0].toLowerCase() + "'>" + infos[index][1] + "</td>";
								infobox +=	"</tr>";
								break;

			}

		});

		infobox += "</table>";
		infobox += "<div class='bumper'></div>";
		infobox += "</div>";

		return infobox;

	},

	infoboxAlbum: function(albumJSON, forView) {

		if (!albumJSON) return "";

		var infobox = "",
			public = "-",
			password = "-",
			downloadable = "-",
			editTitleHTML,
			editDescriptionHTML,
			infos;

		infobox += "<div class='header'><h1>About</h1><a class='icon-remove-sign'></a></div>";
		infobox += "<div class='wrapper'>";

		switch (albumJSON.public) {
			case "0":
				public = "No";
				break;
			case "1":
				public = "Yes";
				break;
		}

		switch (albumJSON.password) {
			case false:
				password = "No";
				break;
			case true:
				password = "Yes";
				break;
		}

		switch (albumJSON.downloadable) {
			case "0":
				downloadable = "No";
				break;
			case "1":
				downloadable = "Yes";
				break;
		}

		editTitleHTML = (forView===true||lychee.publicMode) ? "" : " " + build.editIcon("edit_title_album");
		editDescriptionHTML = (forView===true||lychee.publicMode) ? "" : " " + build.editIcon("edit_description_album");

		infos = [
			["", "Basics"],
			["Title", albumJSON.title + editTitleHTML],
			["Description", albumJSON.description + editDescriptionHTML],
			["", "Album"],
			["Created", albumJSON.sysdate],
			["Images", albumJSON.num],
			["", "Share"],
			["Public", public],
			["Downloadable", downloadable],
			["Password", password]
		];

		$.each(infos, function(index) {

			if (infos[index][1]===""||infos[index][1]===undefined||infos[index][1]===null) infos[index][1] = "-";

			if (infos[index][0]==="") {

				infobox += "</table>";
				infobox += "<div class='separator'><h1>" + infos[index][1] + "</h1></div>";
				infobox += "<table id='infos'>";

			} else {

				infobox +=	"<tr>";
				infobox +=		"<td>" + infos[index][0] + "</td>";
				infobox +=		"<td class='attr_" + infos[index][0].toLowerCase() + "'>" + infos[index][1] + "</td>";
				infobox +=	"</tr>";

			}

		});

		infobox += "</table>";
		infobox += "<div class='bumper'></div>";
		infobox += "</div>";

		return infobox;

	}

};