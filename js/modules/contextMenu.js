/**
 * @name        contextMenu.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * ContextMenu Module
 * This module is used for the context menu.
 */

contextMenu = {

	fns: null,

	album: function(e) {

		e.preventDefault();
		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			albumID = album.getID(),
			items;

		if (albumID=="0"||albumID=="f"||albumID=="s") return false;

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { album.setTitle(albumID) },
			function() { album.delete(albumID) }
		];

		items = [
			["<a class='icon-edit'></a> Rename", 0],
			["<a class='icon-trash'></a> Delete", 1]
		];

		contextMenu.close();
		$(".album[data-id='" + albumID + "']").addClass("active");
		$("body")
			.css("overflow", "hidden")
			.append(build.contextMenu(items));
		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x
		});

	},

	photo: function(e) {

		e.preventDefault();
		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			photoID = photo.getID(),
			items;

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { photo.setStar(photoID) },
			function() { photo.setTitle(photoID) },
			function() { contextMenu.move(photoID, e) },
			function() { photo.delete(photoID) }
		];

		items = [
			["<a class='icon-star'></a> Star", 0],
			["separator", -1],
			["<a class='icon-edit'></a> Rename", 1],
			["<a class='icon-folder-open'></a> Move", 2],
			["<a class='icon-trash'></a> Delete", 3]
		];

		contextMenu.close();
		$(".photo[data-id='" + photoID + "']").addClass("active");
		$("body")
			.css("overflow", "hidden")
			.append(build.contextMenu(items));
		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x
		});

	},

	move: function(photoID, e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items = [],
			albumID;

		contextMenu.fns = [];
		mouse_y -= $(document).scrollTop();

		if (!mouse_x||!mouse_y) {
			mouse_x = "10px";
			mouse_y = "10px";
		}

		if (album.getID()!=0) {
			items = [
				["Unsorted", 0, "photo.setAlbum(0, " + photoID + ")"],
				["separator", -1]
			];
		}

		lychee.api("getAlbums", "json", function(data) {

			if (!data.albums) {
				items = [["New Album", 0, "album.add()"]];
			} else {
				$.each(data.content, function(index) {
					if (this.id!=album.getID()) items.push([this.title, 0, "photo.setAlbum(" + this.id + ", " + photoID + ")"]);
				});
			}

			contextMenu.close();
			$(".photo[data-id='" + photoID + "']").addClass("active");
			$("body")
				.css("overflow", "hidden")
				.append(build.contextMenu(items));
			if (!visible.photo()) mouse_x += $(".contextmenu").width();
			$(".contextmenu").css({
				"top": mouse_y,
				"left": mouse_x-$(".contextmenu").width()
			});

		});

	},

	sharePhoto: function(photoID, e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items;

		mouse_y -= $(document).scrollTop();

		if (!mouse_x||!mouse_y) {
			mouse_x = "10px";
			mouse_y = "10px";
		}

		contextMenu.fns = [
			function() { photo.setPublic(photoID) },
			function() { photo.share(photoID, 0) },
			function() { photo.share(photoID, 1) },
			function() { photo.share(photoID, 2) },
			function() { photo.share(photoID, 3) }
		];

		if (document.location.hostname!="localhost") {

			items = [
				["<input readonly id='link' value='" + photo.getViewLink(photoID) + "'>", -1],
				["separator", -1],
				["<a class='icon-eye-close'></a> Make Private", 0],
				["separator", -1],
				["<a class='icon-twitter'></a> Twitter", 1],
				["<a class='icon-facebook'></a> Facebook", 2],
				["<a class='icon-envelope'></a> Mail", 3],
				["<a class='icon-hdd'></a> Dropbox", 4]
			];

		} else {

			items = [
				["<input readonly id='link' value='" + photo.getViewLink(photoID) + "'>", -1],
				["separator", -1],
				["<a class='icon-eye-close'></a> Make Private", 0],
				["separator", -1],
				["<a class='icon-envelope'></a> Mail", 3]
			];

		}

		contextMenu.close();
		$("body")
			.css("overflow", "hidden")
			.append(build.contextMenu(items));
		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x+20-$(".contextmenu").width()
		});

		$(".contextmenu input").focus();

	},

	shareAlbum: function(albumID, e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items;

		mouse_y -= $(document).scrollTop();

		if (!mouse_x||!mouse_y) {
			mouse_x = "10px";
			mouse_y = "10px";
		}

		contextMenu.fns = [
			function() { album.setPublic(albumID) },
			function() { password.set(albumID) },
			function() { album.share(0) },
			function() { album.share(1) },
			function() { album.share(2) },
			function() { password.remove(albumID) }
		];

		if (document.location.hostname!="localhost") {

			items = [
				["<input readonly id='link' value='" + location.href + "'>", -1],
				["separator", -1],
				["<a class='icon-eye-close'></a> Make Private", 0],
				["<a class='icon-lock'></a> Set Password", 1],
				["separator", -1],
				["<a class='icon-twitter'></a> Twitter", 2],
				["<a class='icon-facebook'></a> Facebook", 3],
				["<a class='icon-envelope'></a> Mail", 4],
			];

		} else {

			items = [
				["<input readonly id='link' value='" + location.href + "'>", -1],
				["separator", -1],
				["<a class='icon-eye-close'></a> Make Private", 0],
				["<a class='icon-lock'></a> Set Password", 1],
				["separator", -1],
				["<a class='icon-envelope'></a> Mail", 4],
			];

		}

		if (album.json.password==true) items[3] = ["<a class='icon-unlock'></a> Remove Password", 5];

		contextMenu.close();
		$("body")
			.css("overflow", "hidden")
			.append(build.contextMenu(items));
		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x+20-$(".contextmenu").width()
		});

		$(".contextmenu input").focus();

	},

	close: function() {

		contextMenu.js = null;

		$(".contextmenu_bg, .contextmenu").remove();
		$(".photo.active, .album.active").removeClass("active");
		$("body").css("overflow", "scroll");

	}

}