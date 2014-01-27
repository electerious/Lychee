/**
 * @name		ContextMenu Module
 * @description	This module is used for the context menu.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

contextMenu = {

	fns: null,

	show: function(items, mouse_x, mouse_y, orientation) {

		if (visible.contextMenu()) contextMenu.close();

		$("body")
			.css("overflow", "hidden")
			.append(build.contextMenu(items));

		if ((mouse_x+$(".contextmenu").outerWidth(true))>$("html").width()) orientation = "left";
		if ((mouse_y+$(".contextmenu").outerHeight(true))>$("html").height()) mouse_y -= (mouse_y+$(".contextmenu").outerHeight(true)-$("html").height())

		if (orientation==="left") mouse_x -= $(".contextmenu").outerWidth(true);

		if (!mouse_x||!mouse_y) {
			mouse_x = "10px";
			mouse_y = "10px";
		}

		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x,
			"opacity": .98
		});

	},

	add: function(e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items;

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { $("#upload_files").click() },
			function() { upload.start.url() },
			function() { upload.start.dropbox() },
			function() { upload.start.server() },
			function() { album.add() }
		];

		items = [
			["<a class='icon-picture'></a> Upload Photo", 0],
			["separator", -1],
			["<a class='icon-link'></a> Import from Link", 1],
			["<a class='icon-folder-open'></a> Import from Dropbox", 2],
			["<a class='icon-hdd'></a> Import from Server", 3],
			["separator", -1],
			["<a class='icon-folder-close'></a> New Album", 4]
		];

		contextMenu.show(items, mouse_x, mouse_y, "left");

	},

	settings: function(e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items;

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { settings.setLogin() },
			function() { settings.setSorting() },
			function() { window.open(lychee.website,"_newtab"); },
			function() { lychee.logout() }
		];

		items = [
			["<a class='icon-user'></a> Change Login", 0],
			["<a class='icon-sort'></a> Change Sorting", 1],
			["<a class='icon-info-sign'></a> About Lychee", 2],
			["separator", -1],
			["<a class='icon-signout'></a> Sign Out", 3]
		];

		contextMenu.show(items, mouse_x, mouse_y, "right");

	},

	album: function(albumID, e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items;

		if (albumID==="0"||albumID==="f"||albumID==="s") return false;

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { album.setTitle(albumID) },
			function() { album.delete(albumID) }
		];

		items = [
			["<a class='icon-edit'></a> Rename", 0],
			["<a class='icon-trash'></a> Delete", 1]
		];

		contextMenu.show(items, mouse_x, mouse_y, "right");

		$(".album[data-id='" + albumID + "']").addClass("active");

	},

	photo: function(photoID, e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items;

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { photo.setStar(photoID) },
			function() { photo.setTitle(photoID) },
			function() { contextMenu.move(photoID, e, "right") },
			function() { photo.delete(photoID) }
		];

		items = [
			["<a class='icon-star'></a> Star", 0],
			["separator", -1],
			["<a class='icon-edit'></a> Rename", 1],
			["<a class='icon-folder-open'></a> Move", 2],
			["<a class='icon-trash'></a> Delete", 3]
		];

		contextMenu.show(items, mouse_x, mouse_y, "right");

		$(".photo[data-id='" + photoID + "']").addClass("active");

	},

	move: function(photoID, e, orientation) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items = [];

		contextMenu.fns = [];

		if (album.getID()!=="0") {
			items = [
				["Unsorted", 0, "photo.setAlbum(0, " + photoID + ")"],
				["separator", -1]
			];
		}

		lychee.api("getAlbums", function(data) {

			if (!data.albums) {
				items = [["New Album", 0, "album.add()"]];
			} else {
				$.each(data.content, function(index) {
					if (this.id!=album.getID()) items.push([this.title, 0, "photo.setAlbum(" + this.id + ", " + photoID + ")"]);
				});
			}

			contextMenu.close();

			$(".photo[data-id='" + photoID + "']").addClass("active");

			if (!visible.photo()) contextMenu.show(items, mouse_x, mouse_y, "right");
			else contextMenu.show(items, mouse_x, mouse_y, "left");

		});

	},

	sharePhoto: function(photoID, e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items;

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { photo.setPublic(photoID) },
			function() { photo.share(photoID, 0) },
			function() { photo.share(photoID, 1) },
			function() { photo.share(photoID, 2) },
			function() { photo.share(photoID, 3) },
			function() { window.open(photo.getDirectLink(),"_newtab") }
		];
		
		link = photo.getViewLink(photoID);
		if (photo.json.public==="2") link = location.href;

		items = [
			["<input readonly id='link' value='" + link + "'>", -1],
			["separator", -1],
			["<a class='icon-eye-close'></a> Make Private", 0],
			["separator", -1],
			["<a class='icon-twitter'></a> Twitter", 1],
			["<a class='icon-facebook'></a> Facebook", 2],
			["<a class='icon-envelope'></a> Mail", 3],
			["<a class='icon-hdd'></a> Dropbox", 4],
			["<a class='icon-link'></a> Direct Link", 5]
		];

		contextMenu.show(items, mouse_x, mouse_y, "left");
		$(".contextmenu input").focus();

	},

	shareAlbum: function(albumID, e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items;

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { album.setPublic(albumID) },
			function() { password.set(albumID) },
			function() { album.share(0) },
			function() { album.share(1) },
			function() { album.share(2) },
			function() { password.remove(albumID) }
		];

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

		if (album.json.password==true) items[3] = ["<a class='icon-unlock'></a> Remove Password", 5];

		contextMenu.show(items, mouse_x, mouse_y, "left");
		$(".contextmenu input").focus();

	},

	close: function() {

		contextMenu.js = null;

		$(".contextmenu_bg, .contextmenu").remove();
		$(".photo.active, .album.active").removeClass("active");
		$("body").css("overflow", "auto");

	}

}