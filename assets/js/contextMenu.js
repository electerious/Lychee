/**
 * @name		ContextMenu Module
 * @description	This module is used for the context menu.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

contextMenu = {

	fns: null,
	// normalize pageX, pageY for touchend event
	normalizeTouchend: function(e) {
		if (e.type === "touchend" && (e.pageX==null||e.pageY==null)) {
			var touches = e.originalEvent.changedTouches;
			if (touches.length>0) {
				e.pageX = touches[0].pageX;
				e.pageY = touches[0].pageY;
			}
			e.preventDefault();
		}

		return e;
	},
	show: function(items, mouse_x, mouse_y, orientation) {

		contextMenu.close();

		$("body")
			.css("overflow", "hidden")
			.append(build.contextMenu(items));

		// Do not leave the screen
		if ((mouse_x+$(".contextmenu").outerWidth(true))>$("html").width()) orientation = "left";
		if ((mouse_y+$(".contextmenu").outerHeight(true))>$("html").height()) mouse_y -= (mouse_y+$(".contextmenu").outerHeight(true)-$("html").height());

		if (mouse_x>$(document).width()) mouse_x = $(document).width();
		if (mouse_x<0) mouse_x = 0;
		if (mouse_y>$(document).height()) mouse_y = $(document).height();
		if (mouse_y<0) mouse_y = 0;

		if (orientation==="left") mouse_x -= $(".contextmenu").outerWidth(true);

		if (mouse_x===null||
			mouse_x===undefined||
			isNaN(mouse_x)||
			mouse_y===null||
			mouse_y===undefined||
			isNaN(mouse_y)) {
				mouse_x = "10px";
				mouse_y = "10px";
		}

		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x,
			"opacity": 0.98
		});

	},

	add: function(e) {
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY - $(document).scrollTop(),
			items;

		upload.notify();

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
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY - $(document).scrollTop(),
			items;

		contextMenu.fns = [
			function() { settings.setLogin() },
			function() { settings.setSorting() },
			function() { settings.setDropboxKey() },
			function() { window.open(lychee.website); },
			function() { window.open("plugins/check/"); },
			function() { window.open("plugins/displaylog/"); },
			function() { lychee.logout() }
		];

		items = [
			["<a class='icon-user'></a> Change Login", 0],
			["<a class='icon-sort'></a> Change Sorting", 1],
			["<a class='icon-folder-open'></a> Set Dropbox", 2],
			["separator", -1],
			["<a class='icon-info-sign'></a> About Lychee", 3],
			["<a class='icon-dashboard'></a> Diagnostics", 4],
			["<a class='icon-list'></a> Show Log", 5],
			["separator", -1],
			["<a class='icon-signout'></a> Sign Out", 6]
		];

		contextMenu.show(items, mouse_x, mouse_y, "right");

	},

	album: function(albumID, e) {
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY - $(document).scrollTop(),
			items;

		if (albumID==="0"||albumID==="f"||albumID==="s"||albumID==="r") return false;

		contextMenu.fns = [
			function() { album.setTitle([albumID]) },
			function() { album.delete([albumID]) }
		];

		items = [
			["<a class='icon-edit'></a> Rename", 0],
			["<a class='icon-trash'></a> Delete", 1]
		];

		contextMenu.show(items, mouse_x, mouse_y, "right");

		$(".album[data-id='" + albumID + "']").addClass("active");

	},

	albumMulti: function(albumIDs, e) {
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY - $(document).scrollTop(),
			items;

		multiselect.stopResize();

		contextMenu.fns = [
			function() { album.setTitle(albumIDs) },
			function() { album.delete(albumIDs) },
		];

		items = [
			["<a class='icon-edit'></a> Rename All", 0],
			["<a class='icon-trash'></a> Delete All", 1]
		];

		contextMenu.show(items, mouse_x, mouse_y, "right");

	},

	photo: function(photoID, e) {
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY - $(document).scrollTop(),
			items;

		contextMenu.fns = [
			function() { photo.setStar([photoID]) },
			function() { photo.editTags([photoID]) },
			function() { photo.setTitle([photoID]) },
			function() { photo.duplicate([photoID]) },
			function() { contextMenu.move([photoID], e, "right") },
			function() { photo.delete([photoID]) }
		];

		items = [
			["<a class='icon-star'></a> Star", 0],
			["<a class='icon-tags'></a> Tags", 1],
			["separator", -1],
			["<a class='icon-edit'></a> Rename", 2],
			["<a class='icon-copy'></a> Duplicate", 3],
			["<a class='icon-folder-open'></a> Move", 4],
			["<a class='icon-trash'></a> Delete", 5]
		];

		contextMenu.show(items, mouse_x, mouse_y, "right");

		$(".photo[data-id='" + photoID + "']").addClass("active");

	},

	photoMulti: function(photoIDs, e) {
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY - $(document).scrollTop(),
			items;

		multiselect.stopResize();

		contextMenu.fns = [
			function() { photo.setStar(photoIDs) },
			function() { photo.editTags(photoIDs) },
			function() { photo.setTitle(photoIDs) },
			function() { photo.duplicate(photoIDs) },
			function() { contextMenu.move(photoIDs, e, "right") },
			function() { photo.delete(photoIDs) }
		];

		items = [
			["<a class='icon-star'></a> Star All", 0],
			["<a class='icon-tags'></a> Tag All", 1],
			["separator", -1],
			["<a class='icon-edit'></a> Rename All", 2],
			["<a class='icon-copy'></a> Duplicate All", 3],
			["<a class='icon-folder-open'></a> Move All", 4],
			["<a class='icon-trash'></a> Delete All", 5]
		];

		contextMenu.show(items, mouse_x, mouse_y, "right");

	},

	photoMore: function(photoID, e) {
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY - $(document).scrollTop(),
			items;

		contextMenu.fns = [
			function() { window.open(photo.getDirectLink()) },
			function() { photo.getArchive(photoID) }
		];

		items = [["<a class='icon-resize-full'></a> Full Photo", 0]];
		if ((album.json&&album.json.downloadable&&album.json.downloadable==="1"&&lychee.publicMode)||!lychee.publicMode) items.push(["<a class='icon-circle-arrow-down'></a> Download", 1]);

		contextMenu.show(items, mouse_x, mouse_y, "right");

	},

	move: function(photoIDs, e, orientation) {
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY - $(document).scrollTop(),
			items = [];

		contextMenu.close(true);

		if (album.getID()!=="0") {
			items = [
				["Unsorted", 0, "photo.setAlbum([" + photoIDs + "], 0)"],
				["separator", -1]
			];
		}

		lychee.api("getAlbums", function(data) {

			if (data.num===0) {
				items = [["New Album", 0, "album.add()"]];
			} else {
				$.each(data.content, function(index) {
					if (this.id!=album.getID()) items.push([this.title, 0, "photo.setAlbum([" + photoIDs + "], " + this.id + ")"]);
				});
			}

			if (!visible.photo()) contextMenu.show(items, mouse_x, mouse_y, "right");
			else contextMenu.show(items, mouse_x, mouse_y, "left");

		});

	},

	sharePhoto: function(photoID, e) {
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items,
			link = "";

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { photo.setPublic(photoID) },
			function() { photo.share(photoID, 0) },
			function() { photo.share(photoID, 1) },
			function() { photo.share(photoID, 2) },
			function() { photo.share(photoID, 3) },
			function() { window.open(photo.getDirectLink()) }
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
		$(".contextmenu input").focus().select();

	},

	shareAlbum: function(albumID, e) {
		e = contextMenu.normalizeTouchend(e);

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			items;

		mouse_y -= $(document).scrollTop();

		contextMenu.fns = [
			function() { album.setPublic(albumID) },
			function() { album.share(0) },
			function() { album.share(1) },
			function() { album.share(2) },
			function() { password.remove(albumID) }
		];

		items = [
			["<input readonly id='link' value='" + location.href + "'>", -1],
			["separator", -1],
			["<a class='icon-eye-close'></a> Make Private", 0],
			["separator", -1],
			["<a class='icon-twitter'></a> Twitter", 1],
			["<a class='icon-facebook'></a> Facebook", 2],
			["<a class='icon-envelope'></a> Mail", 3],
		];

		contextMenu.show(items, mouse_x, mouse_y, "left");
		$(".contextmenu input").focus().select();

	},

	close: function(leaveSelection) {

		if (!visible.contextMenu()) return false;

		contextMenu.fns = [];

		$(".contextmenu_bg, .contextmenu").remove();
		$("body").css("overflow", "auto");

		if (leaveSelection!==true) {
			$(".photo.active, .album.active").removeClass("active");
			if (visible.multiselect()) multiselect.close();
		}

	}

};