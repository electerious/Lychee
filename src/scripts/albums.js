/**
 * @description	Takes care of every action albums can handle and execute.
 * @copyright	2015 by Tobias Reich
 */

albums = {

	json: null

}

albums.load = function() {

	var startTime,
		durationTime,
		waitTime;

	lychee.animate('#content', 'contentZoomOut');

	startTime = new Date().getTime();

	if (albums.json===null) {

		api.post('Album::getAll', {}, function(data) {

			/* Smart Albums */
			if (lychee.publicMode===false) albums._createSmartAlbums(data.smartalbums);

			albums.json = data;

			// Calculate delay
			durationTime = (new Date().getTime() - startTime);
			if (durationTime>300)	waitTime = 0;
			else					waitTime = 300 - durationTime;

			// Skip delay when opening a blank Lychee
			if (!visible.albums()&&!visible.photo()&&!visible.album())	waitTime = 0;
			if (visible.album()&&lychee.content.html()==='')			waitTime = 0;

			setTimeout(function() {
				header.setMode('albums');
				view.albums.init();
				lychee.animate('#content', 'contentZoomIn');
			}, waitTime);
		});

	} else {

		setTimeout(function() {
			header.setMode('albums');
			view.albums.init();
			lychee.animate('#content', 'contentZoomIn');
		}, 300);

	}
}

albums.parse = function(album) {

	if (album.password==='1'&&lychee.publicMode===true) {
		album.thumbs[0] = 'src/images/password.svg';
		album.thumbs[1] = 'src/images/password.svg';
		album.thumbs[2] = 'src/images/password.svg';
	} else {
		if (!album.thumbs[0])	album.thumbs[0]	= 'src/images/no_images.svg';
		if (!album.thumbs[1])	album.thumbs[1]	= 'src/images/no_images.svg';
		if (!album.thumbs[2])	album.thumbs[2]	= 'src/images/no_images.svg';
	}

}

albums._createSmartAlbums = function(data) {

	data.unsorted = {
		id:			0,
		title:		'Unsorted',
		sysdate:	data.unsorted.num + ' photos',
		unsorted: 	'1',
		thumbs:		data.unsorted.thumbs
	};

	data.starred = {
		id:			'f',
		title:		'Starred',
		sysdate:	data.starred.num + ' photos',
		star:		'1',
		thumbs:		data.starred.thumbs
	};

	data.public = {
		id:			's',
		title:		'Public',
		sysdate:	data.public.num + ' photos',
		public:		'1',
		thumbs:		data.public.thumbs
	};

	data.recent = {
		id:			'r',
		title:		'Recent',
		sysdate:	data.recent.num + ' photos',
		recent:		'1',
		thumbs:		data.recent.thumbs
	};

}

albums.refresh = function() {

	albums.json = null;

}