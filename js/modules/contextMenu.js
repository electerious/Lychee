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

	album: function(e) {

		e.preventDefault();
		mouse_x = e.pageX;
		mouse_y = e.pageY;
		albumID = $(this).attr("data-id");

		if (albumID=="0"||albumID=="f"||albumID=="s") return false;

		mouse_y -= $(document).scrollTop();

		items = [
			["Rename", "albums.rename(" + albumID + ")"],
			["Delete", "albums.deleteDialog(" + albumID + ")"]
		];

		contextMenu.close();
		$("body").css("overflow", "hidden");
		$(".album[data-id='" + albumID + "']").addClass("active");
		$("body").append(build.contextMenu(items));
		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x
		});

	},

	photo: function(e) {

		e.preventDefault();
		mouse_x = e.pageX;
		mouse_y = e.pageY;
		photoID = $(this).attr("data-id");

		mouse_y -= $(document).scrollTop();

		items = [
			["Rename", "photos.rename(" + photoID + ")"],
			["Move to Album", "contextMenu.move(" + photoID + ", " + (mouse_x+150) + ", " + (mouse_y+$(document).scrollTop()) + ")"],
			["Delete", "photos.deleteDialog(" + photoID + ")"]
		];

		contextMenu.close();
		$("body").css("overflow", "hidden");
		$(".photo[data-id='" + photoID + "']").addClass("active");
		$("body").append(build.contextMenu(items));
		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x
		});

	},

	move: function(photoID, mouse_x, mouse_y) {

		mouse_y -= $(document).scrollTop();

		lychee.api("getAlbums", "json", function(data) {

			if (lychee.content.attr("data-id")==0) {
				items = [];
			} else {
				items = [
					["Unsorted", "photos.move(" + photoID + ", 0)"]
				];
			}

			if (!data.albums) {
				items = [
					["Create new Album", "albums.add()"]
				];
			} else {
				$.each(data.album, function(index) {
					if (this.id!=lychee.content.attr("data-id")) {
						if(!this.title) this.title = "Untitled";
						items[items.length] = new Array(this.title, "photos.move(" + photoID + ", " + this.id + ")");
					} else {
						items[items.length] = new Array("", "");
					}
				});
			}

			contextMenu.close();
			$("body").css("overflow", "hidden");
			$(".photo[data-id='" + photoID + "']").addClass("active");
			$("body").append(build.contextMenu(items));
			$(".contextmenu").css({
				"top": mouse_y,
				"left": mouse_x-150
			});

		});

	},

	share: function(photoID, mouse_x, mouse_y) {

		mouse_y -= $(document).scrollTop();

		items = [
			["<a class='icon-eye-close'></a> Make Private", "photos.setPublic()"],
			["<a class='icon-twitter'></a> Twitter", "photos.share(0, " + photoID + ")"],
			["<a class='icon-facebook'></a> Facebook", "photos.share(1, " + photoID + ")"],
			["<a class='icon-envelope'></a> Mail", "photos.share(2, " + photoID + ")"],
			["<a class='icon-link'></a> Copy Link", "photos.share(3, " + photoID + ")"],
			["<a class='icon-link'></a> Copy Shortlink", "photos.share(4, " + photoID + ")"]
		];

		contextMenu.close();
		$("body").css("overflow", "hidden");
		$(".photo[data-id='" + photoID + "']").addClass("active");
		$("body").append(build.contextMenu(items));
		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x
		});

	},

	close: function() {

		$(".contextmenu_bg, .contextmenu").remove();
		$(".photo.active, .album.active").removeClass("active");
		$("body").css("overflow", "scroll");

	}

}