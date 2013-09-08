/**
 * @name        album.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Album Module
 * Takes care of every action an album can handle and execute.
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
			waitTime,
			photosData = "";

		password.get(albumID, function() {

			if (!refresh) {
				loadingBar.show();
				lychee.animate(".album, .photo", "contentZoomOut");
				lychee.animate(".divider", "fadeOut");
			}

			startTime = new Date().getTime();

			params = "getAlbum&albumID=" + albumID + "&password=" + password.value;
			lychee.api(params, "json", function(data) {

				if (data=="HTTP/1.1 403 Album private!") {
					lychee.setMode("view");
					return false;
				}

				if (data=="HTTP/1.1 403 Wrong password!") {
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

		var title = prompt("Please enter a title for this album:", "Untitled"),
			params;

		if (title.length>0&&title.length<31) {

			modal.close();

			params = "addAlbum&title=" + escape(encodeURI(title));
			lychee.api(params, "text", function(data) {

				if (data) lychee.goto("a" + data);
				else loadingBar.show("error");

			});

		} else if (title.length>0) loadingBar.show("error", "Error", "Title to short or too long. Please try another one!");

	},

	delete: function(albumID) {

		var params,
			buttons,
			albumTitle;

		buttons = [
			["Delete Album and Photos", function() {

				params = "deleteAlbum&albumID=" + albumID + "&delAll=true";
				lychee.api(params, "text", function(data) {

					if (visible.albums()) view.albums.content.delete(albumID);
					else lychee.goto("");

					if (!data) loadingBar.show("error");

				});

			}],
			["Keep Album", function() {}]
		];

		if (albumID==0) {

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
			params;

		if (!albumID) albumID = album.getID();
		if (album.json) oldTitle = album.json.title;
		else if (albums.json) oldTitle = albums.json.content[albumID].title;

		newTitle = prompt("Please enter a new title for this album:", oldTitle);

		if (albumID!=""&&albumID!=null&&albumID&&newTitle.length>0&&newTitle.length<31) {

			if (visible.album()) {

				album.json.title = newTitle;
				view.album.title();

			} else if (visible.albums()) {

				albums.json.content[albumID].title = newTitle;
				view.albums.content.title(albumID);

			}

			params = "setAlbumTitle&albumID=" + albumID + "&title=" + escape(encodeURI(newTitle));
			lychee.api(params, "text", function(data) {

				if (!data) loadingBar.show("error");

			});

		} else if (newTitle.length>0) loadingBar.show("error", "Error", "New title to short or too long. Please try another one!");

	},

	setPublic: function(albumID, e) {

		var params;
		
		if ($("input.password").length>0&&$("input.password").val().length>0) {
		
			params = "setAlbumPublic&albumID=" + albumID + "&password=" + hex_md5($("input.password").val());
			album.json.password = true;
			
		} else {
		
			params = "setAlbumPublic&albumID=" + albumID;
			album.json.password = false;
			
		}

		if (visible.album()) {

			album.json.public = (album.json.public==0) ? 1 : 0;
			view.album.public();
			if (album.json.public==1) contextMenu.shareAlbum(albumID, e);

		}
		
		lychee.api(params, "text", function(data) {

			if (!data) loadingBar.show("error");

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
		location.href = link;

	}

}