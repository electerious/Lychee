/**
 * @name        albums.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Albums Module
 * Takes care of every action albums can handle and execute.
 */

albums = {

	load: function() {

		lychee.animate(".album, .photo", "contentZoomOut");

		/* Search */
		lychee.content.attr("data-search", "");
		lychee.animate(".divider", "fadeOut");

		startTime = new Date().getTime();

		lychee.api("getAlbums", "json", function(data) {

			durationTime = (new Date().getTime() - startTime);
			if (durationTime>300) waitTime = 0; else waitTime = 300 - durationTime;

			$.timer(waitTime,function(){

				$("#tools_album, #tools_photo").hide();
				$("#tools_albums").show();

				/* Smart Albums */
				unsortedAlbum = new Object();
				unsortedAlbum.id = 0;
				unsortedAlbum.title = "Unsorted";
				unsortedAlbum.sysdate = data.unsortNum + " photos";
				unsortedAlbum.unsorted = 1;
				if (data.unsortThumb0) unsortedAlbum.thumb0 = lychee.upload_path + data.unsortThumb0; else unsortedAlbum.thumb0 = "";
				if (data.unsortThumb1) unsortedAlbum.thumb1 = lychee.upload_path + data.unsortThumb1; else unsortedAlbum.thumb1 = "";
				if (data.unsortThumb2) unsortedAlbum.thumb2 = lychee.upload_path + data.unsortThumb2; else unsortedAlbum.thumb2 = "";

				starredAlbum = new Object();
				starredAlbum.id = "f";
				starredAlbum.title = "Starred";
				starredAlbum.sysdate = data.starredNum + " photos";
				starredAlbum.star = 1;
				if (data.starredThumb0) starredAlbum.thumb0 = lychee.upload_path + data.starredThumb0; else starredAlbum.thumb0 = "";
				if (data.starredThumb1) starredAlbum.thumb1 = lychee.upload_path + data.starredThumb1; else starredAlbum.thumb1 = "";
				if (data.starredThumb2) starredAlbum.thumb2 = lychee.upload_path + data.starredThumb2; else starredAlbum.thumb2 = "";

				publicAlbum = new Object();
				publicAlbum.id = "s";
				publicAlbum.title = "Public";
				publicAlbum.sysdate = data.publicNum + " photos";
				publicAlbum.public = 1;
				if (data.publicThumb0) publicAlbum.thumb0 = lychee.upload_path + data.publicThumb0; else publicAlbum.thumb0 = "";
				if (data.publicThumb1) publicAlbum.thumb1 = lychee.upload_path + data.publicThumb1; else publicAlbum.thumb1 = "";
				if (data.publicThumb2) publicAlbum.thumb2 = lychee.upload_path + data.publicThumb2; else publicAlbum.thumb2 = "";

				if (lychee.publicMode) smartData = "";
				else smartData = build.divider("Smart Albums") + build.album(unsortedAlbum) + build.album(starredAlbum) + build.album(publicAlbum);

				/*  Albums */
				if (data.albums) {

					albumsData = build.divider("Albums");
					$.each(data.album, function() { albumsData += build.album(this); });

				} else albumsData = "";

				if (smartData==""&&albumsData=="") $("body").append(build.no_content("picture"));
				else {
					lychee.content.html(smartData + albumsData);
					lychee.animate(".album, .photo", "contentZoomIn");
				}

				document.title = "Lychee";
				lychee.headerTitle.html("Albums").removeClass("editable");

				$("img").retina();

			});

		})

	},

	loadInfo: function(albumID, password) {

		if (albumID=="f"||albumID=="s"||albumID==0) {

			lychee.headerTitle.removeClass("editable");

			$("#button_edit_album, #button_trash_album, #button_share_album").hide();

			lychee.api("getSmartInfo", "json", function(data) {

				switch (albumID) {
					case "f":
						document.title = "Lychee - Starred";
						lychee.headerTitle.html("Starred<span> - " + data.starredNum + " photos</span>");
						break;
					case "s":
						document.title = "Lychee - Public";
						lychee.headerTitle.html("Public<span> - " + data.publicNum + " photos</span>");
						break;
					case "0":
						document.title = "Lychee - Unsorted";
						lychee.headerTitle.html("Unsorted<span> - " + data.unsortNum + " photos</span>");
						$("#button_trash_album").show();
						break;
				}

			});

		} else {

			/*if (lychee.publicMode&&password==undefined) {
				password = localStorage.getItem("album" + albumID);
				if (password==null) {
					 if (lychee.publicMode) password = prompt("Please enter a password for this album:", ""); else password = "";
					 if (password!="") password = hex_md5(password);
					 localStorage.setItem("album" + albumID, password);
				}
			}*/

			password = "";

			$("#button_edit_album, #button_trash_album, #button_share_album, .button_divider").show();

			params = "getAlbumInfo&albumID=" + albumID + "&password=" + password;
			lychee.api(params, "json", function(data) {

				if (!data.title) data.title = "Untitled";
				document.title = "Lychee - " + data.title;
				lychee.headerTitle.html(data.title + "<span> - " + data.num + " photos</span>").addClass("editable");

				if (data.public=="1") {
					$("#button_share_album a").addClass("active");
					$("#button_share_album").attr("title", "Share Album");
				} else {
					$("#button_share_album a").removeClass("active");
					$("#button_share_album").attr("title", "Make Public");
				}

			});

		}

	},

	add: function() {

		title = prompt("Please enter a title for this album:", "Untitled");
		lychee.closeModal();

		if (title.length>0&&title.length<31) {

			params = "addAlbum&title=" + escape(title);
			lychee.api(params, "text", function(data) {

				if (data) lychee.goto("a" + data);
				else loadingBar.show("error");

			});

		} else if (title.length>0) loadingBar.show("error", "Error", "Title to short or too long. Please try another one!");

	},

	hide: function(albumID) {

		$(".album[data-id='" + albumID + "']").css("opacity", 0).animate({
			width: 0,
			marginLeft: 0
		}, 300, function() {
			$(this).remove();
		});

	},

	delete: function(albumID, delAll) {

		params = "deleteAlbum&albumID=" + albumID + "&delAll=" + delAll;
		lychee.api(params, "text", function(data) {

			if (data) {

				if (visible.albums()) albums.hide(albumID);
				else lychee.goto("");

			} else loadingBar.show("error");

		});

	},

	deleteDialog: function(albumID) {

		if (albumID==0) {

			f1 = "albums.delete(0, true);";
			f2 = "";
			modal = build.modal("Clear Unsorted", "Are you sure you want to delete all photos from 'Unsorted'?<br>This action can't be undone!", ["Clear Unsorted", "Keep Photos"], [f1, f2]);
			$("body").append(modal);

		} else {

			if (visible.albums()) albumTitle = $(".album[data-id='" + albumID + "'] .overlay h1").html();
			else albumTitle = lychee.title();

			f1 = "albums.delete(" + albumID + ", true);";
			f2 = "albums.delete(" + albumID + ", false);";
			modal = build.modal("Delete Album", "Are you sure you want to delete the album '" + albumTitle + "' and all of the photos it contains? This action can't be undone!", ["Delete Album and Photos", "Keep Photos"], [f1, f2]);
			$("body").append(modal);

		}

	},

	setTitle: function(albumID) {

		if (!albumID) oldTitle = lychee.title(); else oldTitle = "";
		if (!albumID) albumID = lychee.content.attr("data-id");

		newTitle = prompt("Please enter a new title for this album:", oldTitle);

		if (albumID!=""&&albumID!=null&&albumID&&newTitle.length>0&&newTitle.length<31) {

			params = "setAlbumTitle&albumID=" + albumID + "&title=" + encodeURI(newTitle);
			lychee.api(params, "text", function(data) {

				if (data) {
					if (visible.albums()) $(".album[data-id='" + albumID + "'] .overlay h1").html(newTitle);
					else {
						lychee.headerTitle.html(newTitle + "<span>" + $("#title span").html() + "</span>");
						document.title = "Lychee - " + newTitle;
					}
				} else loadingBar.show("error");

			});

		} else if (newTitle.length>0) loadingBar.show("error", "Error", "New title to short or too long. Please try another one!");

	},

	setPublic: function(e) {

		albumID = lychee.content.attr("data-id");

		params = "setAlbumPublic&albumID=" + albumID;
		lychee.api(params, "text", function(data) {

			if (data) {

				if ($("#button_share_album a.active").length) {
					$("#button_share_album a").removeClass("active");
					$("#button_share_album").attr("title", "Make Public");
				} else {
					$("#button_share_album a").addClass("active");
					$("#button_share_album").attr("title", "Share Album");
					contextMenu.share_album(albumID, e.pageX, e.pageY);
				}

			} else loadingBar.show("error");

		});

	},

	setPassword: function(albumID, password) {

		if (!albumID) albumID = lychee.content.attr("data-id");
		if (!password) password = prompt("Please enter a password for this album:", "");
		if (password!="") password = hex_md5(password);

		params = "setAlbumPassword&albumID=" + albumID + "&password=" + password;
		lychee.api(params, "text", function(data) {

			if (!data) loadingBar.show("error");

		});

	},

	/*checkAlbumPassword: function(albumID, password) {

		params = "checkAlbumPassword&albumID=" + albumID + "&password=" + hex_md5(password);
		lychee.api(params, "text", function(data) {
			if (data) {
				if (password!="") password = hex_md5(password);
				localStorage.setItem("album" + albumID, password);
				return true;
			} else return false;
		});

	},*/

	share: function(service, albumID) {

		link = "";
		url = location.href;

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
				modal = build.modal("Copy Link", "Everyone can view your public albums, but only you can edit them. Use this link to share your album with others: <input class='copylink' value='" + url + "'>", ["Close"], [""]);
				$("body").append(modal);
				$(".copylink").focus();
				break;
			default:
				link = "";
				break;
		}

		if (link.length>5) location.href = link;

	},

	getArchive: function() {

		albumID = lychee.content.attr("data-id");
		if (location.href.indexOf("index.html")>0) link = location.href.replace(location.hash, "").replace("index.html", "php/api.php?function=getAlbumArchive&albumID=" + albumID);
		else link = location.href.replace(location.hash, "") + "php/api.php?function=getAlbumArchive&albumID=" + albumID;
		location.href = link;

	}

}