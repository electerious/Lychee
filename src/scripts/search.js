/**
 * @description	Searches through your photos and albums.
 * @copyright	2015 by Tobias Reich
 */

search = {

	code: null

}

search.find = function(term) {

	var albumsData = '',
		photosData = '',
		code;

	clearTimeout($(window).data('timeout'));
	$(window).data('timeout', setTimeout(function() {

		if ($('#search').val().length!==0) {

			api.post('search', { term }, function(data) {

				// Build albums
				if (data&&data.albums) {
					albums.json = { content: data.albums };
					$.each(albums.json.content, function() {
						albums.parse(this);
						albumsData += build.album(this);
					});
				}

				// Build photos
				if (data&&data.photos) {
					album.json = { content: data.photos };
					$.each(album.json.content, function() {
						photosData += build.photo(this);
					});
				}

				// 1. No albums and photos found
				// 2. Only photos found
				// 3. Only albums found
				// 4. Albums and photos found
				if (albumsData===''&&photosData==='')	code = 'error';
				else if (albumsData==='')				code = build.divider('Photos') + photosData;
				else if (photosData==='')				code = build.divider('Albums') + albumsData;
				else									code = build.divider('Photos') + photosData + build.divider('Albums') + albumsData;

				// Only refresh view when search results are different
				if (search.code!==md5(code)) {

					$('.no_content').remove();

					lychee.animate('.album, .photo', 'contentZoomOut');
					lychee.animate('.divider', 'fadeOut');

					search.code = md5(code);

					setTimeout(function() {

						if (code==='error') {
							lychee.content.html('');
							$('body').append(build.no_content('magnifying-glass'));
						} else {
							lychee.content.html(code);
							lychee.animate('.album, .photo', 'contentZoomIn');
							$('img[data-type!="svg"]').retina();
						}

					}, 300);

				}

			});

		} else search.reset();

	}, 250));

}

search.reset = function() {

	$('#search').val('');
	$('.no_content').remove();

	if (search.code!=='') {

		// Trash data
		albums.json	= null;
		album.json	= null;
		photo.json	= null;
		search.code	= '';

		lychee.animate('.divider', 'fadeOut');
		albums.load();

	}

}