/**
 * @name		Album Module
 * @description	Takes care of every action an album can handle and execute.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

album = {

	json: null,

	getID: function() {

		var id;

		if (photo.json) id = photo.json.album;
		else if (album.json) id = album.json.id;
		else id = $(".album:hover, .album.active").attr("data-id");

		// Search
		if (!id) id = $(".album:hover, .album.active").attr("data-id");
		if (!id) id = $(".photo:hover, .photo.active").attr("data-album-id");

		if (id) return id;
		else return false;

	},

	load: function(albumID, refresh) {

		var startTime,
			params,
			durationTime,
			waitTime;

		password.get(albumID, function() {

			if (!refresh) {
				loadingBar.show();
				lychee.animate(".album:nth-child(-n+50), .photo:nth-child(-n+50)", "contentZoomOut");
				lychee.animate(".divider", "fadeOut");
			}

			startTime = new Date().getTime();

			params = "getAlbum&albumID=" + albumID + "&password=" + password.value;
			lychee.api(params, function(data) {

				if (data==="Warning: Album private!") {
					if (document.location.hash.replace("#", "").split("/")[1]!=undefined) {
						// Display photo only
						lychee.setMode("view");
					} else {
						// Album not public
						lychee.content.show();
						lychee.goto("");
					}
					return false;
				}

				if (data==="Warning: Wrong password!") {
					album.load(albumID, refresh);
					return false;
				}

				album.json = data;

				durationTime = (new Date().getTime() - startTime);
				if (durationTime>300) waitTime = 0; else if (refresh) waitTime = 0; else waitTime = 300 - durationTime;
				if (!visible.albums()&&!visible.photo()&&!visible.album()) waitTime = 0;

				setTimeout(function() {

					view.album.init();

					if (!refresh) {
						lychee.animate(".album:nth-child(-n+50), .photo:nth-child(-n+50)", "contentZoomIn");
						view.header.mode("album");
					}

				}, waitTime);

			});

		});

	},

	parse: function() {

		if (!album.json.title) album.json.title = "Untitled";

	},

	add: function() {

		var title,
			params,
			buttons,
			isNumber = function(n) { return !isNaN(parseFloat(n)) && isFinite(n) };

		buttons = [
			["Create Album", function() {

				title = $(".message input.text").val();

				if (title.length===0) title = "Untitled";

				modal.close();

				params = "addAlbum&title=" + escape(encodeURI(title));
				lychee.api(params, function(data) {

					if (data===true) data = 1; // Avoid first album to be true

					if (data!==false&&isNumber(data)) {
						albums.refresh();
						lychee.goto(data);
					} else {
						lychee.error(null, params, data);
					}

				});

			}],
			["Cancel", function() {}]
		];

		modal.show("New Album", "Enter a title for this album: <input class='text' type='text' maxlength='30' placeholder='Title' value='Untitled'>", buttons);

	},

	delete: function(albumIDs) {

		var params,
			buttons,
			albumTitle;

		if (!albumIDs) return false;
		if (albumIDs instanceof Array===false) albumIDs = [albumIDs];

		buttons = [
			["", function() {

				params = "deleteAlbum&albumIDs=" + albumIDs;
				lychee.api(params, function(data) {

					if (visible.albums()) {

						albumIDs.forEach(function(id) {
							albums.json.num--;
							view.albums.content.delete(id);
							delete albums.json.content[id];
						});

					} else {

						albums.refresh();
						lychee.goto("");

					}

					if (data!==true) lychee.error(null, params, data);

				});

			}],
			["", function() {}]
		];

		if (albumIDs.toString()==="0") {

			buttons[0][0] = "Clear Unsorted";
			buttons[1][0] = "Keep Unsorted";

			modal.show("Clear Unsorted", "Are you sure you want to delete all photos from 'Unsorted'?<br>This action can't be undone!", buttons);

		} else if (albumIDs.length===1) {

			buttons[0][0] = "Delete Album and Photos";
			buttons[1][0] = "Keep Album";

			// Get title
			if (album.json) albumTitle = album.json.title;
			else if (albums.json) albumTitle = albums.json.content[albumIDs].title;

			modal.show("Delete Album", "Are you sure you want to delete the album '" + albumTitle + "' and all of the photos it contains? This action can't be undone!", buttons);

		} else {

			buttons[0][0] = "Delete Albums and Photos";
			buttons[1][0] = "Keep Albums";

			modal.show("Delete Albums", "Are you sure you want to delete all " + albumIDs.length + " selected albums and all of the photos they contain? This action can't be undone!", buttons);

		}

	},

	setTitle: function(albumIDs) {

		var oldTitle = "",
			newTitle,
			params,
			buttons;

		if (!albumIDs) return false;
		if (albumIDs instanceof Array===false) albumIDs = [albumIDs];

		if (albumIDs.length===1) {
			// Get old title if only one album is selected
			if (album.json) oldTitle = album.json.title;
			else if (albums.json) oldTitle = albums.json.content[albumIDs].title;
			if (!oldTitle) oldTitle = "";
			oldTitle = oldTitle.replace("'", "&apos;");
		}

		buttons = [
			["Set Title", function() {

				// Get input
				newTitle = $(".message input.text").val();

				// Remove html from input
				newTitle = lychee.removeHTML(newTitle);

				// Set to Untitled when empty
				newTitle = (newTitle==="") ? "Untitled" : newTitle;

				if (visible.album()) {

					album.json.title = newTitle;
					view.album.title();

					if (albums.json) {
						var id = albumIDs[0];
						albums.json.content[id].title = newTitle;
					}

				} else if (visible.albums()) {

					albumIDs.forEach(function(id) {
						albums.json.content[id].title = newTitle;
						view.albums.content.title(id);
					});

				}

				params = "setAlbumTitle&albumIDs=" + albumIDs + "&title=" + escape(encodeURI(newTitle));
				lychee.api(params, function(data) {

					if (data!==true) lychee.error(null, params, data);

				});

			}],
			["Cancel", function() {}]
		];

		if (albumIDs.length===1) modal.show("Set Title", "Enter a new title for this album: <input class='text' type='text' maxlength='30' placeholder='Title' value='" + oldTitle + "'>", buttons);
		else modal.show("Set Titles", "Enter a title for all " + albumIDs.length + " selected album: <input class='text' type='text' maxlength='30' placeholder='Title' value='" + oldTitle + "'>", buttons);

	},

	setDescription: function(photoID) {

		var oldDescription = album.json.description.replace("'", "&apos;"),
			description,
			params,
			buttons;

		buttons = [
			["Set Description", function() {

				// Get input
				description = $(".message input.text").val();

				// Remove html from input
				description = lychee.removeHTML(description);

				if (visible.album()) {
					album.json.description = description;
					view.album.description();
				}

				params = "setAlbumDescription&albumID=" + photoID + "&description=" + escape(encodeURI(description));
				lychee.api(params, function(data) {

					if (data!==true) lychee.error(null, params, data);

				});

			}],
			["Cancel", function() {}]
		];

		modal.show("Set Description", "Please enter a description for this album: <input class='text' type='text' maxlength='800' placeholder='Description' value='" + oldDescription + "'>", buttons);

	},

	setPublic: function(albumID, e) {

		var params,
			password = "",
			listed = false,
			downloadable = false;

		albums.refresh();

		if (!visible.message()&&album.json.public==0) {

			modal.show("Share Album", "This album will be shared with the following properties:</p><form><div class='choice'><input type='checkbox' name='listed' value='listed' checked><h2>Visible</h2><p>Listed to visitors of your Lychee.</p></div><div class='choice'><input type='checkbox' name='downloadable' value='downloadable'><h2>Downloadable</h2><p>Visitors of your Lychee can download this album.</p></div><div class='choice'><input type='checkbox' name='password' value='password'><h2>Password protected</h2><p>Only accessible with a valid password.<input class='text' type='password' placeholder='password' value='' style='display: none;'></p></div></form><p style='display: none;'>", [["Share Album", function() { album.setPublic(album.getID(), e) }], ["Cancel", function() {}]], -170);

			$(".message .choice input[name='password']").on("change", function() {

				if ($(this).prop('checked')===true) $(".message .choice input.text").show();
				else $(".message .choice input.text").hide();

			});

			return true;

		}

		if (visible.message()) {

			if ($(".message .choice input[name='password']:checked").val()==="password") {
				password = md5($(".message input.text").val());
				album.json.password = 1;
			} else {
				password = "";
				album.json.password = 0;
			}

			if ($(".message .choice input[name='listed']:checked").val()==="listed") listed = true;
			if ($(".message .choice input[name='downloadable']:checked").val()==="downloadable") downloadable = true;

		}

		params = "setAlbumPublic&albumID=" + albumID + "&password=" + password + "&visible=" + listed + "&downloadable=" + downloadable;

		if (visible.album()) {

			album.json.public = (album.json.public==0) ? 1 : 0;
			album.json.password = (album.json.public==0) ? 0 : album.json.password;

			view.album.public();
			view.album.password();

			if (album.json.public==1) contextMenu.shareAlbum(albumID, e);

		}

		lychee.api(params, function(data) {

			if (data!==true) lychee.error(null, params, data);

		});

	},

	share: function(service) {

		var link = "",
			url = location.href;

		switch (service) {
			case 0:
				link = "https://twitter.com/share?url=" + encodeURI(url);
				break;
			case 1:
				link = "http://www.facebook.com/sharer.php?u=" + encodeURI(url) + "&t=" + encodeURI(album.json.title);
				break;
			case 2:
				link = "mailto:?subject=" + encodeURI(album.json.title) + "&body=" + encodeURI(url);
				break;
			default:
				link = "";
				break;
		}

		if (link.length>5) location.href = link;

	},

	getArchive: function(albumID) {

		var link,
			url = "php/api.php?function=getAlbumArchive&albumID=" + albumID;

		if (location.href.indexOf("index.html")>0) link = location.href.replace(location.hash, "").replace("index.html", url);
		else link = location.href.replace(location.hash, "") + url;

		if (lychee.publicMode) link += "&password=" + password.value;

		location.href = link;

	}

};