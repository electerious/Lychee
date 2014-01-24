/**
 * @name		Photo Module
 * @description	Takes care of every action a photo can handle and execute.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
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
		lychee.api(params, function(data) {

			if (data==="Warning: Wrong password!") {
				checkPasswd = function() {
					if (password.value!=="") photo.load(photoID, albumID);
					else setTimeout(checkPasswd, 250);
				}
				checkPasswd();
				return false;
			}

			photo.json = data;
			if (!visible.photo()) view.photo.show();
			view.photo.init();

			lychee.imageview.show();
			setTimeout(function() { lychee.content.show() }, 300);

		});

	},

	parse: function() {

		if (!photo.json.title) photo.json.title = "Untitled";
		photo.json.url = lychee.upload_path_big + photo.json.url;

	},

	delete: function(photoID) {

		var params,
			buttons,
			photoTitle;

		if (!photoID) return false;

		if (visible.photo()) photoTitle = photo.json.title;
		else photoTitle = album.json.content[photoID].title;
		if (photoTitle=="") photoTitle = "Untitled";

		buttons = [
			["Delete Photo", function() {

				// Change reference for the next and previous photo
				if (album.json.content[photoID].nextPhoto!==""||album.json.content[photoID].previousPhoto!=="") {

					nextPhoto = album.json.content[photoID].nextPhoto;
					previousPhoto = album.json.content[photoID].previousPhoto;

					album.json.content[previousPhoto].nextPhoto = nextPhoto;
					album.json.content[nextPhoto].previousPhoto = previousPhoto;

				}

				album.json.content[photoID] = null;

				view.album.content.delete(photoID);

				// Only when search is not active
				if (!visible.albums()) lychee.goto(album.getID());

				params = "deletePhoto&photoID=" + photoID;
				lychee.api(params, function(data) {

					if (data!==true) lychee.error(null, params, data);

				});

			}],
			["Keep Photo", function() {}]
		];
		modal.show("Delete Photo", "Are you sure you want to delete the photo '" + photoTitle + "'?<br>This action can't be undone!", buttons);

	},

	setTitle: function(photoID) {

		var oldTitle = "",
			newTitle,
			params,
			buttons;

		if (!photoID) return false;
		if (photo.json) oldTitle = photo.json.title;
		else if (album.json) oldTitle = album.json.content[photoID].title;

		buttons = [
			["Set Title", function() {

				newTitle = $(".message input.text").val();

				if (photoID!=null&&photoID&&newTitle.length<31) {

					if (visible.photo()) {
						photo.json.title = (newTitle==="") ? "Untitled" : newTitle;
						view.photo.title(oldTitle);
					}

					album.json.content[photoID].title = newTitle;
					view.album.content.title(photoID);

					params = "setPhotoTitle&photoID=" + photoID + "&title=" + escape(encodeURI(newTitle));
					lychee.api(params, function(data) {

						if (data!==true) lychee.error(null, params, data);

					});

				} else if (newTitle.length>0) loadingBar.show("error", "New title to short or too long. Please try another one!");

			}],
			["Cancel", function() {}]
		];
		modal.show("Set Title", "Please enter a new title for this photo: <input class='text' type='text' placeholder='Title' value='" + oldTitle + "'>", buttons);

	},

	setAlbum: function(albumID, photoID) {

		var params;

		if (albumID>=0) {

			// Change reference for the next and previous photo
			if (album.json.content[photoID].nextPhoto!==""||album.json.content[photoID].previousPhoto!=="") {

				nextPhoto = album.json.content[photoID].nextPhoto;
				previousPhoto = album.json.content[photoID].previousPhoto;

				album.json.content[previousPhoto].nextPhoto = nextPhoto;
				album.json.content[nextPhoto].previousPhoto = previousPhoto;

			}

			if (visible.photo) lychee.goto(album.getID());
			album.json.content[photoID] = null;
			view.album.content.delete(photoID);

			params = "setAlbum&photoID=" + photoID + "&albumID=" + albumID;
			lychee.api(params, function(data) {

				if (data!==true) lychee.error(null, params, data);

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
		lychee.api(params, function(data) {

			if (data!==true) lychee.error(null, params, data);

		});

	},

	setPublic: function(photoID, e) {

		var params;

		if (photo.json.public==2) {

			modal.show("Public Album", "This photo is located in a public album. To make this photo private or public, edit the visibility of the associated album.", [["Show Album", function() { lychee.goto(photo.json.original_album) }], ["Close", function() {}]]);
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
		lychee.api(params, function(data) {

			if (data!==true) lychee.error(null, params, data);

		});

	},

	setDescription: function(photoID) {

		var oldDescription = photo.json.description,
			description,
			params,
			buttons;

		buttons = [
			["Set Description", function() {

				description = $(".message input.text").val();

				if (description.length<800) {

					if (visible.photo()) {
						photo.json.description = description;
						view.photo.description();
					}

					params = "setPhotoDescription&photoID=" + photoID + "&description=" + escape(description);
					lychee.api(params, function(data) {

						if (data!==true) lychee.error(null, params, data);

					});

				} else loadingBar.show("error", "Description too long. Please try again!");

			}],
			["Cancel", function() {}]
		];
		modal.show("Set Description", "Please enter a description for this photo: <input class='text' type='text' placeholder='Description' value='" + oldDescription + "'>", buttons);

	},

	share: function(photoID, service) {

		var link = "",
			url = photo.getViewLink(photoID),
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

	getArchive: function(photoID) {

		var link;

		if (location.href.indexOf("index.html")>0) link = location.href.replace(location.hash, "").replace("index.html", "php/api.php?function=getPhotoArchive&photoID=" + photoID);
		else link = location.href.replace(location.hash, "") + "php/api.php?function=getPhotoArchive&photoID=" + photoID;

		if (lychee.publicMode) link += "&password=" + password.value;

		location.href = link;

	},

	getDirectLink: function() {

		return $("#imageview #image").css("background-image").replace(/"/g,"").replace(/url\(|\)$/ig, "");

	},

	getViewLink: function(photoID) {

		if (location.href.indexOf("index.html")>0) return location.href.replace("index.html" + location.hash, "view.php?p=" + photoID);
		else return location.href.replace(location.hash, "view.php?p=" + photoID);

	}

}