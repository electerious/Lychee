/**
 * @name        view.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * UI View
 * Responsible to reflect data changes to the UI.
 */

view = {

	header: {

		show: function() {

			clearTimeout($(window).data("timeout"));

			if (visible.photo()) {
				lychee.imageview.removeClass("full");
				lychee.loadingBar.css("opacity", 1);
				lychee.header.css("margin-Top", "0px");
				if ($("#imageview #image.small").length>0) {
					$("#imageview #image").css({
						marginTop: -1*($("#imageview #image").height()/2)+20
					});
				} else {
					$("#imageview #image").css({
						top: 70,
						right: 30,
						bottom: 30,
						left: 30
					});
				}
			}

		},

		hide: function() {

			if (visible.photo()&&!visible.infobox()) {
				clearTimeout($(window).data("timeout"));
				$(window).data("timeout", setTimeout(function() {
					lychee.imageview.addClass("full");
					lychee.loadingBar.css("opacity", 0);
					lychee.header.css("margin-Top", "-45px");
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

			var albumID;

			switch (mode) {
				case "albums":
					$("#tools_album, #tools_photo").hide();
					$("#tools_albums").show();
					break;
				case "album":
					$("#tools_albums, #tools_photo").hide();
					$("#tools_album").show();
					albumID = album.getID();
					if (albumID=="s"||albumID=="f") $("#button_edit_album, #button_trash_album, #button_share_album").hide();
					else if (albumID==0) $("#button_edit_album, #button_share_album").hide();
					else $("#button_edit_album, #button_trash_album, #button_share_album").show();
					break;
				case "photo":
					$("#tools_albums, #tools_album").hide();
					$("#tools_photo").show();
					break;
			}

		}

	},

	albums: {

		init: function() {

			view.albums.title();
			view.albums.content.init();

		},

		title: function() {

			lychee.setTitle("Albums", null, false);

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

				if (smartData==""&&albumsData=="") $("body").append(build.no_content("picture"));
				else lychee.content.html(smartData + albumsData);

				$("img").retina();

			},

			title: function(albumID) {

				var prefix = "",
					title = albums.json.content[albumID].title;

				if (albums.json.content[albumID].password) prefix = "<span class='icon-lock'></span> ";
				if (title.length>18) title = title.substr(0, 18) + "...";

				$(".album[data-id='" + albumID + "'] .overlay h1").html(prefix + title);

			},

			delete: function(albumID) {

				$(".album[data-id='" + albumID + "']").css("opacity", 0).animate({
					width: 0,
					marginLeft: 0
				}, 300, function() {
					$(this).remove();
				});

			}

		}

	},

	album: {

		init: function() {

			album.parse();

			view.album.title();
			view.album.public();
			view.album.content.init();

			album.json.init = 1;

		},

		title: function() {

			if ((visible.album()||!album.json.init)&&!visible.photo()) {

				switch (album.getID()) {
					case "f":
						lychee.setTitle("Starred", album.json.num, false);
						break;
					case "s":
						lychee.setTitle("Public", album.json.num, false);
						break;
					case "0":
						lychee.setTitle("Unsorted", album.json.num, false);
						break;
					default:
						lychee.setTitle(album.json.title, album.json.num, true);
						break;
				}

			}

		},

		content: {

			init: function() {

				var photosData = "";

				$.each(album.json.content, function() {
					album.parse(this);
					photosData += build.photo(this);
				});
				lychee.content.html(photosData);

				$("img").retina();

			},

			title: function(photoID) {

				var title = album.json.content[photoID].title;

				if (title.length>18) title = title.substr(0, 18) + "...";

				$(".photo[data-id='" + photoID + "'] .overlay h1").html(title);

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
						view.album.title();
					}
				});

			}

		},

		public: function() {

			if (album.json.public==1) {
				$("#button_share_album a").addClass("active");
				$("#button_share_album").attr("title", "Share Album");
				$(".photo .icon-share").remove();
			} else {
				$("#button_share_album a").removeClass("active");
				$("#button_share_album").attr("title", "Make Public");
			}

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

			view.header.mode("photo");

			// Make body not scrollable
			$("body").css("overflow", "hidden");

			lychee.animate(lychee.imageview, "fadeIn");

		},

		hide: function() {

			if (!visible.controls()) view.header.show();
			if (visible.infobox) view.photo.hideInfobox();

			view.header.mode("album");

			// Make body scrollable
			$("body").css("overflow", "scroll");

			// Hide Photo
			lychee.animate(lychee.imageview, "fadeOut");
			$.timer(300,function(){ lychee.imageview.hide() });

		},

		showInfobox: function() {

			if (!visible.infobox()) $("body").append("<div id='infobox_overlay'></div>");
			lychee.infobox.css("right", "0px");

		},

		hideInfobox: function() {

			$("#infobox_overlay").remove();
			lychee.infobox.css("right", "-320px");

		},

		title: function(oldTitle) {

			if (photo.json.init) $("#infobox .attr_name").html($("#infobox .attr_name").html().replace(oldTitle, photo.json.title));
			lychee.setTitle(photo.json.title, null, true);

		},

		description: function(oldDescription) {

			if (photo.json.init) $("#infobox .attr_description").html($("#infobox .attr_description").html().replace(oldDescription, photo.json.description));

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

		photo: function() {

			if (visible.controls()&&photo.isSmall()) lychee.imageview.html("<a id='previous' class='icon-caret-left'></a><a id='next' class='icon-caret-right'></a><div id='image' class='small' style='background-image: url(" + photo.json.url + "); width: " + photo.json.width + "px; height: " + photo.json.height + "px; margin-top: -" + parseInt(photo.json.height/2-20) + "px; margin-left: -" + photo.json.width/2 + "px;'></div>");
			else if (visible.controls()) lychee.imageview.html("<a id='previous' class='icon-caret-left'></a><a id='next' class='icon-caret-right'></a><div id='image' style='background-image: url(" + photo.json.url + ")'></div>");
			else if (photo.isSmall()) lychee.imageview.html("<a id='previous' style='left: -50px' class='icon-caret-left'></a><a id='next' style='right: -50px' class='icon-caret-right'></a><div id='image' class='small' style='background-image: url(" + photo.json.url + "); width: " + photo.json.width + "px; height: " + photo.json.height + "px; margin-top: -" + parseInt(photo.json.height/2) + "px; margin-left: -" + photo.json.width/2 + "px;'></div>");
			else lychee.imageview.html("<a id='previous' style='left: -50px' class='icon-caret-left'></a><a id='next' style='right: -50px' class='icon-caret-right'></a><div id='image' style='background-image: url(" + photo.json.url + "); top: 0px; right: 0px; bottom: 0px; left: 0px;'></div>");

			if (!photo.json.nextPhoto||lychee.viewMode) $("a#next").hide();
			if (!photo.json.previousPhoto||lychee.viewMode) $("a#previous").hide();

		},

		infobox: function() {

			lychee.infobox.html(build.infobox(photo.json)).show();

		}

	}

}