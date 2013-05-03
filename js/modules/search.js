/**
 * @name        photos.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Search Module
 * Searches through your photos and albums.
 */

search = {

	find: function(term) {

		clearTimeout($(window).data("timeout"));
		$(window).data("timeout", setTimeout(function() {

			if ($("#search").val().length!=0) {

				params = "search&term=" + term;
				lychee.api(params, "json", function(data) {

					albumsData = "";
					if (data&&data.albums) $.each(data.albums, function() { albumsData += build.album(this); });

					photosData = "";
					if (data&&data.photos) $.each(data.photos, function() { photosData += build.photo(this); });

					if (albumsData==""&&photosData=="") code = "";
					else if (albumsData=="") code = build.divider("Photos")+photosData;
					else if (photosData=="") code = build.divider("Albums")+albumsData;
					else code = build.divider("Photos")+photosData+build.divider("Albums")+albumsData;

					if (lychee.content.attr("data-search")!=code) {

						lychee.animate(".album, .photo", "contentZoomOut");
						lychee.animate(".divider", "fadeOut");

						$.timer(300,function(){

							lychee.content.attr("data-search", code);
							lychee.content.html(code);
							lychee.animate(".album, .photo", "contentZoomIn");

						});

					}

				});

			} else search.reset();

		}, 250));

	},

	reset: function() {

		$("#search").val("");

		if (lychee.content.attr("data-search")!="") {

			lychee.content.attr("data-search", "");
			lychee.animate(".divider", "fadeOut");
			albums.load();

		}

	}

}