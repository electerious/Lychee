/**
 * @name		Albums Module
 * @description	Takes care of every action albums can handle and execute.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

albums = {

	json: null,

	load: function() {

		var startTime,
			durationTime,
			waitTime;

		lychee.animate(".album:nth-child(-n+50), .photo:nth-child(-n+50)", "contentZoomOut");
		lychee.animate(".divider", "fadeOut");

		startTime = new Date().getTime();

		if(albums.json===null) {

			lychee.api("getAlbums", function(data) {

				/* Smart Albums */
				data.unsortedAlbum = {
					id: 0,
					title: "Unsorted",
					sysdate: data.unsortedNum + " photos",
					unsorted: 1,
					thumb0: data.unsortedThumb0,
					thumb1: data.unsortedThumb1,
					thumb2: data.unsortedThumb2
				};

				data.starredAlbum = {
					id: "f",
					title: "Starred",
					sysdate: data.starredNum + " photos",
					star: 1,
					thumb0: data.starredThumb0,
					thumb1: data.starredThumb1,
					thumb2: data.starredThumb2
				};

				data.publicAlbum = {
					id: "s",
					title: "Public",
					sysdate: data.publicNum + " photos",
					public: 1,
					thumb0: data.publicThumb0,
					thumb1: data.publicThumb1,
					thumb2: data.publicThumb2
				};

				data.recentAlbum = {
					id: "r",
					title: "Recent",
					sysdate: data.recentNum + " photos",
					recent: 1,
					thumb0: data.recentThumb0,
					thumb1: data.recentThumb1,
					thumb2: data.recentThumb2
				};

				albums.json = data;

				durationTime = (new Date().getTime() - startTime);
				if (durationTime>300) waitTime = 0; else waitTime = 300 - durationTime;
				if (!visible.albums()&&!visible.photo()&&!visible.album()) waitTime = 0;
				if (visible.album()&&lychee.content.html()==="") waitTime = 0;

				setTimeout(function() {
					view.header.mode("albums");
					view.albums.init();
					lychee.animate(".album:nth-child(-n+50), .photo:nth-child(-n+50)", "contentZoomIn");
				}, waitTime);
			});

		} else {

			setTimeout(function() {
				view.header.mode("albums");
				view.albums.init();
				lychee.animate(".album:nth-child(-n+50), .photo:nth-child(-n+50)", "contentZoomIn");
			}, 300);

		}
	},

	parse: function(album) {

		if (album.password&&lychee.publicMode) {
			album.thumb0 = "assets/img/password.svg";
			album.thumb1 = "assets/img/password.svg";
			album.thumb2 = "assets/img/password.svg";
		} else {
			if (!album.thumb0) album.thumb0 = "assets/img/no_images.svg";
			if (!album.thumb1) album.thumb1 = "assets/img/no_images.svg";
			if (!album.thumb2) album.thumb2 = "assets/img/no_images.svg";
		}

	},

	refresh: function() {

		albums.json = null;

	}

};