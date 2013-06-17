/**
 * @name        photos.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Photos Module
 * Takes care of every action photos can handle and execute.
 */

photos = {

	load: function(albumID, refresh) {

		// If refresh is true the function will only refresh the content and not change the toolbar buttons either the title

		/*password = localStorage.getItem("album" + albumID);
		if (password==null) {
			 if (lychee.publicMode) password = prompt("Please enter a password for this album:", ""); else password = "";
			 if (password!="") password = hex_md5(password);
			 localStorage.setItem("album" + albumID, password);
		}*/

		password = "";

		if (!refresh) {
			loadingBar.show();
			if (visible.imageview()) photos.hideView();
			lychee.animate(".album, .photo", "contentZoomOut");
			lychee.animate(".divider", "fadeOut");
		}

		startTime = new Date().getTime();

		params = "getPhotos&albumID=" + albumID + "&password=" + password;
		lychee.api(params, "json", function(data) {

			if (data=="HTTP/1.1 403 Wrong password!") {
				localStorage.removeItem("album" + albumID);
				photos.load(albumID, refresh);
				return false;
			}

			durationTime = (new Date().getTime() - startTime);
			if (durationTime>300) waitTime = 0; else if (refresh) waitTime = 0; else waitTime = 300 - durationTime;

			$.timer(waitTime,function(){

				photosData = "";
				$.each(data, function() { photosData += build.photo(this); });
				lychee.content.html(photosData);

				if (!refresh) {

					lychee.animate(".album, .photo", "contentZoomIn");
					$("#tools_albums, #tools_photo").hide();
					$("#tools_album").show();
					$("img").retina();

					albums.loadInfo(albumID, password);

				}

			}, false);

		});

	},

	loadInfo: function(photoID, albumID) {

		/*password = localStorage.getItem("album" + albumID);
		if (password==null) {
			 if (lychee.publicMode) password = prompt("Please enter a password for this album:", ""); else password = "";
			 if (password!="") password = hex_md5(password);
			 localStorage.setItem("album" + albumID, password);
		}*/

		password = "";

		photos.showView();

		params = "getPhotoInfo&photoID=" + photoID + "&password=" + password;
		lychee.api(params, "json", function(data) {

			if (data=="HTTP/1.1 403 Wrong password!") {
				localStorage.removeItem("album" + albumID);
				photos.loadInfo(photoID, albumID);
				return false;
			}

			if (!data.title) data.title = "Untitled";

			document.title = "Lychee - " + data.title;
			lychee.headerTitle.html(data.title).addClass("editable");

			$("#button_star a").removeClass("icon-star-empty icon-star");
			if (data.star=="1") {
				$("#button_star a").addClass("icon-star");
				$("#button_star").attr("title", "Unstar Photo");
			} else {
				$("#button_star a").addClass("icon-star-empty");
				$("#button_star").attr("title", "Star Photo");
			}

			if (data.public=="1") {
				$("#button_share a").addClass("active");
				$("#button_share").attr("title", "Share Photo");
			} else {
				$("#button_share a").removeClass("active");
				$("#button_share").attr("title", "Make Public");
			}

			data.url = lychee.upload_path + data.url;

			if (visible.controls()&&photos.isSmall(data)) lychee.image_view.html("<a id='previous' class='icon-caret-left'></a><a id='next' class='icon-caret-right'></a><div id='image' class='small' style='background-image: url(" + data.url + "); width: " + data.width + "px; height: " + data.height + "px; margin-top: -" + parseInt(data.height/2-20) + "px; margin-left: -" + data.width/2 + "px;'></div>");
			else if (visible.controls()) lychee.image_view.html("<a id='previous' class='icon-caret-left'></a><a id='next' class='icon-caret-right'></a><div id='image' style='background-image: url(" + data.url + ")'></div>");
			else if (photos.isSmall(data)) lychee.image_view.html("<a id='previous' style='left: -50px' class='icon-caret-left'></a><a id='next' style='right: -50px' class='icon-caret-right'></a><div id='image' class='small' style='background-image: url(" + data.url + "); width: " + data.width + "px; height: " + data.height + "px; margin-top: -" + parseInt(data.height/2) + "px; margin-left: -" + data.width/2 + "px;'></div>");
			else lychee.image_view.html("<a id='previous' style='left: -50px' class='icon-caret-left'></a><a id='next' style='right: -50px' class='icon-caret-right'></a><div id='image' style='background-image: url(" + data.url + "); top: 0px; right: 0px; bottom: 0px; left: 0px;'></div>");

			lychee.animate(image_view, "fadeIn");
			lychee.image_view.show();

			if (!visible.controls()) lychee.hideControls();

			lychee.infobox.html(build.infobox(data)).show();

			$.timer(300,function(){ lychee.content.show(); });

		});

	},

	isSmall: function(photo) {

		size = [
			["width", false],
			["height", false]
		];

		if (photo.width<$(window).width()-60) size["width"] = true;
		if (photo.height<$(window).height()-100) size["height"] = true;

		if (size["width"]&&size["height"]) return true;
		else return false;

	},

	showView: function() {

		// Change toolbar-buttons
		$("#tools_albums, #tools_album").hide();
		$("#tools_photo").show();

		// Make body not scrollable
		$("body").css("overflow", "hidden");

	},

	hideView: function() {

		// Change toolbar-buttons
		$("#tools_photo, #tools_albums").hide();
		$("#tools_album").show();

		// Make body scrollable
		$("body").css("overflow", "scroll");

		// Change website title and url by using albums.loadInfo
		albums.loadInfo(lychee.content.attr("data-id"));

		// Hide ImageViewer
		lychee.animate(image_view, "fadeOut");
		$.timer(300,function(){ lychee.image_view.hide() });

	},

	showInfobox: function() {

		if (!visible.infobox()) $("body").append("<div id='infobox_overlay'></div>");
		lychee.infobox.css("right", "0px");

	},

	hideInfobox: function() {

		$("#infobox_overlay").remove();
		lychee.infobox.css("right", "-320px");

	},

	hide: function(photoID) {

		$(".photo[data-id='" + photoID + "']").css("opacity", 0).animate({
			width: 0,
			marginLeft: 0
		}, 300, function() {
			$(this).remove();
			if (!visible.imageview()) {
				imgNum = parseInt($("#title span").html().replace("- ", "").replace(" photos", ""))-1;
				$("#title span").html(" - " + imgNum + " photos");
			}
		});

	},

	delete: function(photoID) {

		params = "deletePhoto&photoID=" + photoID;
		lychee.api(params, "text", function(data) {

			if (data) {

				photos.hide(photoID);
				lychee.goto("a" + lychee.content.attr("data-id"));

			} else loadingBar.show("error");

		});

	},

	deleteDialog: function(photoID) {

		if (!photoID) photoID = lychee.image_view.attr("data-id");

		if (visible.imageview()) photoTitle = lychee.title();
		else photoTitle = $(".photo[data-id='" + photoID + "'] .overlay h1").html();
		if (photoTitle=="") photoTitle = "Untitled";

		f1 = "photos.delete(" + photoID + ");";
		f2 = "";
		modal = build.modal("Delete Photo", "Are you sure you want to delete the photo '" + photoTitle + "'?<br>This action can't be undone!", ["Delete Photo", "Keep Photo"], [f1, f2]);
		$("body").append(modal);

	},

	setTitle: function(photoID) {

		if (!photoID) oldTitle = lychee.title(); else oldTitle = "";
		if (!photoID) photoID = lychee.image_view.attr("data-id");

		newTitle = prompt("Please enter a new title for this photo:", oldTitle);

		if (photoID!=null&&photoID&&newTitle.length<31) {

			if (newTitle=="") newTitle = "Untitled";

			params = "setPhotoTitle&photoID=" + photoID + "&title=" + encodeURI(newTitle);
			lychee.api(params, "text", function(data) {

				if (data) {
					if (visible.imageview()) {
						$("#infobox .attr_name").html($("#infobox .attr_name").html().replace(lychee.title(), newTitle));
						lychee.headerTitle.html(newTitle);
						document.title = "Lychee - " + newTitle;
					}
					$(".photo[data-id='" + photoID + "'] .overlay h1").html(newTitle);
				} else loadingBar.show("error");

			});

		} else if (newTitle.length>0) loadingBar.show("error", "Error", "New title to short or too long. Please try another one!");

	},

	setAlbum: function(photoID, albumID) {

		if (albumID>=0) {

			params = "setAlbum&photoID=" + photoID + "&albumID=" + albumID;
			lychee.api(params, "text", function(data) {

				if (data) {
					photos.hide(photoID);
					lychee.goto("a" + lychee.content.attr("data-id"));
				} else loadingBar.show("error");

			});

		}

	},

	setStar: function() {

		photoID = lychee.image_view.attr("data-id");

		params = "setPhotoStar&photoID=" + photoID;
		lychee.api(params, "text", function(data) {

			if (data) {

				if ($("#button_star a.icon-star-empty").length) {
					$("#button_star a").removeClass("icon-star-empty icon-star").addClass("icon-star");
					$("#button_star").attr("title", "Unstar Photo");
				} else {
					$("#button_star a").removeClass("icon-star-empty icon-star").addClass("icon-star-empty");
					$("#button_star").attr("title", "Star Photo");
				}

				photos.load(lychee.content.attr("data-id"), true);

			} else loadingBar.show("error");

		});

	},

	setPublic: function(e) {

		photoID = lychee.image_view.attr("data-id");

		params = "setPhotoPublic&photoID=" + photoID + "&url=" + photos.getViewLink(photoID);
		lychee.api(params, "text", function(data) {

			if (data) {

				if ($("#button_share a.active").length) {
					$("#button_share a").removeClass("active");
					$("#button_share").attr("title", "Make Public");
					$("#infobox .attr_visibility").html("Private");
				} else {
					$("#button_share a").addClass("active");
					$("#button_share").attr("title", "Share Photo");
					$("#infobox .attr_visibility").html("Public");
					contextMenu.share(photoID, e.pageX, e.pageY);
				}

				photos.load(lychee.content.attr("data-id"), true);

			} else loadingBar.show("error");

		});

	},

	setDescription: function() {

		description = prompt("Please enter a description for this photo:", "");
		photoID = lychee.image_view.attr("data-id");

		if (description.length>0&&description.length<160) {

			params = "setPhotoDescription&photoID=" + photoID + "&description=" + escape(description);
			lychee.api(params, "text", function(data) {

				if (data) {
					$("#infobox .attr_description").html(description + " <div id='edit_description'><a class='icon-pencil'></a></div>");
				} else loadingBar.show("error");

			});

		} else if (description.length>0) loadingBar.show("error", "Error", "Description to short or too long. Please try another one!");

	},

	share: function(service, photoID) {

		link = "";
		url = photos.getViewLink(photoID);

		switch (service) {
			case 0:
				link = "https://twitter.com/share?url=" + encodeURI(url);
				break;
			case 1:
				link = "http://www.facebook.com/sharer.php?u=" + encodeURI(url) + "&t=" + encodeURI(lychee.title());
				break;
			case 2:
				link = "mailto:?subject=" + encodeURI(lychee.title()) + "&body=" + encodeURI("Hi! Check this out: " + url);
				break;
			case 3:
				modal = build.modal("Copy Link", "Everyone can view your public photos, but only you can edit them. Use this link to share your photo with others: <input class='copylink' value='" + url + "'>", ["Close"], [""]);
				$("body").append(modal);
				$(".copylink").focus();
				break;
			case 4:
				params = "getShortlink&photoID=" + photoID;
				lychee.api(params, "text", function(data) {
					if (data=="") data = "Something went wrong!";
					modal = build.modal("Copy Shortlink", "Everyone can view your public photos, but only you can edit them. Use this link to share your photo with others: <input class='copylink' value='" + data + "'>", ["Close"], [""]);
					$("body").append(modal);
					$(".copylink").focus();
				});
				break;
			default:
				link = "";
				break;
		}

		if (link.length>5) location.href = link;

	},

	getViewLink: function(photoID) {

		if (location.href.indexOf("index.html")>0) return location.href.replace("index.html" + location.hash, "view.php?p=" + photoID);
		else return location.href.replace(location.hash, "view.php?p=" + photoID);

	},

	previous: function() {

		albumID = lychee.content.attr("data-id");
		photoID = lychee.image_view.attr("data-id");

		params = "previousPhoto&photoID=" + photoID + "&albumID=" + albumID;
		lychee.api(params, "json", function(data) {

			if (data!=false) lychee.goto("a" + albumID + "p" + data.id);

		});

	},

	next: function() {

		albumID = lychee.content.attr("data-id");
		photoID = lychee.image_view.attr("data-id");

		params = "nextPhoto&photoID=" + photoID + "&albumID=" + albumID;
		lychee.api(params, "json", function(data) {

			if (data) lychee.goto("a" + albumID + "p" + data.id);

		});

	}

}