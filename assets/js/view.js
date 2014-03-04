/**
 * @name		UI View
 * @description	Responsible to reflect data changes to the UI.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

view = {

	header: {

		show: function() {

			clearTimeout($(window).data("timeout"));

			if (visible.photo()) {
				lychee.imageview.removeClass("full");
				lychee.loadingBar.css("opacity", 1);
				lychee.header.removeClass("hidden");
				if ($("#imageview #image.small").length>0) {
					$("#imageview #image").css({
						marginTop: -1*($("#imageview #image").height()/2)+20
					});
				} else {
					$("#imageview #image").css({
						top: 60,
						right: 30,
						bottom: 30,
						left: 30
					});
				}
			}

		},

		hide: function() {

			if (visible.photo()&&!visible.infobox()&&!visible.contextMenu()&&!visible.message()) {
				clearTimeout($(window).data("timeout"));
				$(window).data("timeout", setTimeout(function() {
					lychee.imageview.addClass("full");
					lychee.loadingBar.css("opacity", 0);
					lychee.header.addClass("hidden");
					if ($("#imageview #image.small").length>0) {
						$("#imageview #image").css({
							marginTop: -1*($("#imageview #image").height()/2)
						});
					} else {
						$("#imageview #image").css({
							top: 0,
							right: 0,
							bottom: 0,
							left: 0
						});
					}
				}, 500));
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
					if (albumID==="s"||albumID==="f") {
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

			init: function() {

				var smartData = "",
					albumsData = "";

				/*  Smart Albums */
				albums.parse(albums.json.unsortedAlbum);
				albums.parse(albums.json.publicAlbum);
				albums.parse(albums.json.starredAlbum);
				if (!lychee.publicMode) smartData = build.divider("Smart Albums") + build.album(albums.json.unsortedAlbum) + build.album(albums.json.starredAlbum) + build.album(albums.json.publicAlbum);

				/*  Albums */
				if (albums.json.content) {

					if (!lychee.publicMode) albumsData = build.divider("Albums");
					$.each(albums.json.content, function() {
						albums.parse(this);
						albumsData += build.album(this);
					});

				}

				if (smartData===""&&albumsData==="") $("body").append(build.no_content("picture"));
				else lychee.content.html(smartData + albumsData);

				$("img[data-type!='svg']").retina();

			},

			title: function(albumID) {

				var prefix = "",
					longTitle = "",
					title = albums.json.content[albumID].title;

				if (albums.json.content[albumID].password) prefix = "<span class='icon-lock'></span> ";
				if (title.length>18) {
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
					case "0":
						lychee.setTitle("Unsorted", false);
						break;
					default:
						if (album.json.init) $("#infobox .attr_name").html(album.json.title + " " + build.editIcon("edit_title_album"));
						lychee.setTitle(album.json.title, true);
						break;
				}

			}

		},

		description: function() {

			$("#infobox .attr_description").html(album.json.description + " " + build.editIcon("edit_description_album"));

		},

		content: {

			init: function() {

				var photosData = "";

				$.each(album.json.content, function() {
					album.parse(this);
					photosData += build.photo(this);
				});
				lychee.content.html(photosData);

				$("img[data-type!='svg']").retina();

			},

			title: function(photoID) {

				var longTitle = "",
					title = album.json.content[photoID].title;

				if (title.length>18) {
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

			if (!visible.controls()) view.header.show();
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

			if (photo.json.init) $("#infobox .attr_name").html(photo.json.title + " " + build.editIcon("edit_title"));
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