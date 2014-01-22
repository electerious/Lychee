/**
 * @name        Search Module
 * @description	Searches through your photos and albums.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

search = {

	code: null,

	find: function(term) {

		var params,
			albumsData = "",
			photosData = "",
			code;

		clearTimeout($(window).data("timeout"));
		$(window).data("timeout", setTimeout(function() {

			if ($("#search").val().length!==0) {

				params = "search&term=" + term;
				lychee.api(params, function(data) {

					if (data&&data.albums) {
						albums.json = { content: data.albums };
						$.each(albums.json.content, function() {
							albums.parse(this);
							albumsData += build.album(this);
						});
					}

					if (data&&data.photos) {
						album.json = { content: data.photos };
						$.each(album.json.content, function() {
							album.parse(this);
							photosData += build.photo(this);
						});
					}

					if (albumsData===""&&photosData==="") code = "error";
					else if (albumsData==="") code = build.divider("Photos")+photosData;
					else if (photosData==="") code = build.divider("Albums")+albumsData;
					else code = build.divider("Photos")+photosData+build.divider("Albums")+albumsData;

					if (search.code!==hex_md5(code)) {

						$(".no_content").remove();

						lychee.animate(".album, .photo", "contentZoomOut");
						lychee.animate(".divider", "fadeOut");

						search.code = hex_md5(code);

						setTimeout(function() {

							if (code==="error") $("body").append(build.no_content("search"));
							else {
								lychee.content.html(code);
								lychee.animate(".album, .photo", "contentZoomIn");
							}

						}, 300);

					}

				});

			} else search.reset();

		}, 250));

	},

	reset: function() {

		$("#search").val("");
		$(".no_content").remove();

		if (search.code!=="") {

			search.code = "";
			lychee.animate(".divider", "fadeOut");
			albums.load();

		}

	}

}