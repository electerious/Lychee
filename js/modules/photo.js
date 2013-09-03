/**
 * @name        photo.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Photo Module
 * Takes care of every action a photo can handle and execute.
 */

photo = {

	json: null,

	getID: function() {

		var id;

		if (photo.json) id = photo.json.id;
		else id = $(".photo:hover, .photo.active").attr("data-id");

		if (id) return id;
		else return false;

	},

	load: function(photoID, albumID) {

		var params,
			checkPasswd;

		params = "getPhoto&photoID=" + photoID + "&albumID=" + albumID + "&password=" + password.value;
		lychee.api(params, "json", function(data) {

			if (data=="HTTP/1.1 403 Wrong password!") {
				checkPasswd = function() {
					if (password.value!="") photo.load(photoID, albumID);
					else setTimeout(checkPasswd, 250);
				}
				checkPasswd();
				return false;
			}

			photo.json = data;
			view.photo.init();

			lychee.imageview.show();
			$.timer(300, function() { lychee.content.show(); });

		});

	},

	parse: function() {

		if (!photo.json.title) photo.json.title = "Untitled";
		photo.json.url = lychee.upload_path_big + photo.json.url;

	},

	add: {

		files: function(files) {

			var pre_progress = 0,
				formData = new FormData(),
				xhr = new XMLHttpRequest(),
				popup,
				progress;

			$(".upload_overlay").remove();
			$("body").append(build.uploadModal());

			window.onbeforeunload = function() { return "Lychee is currently uploading!"; };

		    for (var i = 0; i < files.length; i++) formData.append(i, files[i]);

		    formData.append("function", "upload");

		    if (album.getID()=="") formData.append("albumID", 0);
		    else formData.append("albumID", album.getID());

		    xhr.open('POST', lychee.api_path);
		    xhr.onload = function() {

		    	if (xhr.status===200) {

		    		$(".progressbar div").css("width", "100%");
					$(".upload_overlay").removeClass("fadeIn").css("opacity", 0);
					$.timer(300, function() { $(".upload_overlay").remove() });

					if (window.webkitNotifications&&BrowserDetect.browser=="Safari") {
						popup = window.webkitNotifications.createNotification("", "Upload complete", "You can now manage your new photo.");
						popup.show();
					}

					window.onbeforeunload = null;

					if (album.getID()=="") lychee.goto("a0");
					else album.load(album.getID());

		    	}

		    };

		    xhr.upload.onprogress = function(event) {

		    	if (event.lengthComputable) {

		    		progress = (event.loaded / event.total * 100 | 0);

		    		if (progress>pre_progress) {
		    			$(".progressbar div").css("width", progress + "%");
		    			pre_progress = progress;
		    		}

		    		if (progress>=100) $(".progressbar div").css("opacity", 0.2);

		    	}

		    };

		    $("#upload_files").val("");

		    xhr.send(formData);

		},

		url: function(link) {

			var albumID = album.getID();

			if (!link) link = prompt("Please enter the direct link to a photo to import it:", "");
			if (album.getID()=="") albumID = 0;

			if (link&&link.length>3) {

				modal.close();

				$(".upload_overlay").remove();
				$("body").append(build.uploadModal());
				$(".progressbar div").css({
					"opacity": 0.2,
					"width": "100%"
				});

				params = "importUrl&url=" + escape(link) + "&albumID=" + albumID;
				lychee.api(params, "text", function(data) {

					$(".upload_overlay").removeClass("fadeIn").css("opacity", 0);
					$.timer(300, function() { $(".upload_overlay").remove() });

					if (data) {
						if (album.getID()=="") lychee.goto("a0");
						else album.load(album.getID());
					} else loadingBar.show("error");

				});

			} else if (link.length>0) loadingBar.show("error", "Error", "Link to short or too long. Please try another one!");

		},

		dropbox: function() {

			lychee.loadDropbox(function() {
				Dropbox.choose({
					linkType: "direct",
					multiselect: false,
					success: function(files) { photo.add.url(files[0].link) }
				});
			});

		}

	},

	delete: function(photoID) {

		var params,
			buttons,
			photoTitle;

		if (!photoID) photoID = photo.getID();

		if (visible.photo()) photoTitle = photo.json.title;
		else photoTitle = album.json.content[photoID].title;
		if (photoTitle=="") photoTitle = "Untitled";

		buttons = [
			["Delete Photo", function() {

				album.json.content[photoID] = null;
				view.album.content.delete(photoID);

				// Only when search is not active
				if (!visible.albums()) lychee.goto("a" + album.getID());

				params = "deletePhoto&photoID=" + photoID;
				lychee.api(params, "text", function(data) {

					if (!data) loadingBar.show("error");

				});

			}],
			["Keep Photo", function() {}]
		];
		modal.show("Delete Photo", "Are you sure you want to delete the photo '" + photoTitle + "'?<br>This action can't be undone!", buttons);

	},

	setTitle: function(photoID) {

		var oldTitle = "",
			newTitle,
			params;

		if (!photoID) photoID = photo.getID();
		if (photo.json) oldTitle = photo.json.title;
		else if (album.json) oldTitle = album.json.content[photoID].title;

		newTitle = prompt("Please enter a new title for this photo:", oldTitle);

		if (photoID!=null&&photoID&&newTitle.length<31) {

			if (visible.photo()) {
				photo.json.title = (newTitle=="") ? "Untitled" : newTitle;
				view.photo.title(oldTitle);
			}

			album.json.content[photoID].title = newTitle;
			view.album.content.title(photoID);

			params = "setPhotoTitle&photoID=" + photoID + "&title=" + escape(encodeURI(newTitle));
			lychee.api(params, "text", function(data) {

				if (!data) loadingBar.show("error");

			});

		} else if (newTitle.length>0) loadingBar.show("error", "Error", "New title to short or too long. Please try another one!");

	},

	setAlbum: function(albumID, photoID) {

		var params;

		if (albumID>=0) {

			if (visible.photo) lychee.goto("a" + album.getID());
			album.json.content[photoID] = null;
			view.album.content.delete(photoID);

			params = "setAlbum&photoID=" + photoID + "&albumID=" + albumID;
			lychee.api(params, "text", function(data) {

				if (!data) loadingBar.show("error");

			});

		}

	},

	setStar: function(photoID) {

		var params;

		if (visible.photo()) {
			photo.json.star = (photo.json.star==0) ? 1 : 0;
			view.photo.star();
		}

		album.json.content[photoID].star = (album.json.content[photoID].star==0) ? 1 : 0;
		view.album.content.star(photoID);

		params = "setPhotoStar&photoID=" + photoID;
		lychee.api(params, "text", function(data) {

			if (!data) loadingBar.show("error");

		});

	},

	setPublic: function(photoID, e) {

		var params;

		if (photo.json.public==2) {

			modal.show("Public Album", "This photo is located in a public album. To make this photo private or public, edit the visibility of the associated album.", [["Show Album", function() { lychee.goto("a" + photo.json.original_album) }], ["Close", function() {}]]);
			return false;

		}

		if (visible.photo()) {

			photo.json.public = (photo.json.public==0) ? 1 : 0;
			view.photo.public();
			if (photo.json.public==1) contextMenu.sharePhoto(photoID, e);

		}

		album.json.content[photoID].public = (album.json.content[photoID].public==0) ? 1 : 0;
		view.album.content.public(photoID);

		params = "setPhotoPublic&photoID=" + photoID + "&url=" + photo.getViewLink(photoID);
		lychee.api(params, "text", function(data) {

			if (!data) loadingBar.show("error");

		});

	},

	setDescription: function(photoID) {

		var oldDescription = photo.json.description,
			description = prompt("Please enter a description for this photo:", oldDescription),
			params;

		if (description.length>0&&description.length<160) {

			if (visible.photo()) {
				photo.json.description = description;
				view.photo.description(oldDescription);
			}

			params = "setPhotoDescription&photoID=" + photoID + "&description=" + escape(description);
			lychee.api(params, "text", function(data) {

				if (!data) loadingBar.show("error");

			});

		} else if (description.length>0) loadingBar.show("error", "Error", "Description to short or too long. Please try another one!");

	},

	share: function(photoID, service) {

		var link = "",
			url = photo.getViewLink(photoID),
			params,
			filename = "unknown";

		switch (service) {
			case 0:
				link = "https://twitter.com/share?url=" + encodeURI(url);
				break;
			case 1:
				link = "http://www.facebook.com/sharer.php?u=" + encodeURI(url) + "&t=" + encodeURI(photo.json.title);
				break;
			case 2:
				link = "mailto:?subject=" + encodeURI(photo.json.title) + "&body=" + encodeURI(url);
				break;
			case 3:
				lychee.loadDropbox(function() {
					filename = photo.json.title + "." + photo.getDirectLink().split('.').pop();
					Dropbox.save(photo.getDirectLink(), filename);
				});
				break;
			default:
				link = "";
				break;
		}

		if (link.length>5) location.href = link;

	},

	isSmall: function() {

		var size = [
			["width", false],
			["height", false]
		];

		if (photo.json.width<$(window).width()-60) size["width"] = true;
		if (photo.json.height<$(window).height()-100) size["height"] = true;

		if (size["width"]&&size["height"]) return true;
		else return false;

	},

	getDirectLink: function() {

		return $("#imageview #image").css("background-image").replace(/"/g,"").replace(/url\(|\)$/ig, "");

	},

	getViewLink: function(photoID) {

		if (location.href.indexOf("index.html")>0) return location.href.replace("index.html" + location.hash, "view.php?p=" + photoID);
		else return location.href.replace(location.hash, "view.php?p=" + photoID);

	}

}