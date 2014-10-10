/**
 * @name		UI View
 * @description	Responsible to reflect data changes to the UI.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

view = {

	header: {

		show: function() {

			var newMargin = -1*($("#imageview #image").height()/2)+20;

			clearTimeout($(window).data("timeout"));

			lychee.imageview.removeClass("full");
			lychee.header.removeClass("hidden");
			lychee.loadingBar.css("opacity", 1);

			if ($("#imageview #image.small").length>0) $("#imageview #image").css('margin-top', newMargin);
			else $("#imageview #image").removeClass('full');

		},

		hide: function(e, delay) {

			var newMargin = -1*($("#imageview #image").height()/2);

			if (delay===undefined) delay = 500;

			if (visible.photo()&&!visible.infobox()&&!visible.contextMenu()&&!visible.message()) {

				clearTimeout($(window).data("timeout"));

				$(window).data("timeout", setTimeout(function() {

					lychee.imageview.addClass("full");
					lychee.header.addClass("hidden");
					lychee.loadingBar.css("opacity", 0);

					if ($("#imageview #image.small").length>0) $("#imageview #image").css('margin-top', newMargin);
					else $("#imageview #image").addClass('full');

				}, delay));

			}

		},

		mode: function(mode) {

			var albumID = album.getID();

			switch (mode) {

				case "albums":

					lychee.header.removeClass("view");
					$("#tools_album, #tools_photo").hide();
					$("#tools_albums").show();

					break;

				case "album":

					lychee.header.removeClass("view");
					$("#tools_albums, #tools_photo").hide();
					$("#tools_album").show();

					album.json.content === false ? $("#button_archive").hide() : $("#button_archive").show();
					if (lychee.publicMode&&album.json.downloadable==="0") $("#button_archive").hide();
					if (albumID==="s"||albumID==="f"||albumID==="r") {
						$("#button_info_album, #button_trash_album, #button_share_album").hide();
					} else if (albumID==="0") {
						$("#button_info_album, #button_share_album").hide();
						$("#button_trash_album").show();
					} else {
						$("#button_info_album, #button_trash_album, #button_share_album").show();
					}

					break;

				case "photo":

					lychee.header.addClass("view");
					$("#tools_albums, #tools_album").hide();
					$("#tools_photo").show();

					break;

			}

		}

	},

	infobox: {

		show: function() {

			if (!visible.infobox()) $("body").append("<div id='infobox_overlay' class='fadeIn'></div>");
			lychee.infobox.addClass("active");

		},

		hide: function() {

			lychee.animate("#infobox_overlay", "fadeOut");
			setTimeout(function() { $("#infobox_overlay").remove() }, 300);
			lychee.infobox.removeClass("active");

		}

	},

	albums: {

		init: function() {

			view.albums.title();
			view.albums.content.init();

		},

		title: function() {

			lychee.setTitle("Albums", false);

		},

		content: {

			scrollPosition: 0,

			init: function() {

				var smartData = "",
					albumsData = "";

				/* Smart Albums */
				albums.parse(albums.json.unsortedAlbum);
				albums.parse(albums.json.publicAlbum);
				albums.parse(albums.json.starredAlbum);
				albums.parse(albums.json.recentAlbum);
				if (!lychee.publicMode) smartData = build.divider("Smart Albums") + build.album(albums.json.unsortedAlbum) + build.album(albums.json.starredAlbum) + build.album(albums.json.publicAlbum) + build.album(albums.json.recentAlbum);

				/* Albums */
				if (albums.json.content) {

					$.each(albums.json.content, function() {
						albums.parse(this);

						//display albums in reverse order
						albumsData = build.album(this) + albumsData;
					});

					if (!lychee.publicMode) albumsData = build.divider("Albums") + albumsData;

				}

				if (smartData===""&&albumsData==="") {
					lychee.content.html('');
					$("body").append(build.no_content("share"));
				} else {
					lychee.content.html(smartData + albumsData);
				}

				$("img[data-type!='nonretina']").retina();

				/* Restore scroll position */
				if (view.albums.content.scrollPosition!==null) {
					$("html, body").scrollTop(view.albums.content.scrollPosition);
				}

			},

			title: function(albumID) {

				var prefix = "",
					longTitle = "",
					title = albums.json.content[albumID].title;

				if (albums.json.content[albumID].password) prefix = "<span class='icon-lock'></span> ";
				if (title!==null&&title.length>18) {
					longTitle = title;
					title = title.substr(0, 18) + "...";
				}

				$(".album[data-id='" + albumID + "'] .overlay h1")
					.html(prefix + title)
					.attr("title", longTitle);

			},

			delete: function(albumID) {

				$(".album[data-id='" + albumID + "']").css("opacity", 0).animate({
					width: 0,
					marginLeft: 0
				}, 300, function() {
					$(this).remove();
					if (albums.json.num<=0) lychee.animate(".divider:last-of-type", "fadeOut");
				});

			}

		}

	},

	album: {

		init: function() {

			album.parse();

			view.album.infobox();
			view.album.title();
			view.album.public();
			view.album.content.init();

			album.json.init = 1;

		},

		hide: function() {

			view.infobox.hide();

		},

		title: function() {

			if ((visible.album()||!album.json.init)&&!visible.photo()) {

				switch (album.getID()) {
					case "f":
						lychee.setTitle("Starred", false);
						break;
					case "s":
						lychee.setTitle("Public", false);
						break;
					case "r":
						lychee.setTitle("Recent", false);
						break;
					case "0":
						lychee.setTitle("Unsorted", false);
						break;
					default:
						if (album.json.init) $("#infobox .attr_title").html(album.json.title + " " + build.editIcon("edit_title_album"));
						lychee.setTitle(album.json.title, true);
						break;
				}

			}

		},

		content: {

			init: function() {

				var photosData = "";

				$.each(album.json.content, function() {
					photosData += build.photo(this);
				});
				lychee.content.html(photosData);

				$("img[data-type!='svg']").retina();

				/* Save and reset scroll position */
				view.albums.content.scrollPosition = $(document).scrollTop();
				$("html, body").scrollTop(0);

			},

			title: function(photoID) {

				var longTitle = "",
					title = album.json.content[photoID].title;

				if (title!==null&&title.length>18) {
					longTitle = title;
					title = title.substr(0, 18) + "...";
				}

				$(".photo[data-id='" + photoID + "'] .overlay h1")
					.html(title)
					.attr("title", longTitle);

			},

			star: function(photoID) {

				$(".photo[data-id='" + photoID + "'] .icon-star").remove();
				if (album.json.content[photoID].star==1) $(".photo[data-id='" + photoID + "']").append("<a class='badge red icon-star'></a>");

			},

			public: function(photoID) {

				$(".photo[data-id='" + photoID + "'] .icon-share").remove();
				if (album.json.content[photoID].public==1) $(".photo[data-id='" + photoID + "']").append("<a class='badge red icon-share'></a>");

			},

			delete: function(photoID) {

				$(".photo[data-id='" + photoID + "']").css("opacity", 0).animate({
					width: 0,
					marginLeft: 0
				}, 300, function() {
					$(this).remove();
					// Only when search is not active
					if (!visible.albums()) {
						album.json.num--;
						view.album.num();
						view.album.title();
					}
				});

			}

		},

		description: function() {

			$("#infobox .attr_description").html(album.json.description + " " + build.editIcon("edit_description_album"));

		},

		num: function() {

			$("#infobox .attr_images").html(album.json.num);

		},

		public: function() {

			if (album.json.public==1) {
				$("#button_share_album a").addClass("active");
				$("#button_share_album").attr("title", "Share Album");
				$(".photo .icon-share").remove();
				if (album.json.init) $("#infobox .attr_visibility").html("Public");
			} else {
				$("#button_share_album a").removeClass("active");
				$("#button_share_album").attr("title", "Make Public");
				if (album.json.init) $("#infobox .attr_visibility").html("Private");
			}

		},

		password: function() {

			if (album.json.password==1) $("#infobox .attr_password").html("Yes");
			else $("#infobox .attr_password").html("No");

		},

		infobox: function() {

			if ((visible.album()||!album.json.init)&&!visible.photo()) lychee.infobox.html(build.infoboxAlbum(album.json)).show();

		}

	},

	photo: {

		init: function() {

			photo.parse();

			view.photo.infobox();
			view.photo.title();
			view.photo.star();
			view.photo.public();
			view.photo.photo();

			photo.json.init = 1;

		},

		show: function() {

			// Change header
			lychee.content.addClass("view");
			view.header.mode("photo");

			// Make body not scrollable
			$("body").css("overflow", "hidden");

			// Fullscreen
			$(document)
				.bind("mouseenter", view.header.show)
				.bind("mouseleave", view.header.hide);

			lychee.animate(lychee.imageview, "fadeIn");

		},

		hide: function() {

			view.header.show();
			if (visible.infobox) view.infobox.hide();

			lychee.content.removeClass("view");
			view.header.mode("album");

			// Make body scrollable
			$("body").css("overflow", "auto");

			// Disable Fullscreen
			$(document)
				.unbind("mouseenter")
				.unbind("mouseleave");

			// Hide Photo
			lychee.animate(lychee.imageview, "fadeOut");
			setTimeout(function() {
				lychee.imageview.hide();
				view.album.infobox();
			}, 300);

		},

		title: function() {

			if (photo.json.init) $("#infobox .attr_title").html(photo.json.title + " " + build.editIcon("edit_title"));
			lychee.setTitle(photo.json.title, true);

		},

		description: function() {

			if (photo.json.init) $("#infobox .attr_description").html(photo.json.description + " " + build.editIcon("edit_description"));

		},

		star: function() {

			$("#button_star a").removeClass("icon-star-empty icon-star");
			if (photo.json.star==1) {
				// Starred
				$("#button_star a").addClass("icon-star");
				$("#button_star").attr("title", "Unstar Photo");
			} else {
				// Unstarred
				$("#button_star a").addClass("icon-star-empty");
				$("#button_star").attr("title", "Star Photo");
			}

		},

		public: function() {

			if (photo.json.public==1||photo.json.public==2) {
				// Photo public
				$("#button_share a").addClass("active");
				$("#button_share").attr("title", "Share Photo");
				if (photo.json.init) $("#infobox .attr_visibility").html("Public");
			} else {
				// Photo private
				$("#button_share a").removeClass("active");
				$("#button_share").attr("title", "Make Public");
				if (photo.json.init) $("#infobox .attr_visibility").html("Private");
			}

		},

		tags: function() {

			$("#infobox #tags").html(build.tags(photo.json.tags));

		},

		photo: function() {

			lychee.imageview.html(build.imageview(photo.json, photo.isSmall(), visible.controls()));

			if ((album.json&&album.json.content&&album.json.content[photo.getID()]&&album.json.content[photo.getID()].nextPhoto==="")||lychee.viewMode) $("a#next").hide();
			if ((album.json&&album.json.content&&album.json.content[photo.getID()]&&album.json.content[photo.getID()].previousPhoto==="")||lychee.viewMode) $("a#previous").hide();

		},

		infobox: function() {

			lychee.infobox.html(build.infoboxPhoto(photo.json)).show();

		}

	}

};