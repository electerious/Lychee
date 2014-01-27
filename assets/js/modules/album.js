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
				lychee.animate(".album, .photo", "contentZoomOut");
				lychee.animate(".divider", "fadeOut");
			}

			startTime = new Date().getTime();

			params = "getAlbum&albumID=" + albumID + "&password=" + password.value;
			lychee.api(params, function(data) {

				if (data==="Warning: Album private!") {
					lychee.setMode("view");
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
						lychee.animate(".album, .photo", "contentZoomIn");
						view.header.mode("album");
					}

				}, waitTime);

			});

		});

	},

	parse: function(photo) {

		if (photo&&photo.thumbUrl) photo.thumbUrl = lychee.upload_path_thumb + photo.thumbUrl;
		else if (!album.json.title) album.json.title = "Untitled";

	},

	add: function() {

		var title,
			params,
			buttons;

		buttons = [
			["Create Album", function() {

				title = $(".message input.text").val();

				if (title==="") title = "Untitled";

				if (title.length>0&&title.length<31) {

					modal.close();

					params = "addAlbum&title=" + escape(encodeURI(title));
					lychee.api(params, function(data) {

						if (data!==false) {
							if (data===true) data = 1; // Avoid first album to be true
							lychee.goto(data);
						} else lychee.error(null, params, data);

					});

				} else loadingBar.show("error", "Title too short or too long. Please try again!");

			}],
			["Cancel", function() {}]
		];
		modal.show("New Album", "Please enter a title for this album: <input class='text' type='text' placeholder='Title' value='Untitled'>", buttons);

	},

	delete: function(albumID) {

		var params,
			buttons,
			albumTitle;

		buttons = [
			["Delete Album and Photos", function() {

				params = "deleteAlbum&albumID=" + albumID;
				lychee.api(params, function(data) {

					if (visible.albums()) {
						albums.json.num--;
						view.albums.content.delete(albumID);
					} else lychee.goto("");

					if (data!==true) lychee.error(null, params, data);

				});

			}],
			["Keep Album", function() {}]
		];

		if (albumID==="0") {

			buttons[0][0] = "Clear Unsorted";
			modal.show("Clear Unsorted", "Are you sure you want to delete all photos from 'Unsorted'?<br>This action can't be undone!", buttons)

		} else {

			if (album.json) albumTitle = album.json.title;
			else if (albums.json) albumTitle = albums.json.content[albumID].title;
			modal.show("Delete Album", "Are you sure you want to delete the album '" + albumTitle + "' and all of the photos it contains? This action can't be undone!", buttons);

		}

	},

	setTitle: function(albumID) {

		var oldTitle = "",
			newTitle,
			params,
			buttons;

		if (!albumID) return false;
		if (album.json) oldTitle = album.json.title;
		else if (albums.json) oldTitle = albums.json.content[albumID].title;

		buttons = [
			["Set Title", function() {

				newTitle = $(".message input.text").val();

				if (newTitle==="") newTitle = "Untitled";

				if (albumID!==""&&albumID!=null&&albumID&&newTitle.length<31) {

					if (visible.album()) {

						album.json.title = newTitle;
						view.album.title(oldTitle);

					} else if (visible.albums()) {

						albums.json.content[albumID].title = newTitle;
						view.albums.content.title(albumID);

					}

					params = "setAlbumTitle&albumID=" + albumID + "&title=" + escape(encodeURI(newTitle));
					lychee.api(params, function(data) {

						if (data!==true) lychee.error(null, params, data);

					});

				} else if (newTitle.length>0) loadingBar.show("error", "New title too short or too long. Please try again!");

			}],
			["Cancel", function() {}]
		];
		modal.show("Set Title", "Please enter a new title for this album: <input class='text' type='text' placeholder='Title' value='" + oldTitle + "'>", buttons);

	},

	setDescription: function(photoID) {

		var oldDescription = album.json.description,
			description,
			params,
			buttons;

		buttons = [
			["Set Description", function() {

				description = $(".message input.text").val();

				if (description.length<800) {

					if (visible.album()) {
						album.json.description = description;
						view.album.description();
					}

					params = "setAlbumDescription&albumID=" + photoID + "&description=" + escape(description);
					lychee.api(params, function(data) {

						if (data!==true) lychee.error(null, params, data);

					});

				} else loadingBar.show("error", "Description too long. Please try again!");

			}],
			["Cancel", function() {}]
		];
		modal.show("Set Description", "Please enter a description for this album: <input class='text' type='text' placeholder='Description' value='" + oldDescription + "'>", buttons);

	},

	setPublic: function(albumID, e) {

		var params;

		if ($(".message input.text").length>0&&$(".message input.text").val().length>0) {

			params = "setAlbumPublic&albumID=" + albumID + "&password=" + hex_md5($(".message input.text").val());
			album.json.password = true;

		} else {

			params = "setAlbumPublic&albumID=" + albumID;
			album.json.password = false;

		}

		if (visible.album()) {

			album.json.public = (album.json.public==0) ? 1 : 0;
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
				link = "mailto:?subject=" + encodeURI(album.json.title) + "&body=" + encodeURI("Hi! Check this out: " + url);
				break;
			default:
				link = "";
				break;
		}

		if (link.length>5) location.href = link;

	},

	getArchive: function(albumID) {

		var link;

		if (location.href.indexOf("index.html")>0) link = location.href.replace(location.hash, "").replace("index.html", "php/api.php?function=getAlbumArchive&albumID=" + albumID);
		else link = location.href.replace(location.hash, "") + "php/api.php?function=getAlbumArchive&albumID=" + albumID;

		if (lychee.publicMode) link += "&password=" + password.value;

		location.href = link;

	}

}