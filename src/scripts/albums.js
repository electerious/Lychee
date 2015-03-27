/**
 * @description	Takes care of every action albums can handle and execute.
 * @copyright	2014 by Tobias Reich
 */

var _as = i18n.albums;

albums = {

	json: null

}

albums.load = function() {

	var startTime,
		durationTime,
		waitTime;

	lychee.animate('.album, .photo', 'contentZoomOut');
	lychee.animate('.divider', 'fadeOut');

	startTime = new Date().getTime();

	if (albums.json===null) {

		lychee.api('getAlbums', function(data) {

			for (var key in data.content) {
				if (data.content.hasOwnProperty(key)) {
					var album = data.content[key];
					album.sysdate = lychee.localizeMonth(album.sysdate);
				}
			}

			/* Smart Albums */
			data.unsortedAlbum = {
				id:       0,
				title:    _as.unsorted(),
				sysdate:  _as.photos({NUM_PHOTOS: data.unsortedNum || 0}),
				unsorted: '1',
				thumb0:   data.unsortedThumb0,
				thumb1:   data.unsortedThumb1,
				thumb2:   data.unsortedThumb2
			};

			data.starredAlbum = {
				id:      'f',
				title:   _as.starred(),
				sysdate: _as.photos({NUM_PHOTOS: data.starredNum || 0}),
				star:    '1',
				thumb0:  data.starredThumb0,
				thumb1:  data.starredThumb1,
				thumb2:  data.starredThumb2
			};

			data.publicAlbum = {
				id:      's',
				title:   _as.public(),
				sysdate: _as.photos({NUM_PHOTOS: data.publicNum || 0}),
				public:  '1',
				thumb0:  data.publicThumb0,
				thumb1:  data.publicThumb1,
				thumb2:  data.publicThumb2
			};

			data.recentAlbum = {
				id:      'r',
				title:   _as.recent(),
				sysdate: _as.photos({NUM_PHOTOS: data.recentNum || 0}),
				recent:  '1',
				thumb0:  data.recentThumb0,
				thumb1:  data.recentThumb1,
				thumb2:  data.recentThumb2
			};

			albums.json = data;

			// Calculate delay
			durationTime = (new Date().getTime() - startTime);
			if (durationTime>300) waitTime = 0;
			else                  waitTime = 300 - durationTime;

			// Skip delay when opening a blank Lychee
			if (!visible.albums()&&!visible.photo()&&!visible.album()) waitTime = 0;
			if (visible.album()&&lychee.content.html()==='')           waitTime = 0;

			setTimeout(function() {
				view.header.mode('albums');
				view.albums.init();
				lychee.animate('.album, .photo', 'contentZoomIn');
			}, waitTime);
		});

	} else {

		setTimeout(function() {
			view.header.mode('albums');
			view.albums.init();
			lychee.animate('.album, .photo', 'contentZoomIn');
		}, 300);

	}
}

albums.parse = function(album) {

	if (album.password&&lychee.publicMode) {
		album.thumb0 = 'src/images/password.svg';
		album.thumb1 = 'src/images/password.svg';
		album.thumb2 = 'src/images/password.svg';
	} else {
		if (!album.thumb0) album.thumb0 = 'src/images/no_images.svg';
		if (!album.thumb1) album.thumb1 = 'src/images/no_images.svg';
		if (!album.thumb2) album.thumb2 = 'src/images/no_images.svg';
	}

}

albums.refresh = function() {

	albums.json = null;

}
