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

	json: null,

	load: function() {

		var startTime,
			durationTime,
			unsortedAlbum,
			starredAlbum,
			publicAlbum,
			smartData = "",
			albumsData = "";

		lychee.animate(".album, .photo", "contentZoomOut");
		lychee.animate(".divider", "fadeOut");

		startTime = new Date().getTime();

		lychee.api("getAlbums", "json", function(data) {

			/* Smart Albums */
			data.unsortedAlbum = {
				id: 0,
				title: "Unsorted",
				sysdate: data.unsortedNum + " photos",
				unsorted: 1,
				thumb0: data.unsortedThumb0,
				thumb1: data.unsortedThumb1,
				thumb2: data.unsortedThumb2
			}

			data.starredAlbum = {
				id: "f",
				title: "Starred",
				sysdate: data.starredNum + " photos",
				star: 1,
				thumb0: data.starredThumb0,
				thumb1: data.starredThumb1,
				thumb2: data.starredThumb2
			}

			data.publicAlbum = {
				id: "s",
				title: "Public",
				sysdate: data.publicNum + " photos",
				public: 1,
				thumb0: data.publicThumb0,
				thumb1: data.publicThumb1,
				thumb2: data.publicThumb2
			}

			albums.json = data;

			durationTime = (new Date().getTime() - startTime);
			if (durationTime>300) waitTime = 0; else waitTime = 300 - durationTime;
			if (!visible.albums()&&!visible.photo()&&!visible.album()) waitTime = 0;

			$.timer(waitTime,function(){

				view.header.mode("albums");
				view.albums.init();
				lychee.animate(".album, .photo", "contentZoomIn");

			});

		})

	},

	parse: function(album) {

		if (album.password&&lychee.publicMode) {
			album.thumb0 = "img/password.png";
			album.thumb1 = "img/password.png";
			album.thumb2 = "img/password.png";
		} else {
			if (album.thumb0) album.thumb0 = lychee.upload_path_thumb + album.thumb0; else album.thumb0 = "img/no_images.png";
			if (album.thumb1) album.thumb1 = lychee.upload_path_thumb + album.thumb1; else album.thumb1 = "img/no_images.png";
			if (album.thumb2) album.thumb2 = lychee.upload_path_thumb + album.thumb2; else album.thumb2 = "img/no_images.png";
		}

	}

}