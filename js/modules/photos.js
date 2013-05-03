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

		if (!refresh) {
			loadingBar.show();
			if (visible.imageview()) photos.hideView();
			lychee.animate(".album, .photo", "contentZoomOut");
			lychee.animate(".divider", "fadeOut");
		}

		startTime = new Date().getTime();

		params = "getPhotos&albumID=" + albumID;
		lychee.api(params, "json", function(data) {

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

					albums.loadInfo(albumID);

				}

			});

		});

	},

	loadInfo: function(photoID) {

		photos.showView();

		loadingBar.show();

		params = "getPhotoInfo&photoID=" + photoID;
		lychee.api(params, "json", function(data) {

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
				$("#button_share").attr("title", "Make Photo Private");
			} else {
				$("#button_share a").removeClass("active");
				$("#button_share").attr("title", "Share Photo");
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

			loadingBar.hide();

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

		loadingBar.show();

		params = "deletePhoto&photoID=" + photoID;
		lychee.api(params, "text", function(data) {

			if (data) {

				photos.hide(photoID);
				lychee.goto("a" + lychee.content.attr("data-id"));
				loadingBar.hide();

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

	rename: function(photoID) {

		if (!photoID) oldTitle = lychee.title(); else oldTitle = "";
		if (!photoID) photoID = lychee.image_view.attr("data-id");

		newTitle = prompt("Please enter a new title for this photo:", oldTitle);

		if (photoID!=null&&photoID&&newTitle.length<31) {

			loadingBar.show();

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
					loadingBar.hide();
				} else loadingBar.show("error");

			});

		} else if (newTitle.length>0) loadingBar.show("error", "Error", "New title to short or too long. Please try another one!");

	},

	move: function(photoID, albumID) {

		if (albumID>=0) {

			loadingBar.show();

			params = "movePhoto&photoID=" + photoID + "&albumID=" + albumID;
			lychee.api(params, "text", function(data) {

				if (data) {
					photos.hide(photoID);
					lychee.goto("a" + lychee.content.attr("data-id"));
					loadingBar.hide();
				} else loadingBar.show("error");

			});

		}

	},

	setStar: function() {

		loadingBar.show();

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
				loadingBar.hide();

			} else loadingBar.show("error");

		});

	},

	setPublic: function(e) {

		loadingBar.show();

		photoID = lychee.image_view.attr("data-id");

		params = "setPhotoPublic&photoID=" + photoID + "&url=" + photos.getViewLink(photoID);
		lychee.api(params, "text", function(data) {

			if (data) {

				if ($("#button_share a.active").length) {
					$("#button_share a").removeClass("active");
					$("#button_share").attr("title", "Make Private");
				} else {
					$("#button_share a").addClass("active");
					$("#button_share").attr("title", "Share Photo");
					contextMenu.share(photoID, e.pageX, e.pageY);
				}

				photos.load(lychee.content.attr("data-id"), true);
				loadingBar.hide();

			} else loadingBar.show("error");

		});

	},

	setDescription: function() {

		description = prompt("Please enter a description for this photo:", "");
		photoID = lychee.image_view.attr("data-id");

		if (description.length>0&&description.length<160) {

			loadingBar.show();

			params = "setPhotoDescription&photoID=" + photoID + "&description=" + escape(description);
			lychee.api(params, "text", function(data) {

				if (data) photos.loadInfo(photoID);
				else loadingBar.show("error");

			});

		} else if (description.length>0) loadingBar.show("error", "Error", "Description to short or too long. Please try another one!");

	},

	share: function(service, photoID) {

		loadingBar.show();

		params = "sharePhoto&photoID=" + photoID + "&url=" + photos.getViewLink(photoID);
		lychee.api(params, "json", function(data) {

			switch (service) {
				case 0:
					link = data.twitter;
					break;
				case 1:
					link = data.facebook;
					break;
				case 2:
					link = data.mail;
					break;
				case 3:
					link = "copy";
					modal = build.modal("Copy Link", "You can use this link to share your image with other people: <input class='copylink' value='" + photos.getViewLink(photoID) + "'>", ["Close"], [""]);
					$("body").append(modal);
					$(".copylink").focus();
					break;
				case 4:
					link = "copy";
					modal = build.modal("Copy Shortlink", "You can use this link to share your image with other people: <input class='copylink' value='" + data.shortlink + "'>", ["Close"], [""]);
					$("body").append(modal);
					$(".copylink").focus();
					break;
				default:
					link = "";
					break;
			}

			if (link=="copy") loadingBar.hide();
			else if (link.length>5) {
				location.href = link;
				loadingBar.hide();
			} else loadingBar.show("error");

		});

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