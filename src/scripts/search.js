/**
 * @description	Searches through your photos and albums.
 * @copyright	2015 by Tobias Reich
 */

search = {

	hash: null

}

search.find = function(term) {

	var albumsData	= '',
		photosData	= '',
		html		= '';

	clearTimeout($(window).data('timeout'));
	$(window).data('timeout', setTimeout(function() {

		if ($('#search').val().length!==0) {

			api.post('search', { term }, function(data) {

				// Build albums
				if (data&&data.albums) {
					albums.json = { albums: data.albums };
					$.each(albums.json.albums, function() {
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
				if (albumsData===''&&photosData==='')	html = 'error';
				else if (albumsData==='')				html = build.divider('Photos') + photosData;
				else if (photosData==='')				html = build.divider('Albums') + albumsData;
				else									html = build.divider('Photos') + photosData + build.divider('Albums') + albumsData;

				// Only refresh view when search results are different
				if (search.hash!==data.hash) {

					$('.no_content').remove();

					lychee.animate('#content', 'contentZoomOut');

					search.hash = data.hash;

					setTimeout(function() {

						if (html==='error') {
							lychee.content.html('');
							$('body').append(build.no_content('magnifying-glass'));
						} else {
							lychee.content.html(html);
							lychee.animate('#content', 'contentZoomIn');
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

	if (search.hash!==null) {

		// Trash data
		albums.json	= null;
		album.json	= null;
		photo.json	= null;
		search.hash	= null;

		lychee.animate('.divider', 'fadeOut');
		albums.load();

	}

}