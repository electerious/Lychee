/**
 * @description	Responsible to reflect data changes to the UI.
 * @copyright	2015 by Tobias Reich
 */

view = {}

view.infobox = {

	show: function() {

		if (!visible.infobox()) $('body').append("<div id='infobox_overlay' class='fadeIn'></div>");
		lychee.infobox.addClass('active');

	},

	hide: function() {

		lychee.animate('#infobox_overlay', 'fadeOut');
		setTimeout(function() { $('#infobox_overlay').remove() }, 300);
		lychee.infobox.removeClass('active');

	}

}

view.albums = {

	init: function() {

		view.albums.title();
		view.albums.content.init();

	},

	title: function() {

		lychee.setTitle('Albums', false);

	},

	content: {

		scrollPosition: 0,

		init: function() {

			var smartData	= '',
				albumsData	= '';

			/* Smart Albums */
			albums.parse(albums.json.unsortedAlbum);
			albums.parse(albums.json.publicAlbum);
			albums.parse(albums.json.starredAlbum);
			albums.parse(albums.json.recentAlbum);
			if (!lychee.publicMode) smartData = build.divider('Smart Albums') + build.album(albums.json.unsortedAlbum) + build.album(albums.json.starredAlbum) + build.album(albums.json.publicAlbum) + build.album(albums.json.recentAlbum);

			/* Albums */
			if (albums.json.content&&albums.json.num!==0) {

				$.each(albums.json.content, function() {
					albums.parse(this);

					// Display albums in reverse order
					albumsData = build.album(this) + albumsData;
				});

				if (!lychee.publicMode) albumsData = build.divider('Albums') + albumsData;

			}

			if (smartData===''&&albumsData==='') {
				lychee.content.html('');
				$('body').append(build.no_content('eye'));
			} else {
				lychee.content.html(smartData + albumsData);
			}

			$('img[data-type!="nonretina"]').retina();

			// Restore scroll position
			if (view.albums.content.scrollPosition!==null) {
				$(document).scrollTop(view.albums.content.scrollPosition);
			}

		},

		title: function(albumID) {

			var longTitle	= '',
				title		= albums.json.content[albumID].title;

			if (title!==null&&title.length>18) {
				longTitle	= title;
				title		= title.substr(0, 18) + '...';
			}

			$('.album[data-id="' + albumID + '"] .overlay h1')
				.html(title)
				.attr('title', longTitle);

		},

		delete: function(albumID) {

			$('.album[data-id="' + albumID + '"]').css('opacity', 0).animate({
				width:		0,
				marginLeft:	0
			}, 300, function() {
				$(this).remove();
				if (albums.json.num<=0) lychee.animate('.divider:last-of-type', 'fadeOut');
			});

		}

	}

}

view.album = {

	init: function() {

		album.parse();

		view.album.infobox();
		view.album.title();
		view.album.public();
		view.album.content.init();

		album.json.init = 1;

	},

	hide: function() {

		view.infobox.hide();

	},

	title: function() {

		if ((visible.album()||!album.json.init)&&!visible.photo()) {

			switch (album.getID()) {
				case 'f':
					lychee.setTitle('Starred', false);
					break;
				case 's':
					lychee.setTitle('Public', false);
					break;
				case 'r':
					lychee.setTitle('Recent', false);
					break;
				case '0':
					lychee.setTitle('Unsorted', false);
					break;
				default:
					if (album.json.init) $('#infobox .attr_title').html(album.json.title + ' ' + build.editIcon('edit_title_album'));
					lychee.setTitle(album.json.title, true);
					break;
			}

		}

	},

	content: {

		init: function() {

			var photosData = '';

			// Save and reset scroll position
			view.albums.content.scrollPosition = $(document).scrollTop();
			$('html, body').scrollTop(0);

			$.each(album.json.content, function() {
				photosData += build.photo(this);
			});
			lychee.content.html(photosData);

			$('img[data-type!="svg"]').retina();

		},

		title: function(photoID) {

			var longTitle	= '',
				title		= album.json.content[photoID].title;

			if (title!==null&&title.length>18) {
				longTitle	= title;
				title		= title.substr(0, 18) + '...';
			}

			$('.photo[data-id="' + photoID + '"] .overlay h1')
				.html(title)
				.attr('title', longTitle);

		},

		star: function(photoID) {

			$('.photo[data-id="' + photoID + '"] .iconic-star').remove();
			if (album.json.content[photoID].star==1) $('.photo[data-id="' + photoID + '"]').append("<a class='badge iconic-star'>" + build.iconic('star') + "</a>");

		},

		public: function(photoID) {

			$('.photo[data-id="' + photoID + '"] .iconic-share').remove();
			if (album.json.content[photoID].public==1) $('.photo[data-id="' + photoID + '"]').append("<a class='badge iconic-share'>" + build.iconic('eye') + "</a>");

		},

		delete: function(photoID) {

			$('.photo[data-id="' + photoID + '"]').css('opacity', 0).animate({
				width:		0,
				marginLeft:	0
			}, 300, function() {
				$(this).remove();
				// Only when search is not active
				if (!visible.albums()) {
					album.json.num--;
					view.album.num();
					view.album.title();
				}
			});

		}

	},

	description: function() {

		$('#infobox .attr_description').html(album.json.description + ' ' + build.editIcon('edit_description_album'));

	},

	num: function() {

		$('#infobox .attr_images').html(album.json.num);

	},

	public: function() {

		if (album.json.public==1) {

			$('#button_share_album')
				.addClass('active')
				.attr('title', 'Share Album');

			$('.photo .iconic-share').remove();

			if (album.json.init) $('#infobox .attr_visibility').html('Public');

		} else {

			$('#button_share_album')
				.removeClass('active')
				.attr('title', 'Make Public');

			if (album.json.init) $('#infobox .attr_visibility').html('Private');
		}

	},

	password: function() {

		if (album.json.password==1)	$('#infobox .attr_password').html('Yes');
		else						$('#infobox .attr_password').html('No');

	},

	infobox: function() {

		if ((visible.album()||!album.json.init)&&!visible.photo()) lychee.infobox.find('.wrapper').html(build.infoboxAlbum(album.json));

	}

}

view.photo = {

	init: function() {

		photo.parse();

		view.photo.infobox();
		view.photo.title();
		view.photo.star();
		view.photo.public();
		view.photo.photo();

		photo.json.init = 1;

	},

	show: function() {

		// Change header
		lychee.content.addClass('view');
		header.setMode('photo');

		// Make body not scrollable
		$('body').css('overflow', 'hidden');

		// Fullscreen
		$(document)
			.bind('mouseenter', header.show)
			.bind('mouseleave', header.hide);

		lychee.animate(lychee.imageview, 'fadeIn');

	},

	hide: function() {

		header.show();
		if (visible.infobox) view.infobox.hide();

		lychee.content.removeClass('view');
		header.setMode('album');

		// Make body scrollable
		$('body').css('overflow', 'auto');

		// Disable Fullscreen
		$(document)
			.unbind('mouseenter')
			.unbind('mouseleave');

		// Hide Photo
		lychee.animate(lychee.imageview, 'fadeOut');
		setTimeout(function() {
			lychee.imageview.hide();
			view.album.infobox();
		}, 300);

	},

	title: function() {

		if (photo.json.init) $('#infobox .attr_title').html(photo.json.title + ' ' + build.editIcon('edit_title'));
		lychee.setTitle(photo.json.title, true);

	},

	description: function() {

		if (photo.json.init) $('#infobox .attr_description').html(photo.json.description + ' ' + build.editIcon('edit_description'));

	},

	star: function() {

		if (photo.json.star==1) {
			// Starred
			$('#button_star')
				.addClass('active')
				.attr('title', 'Unstar Photo');
		} else {
			// Unstarred
			$('#button_star').removeClass('active');
			$('#button_star').attr('title', 'Star Photo');
		}

	},

	public: function() {

		if (photo.json.public==1||photo.json.public==2) {
			// Photo public
			$('#button_share')
				.addClass('active')
				.attr('title', 'Share Photo');
			if (photo.json.init) $('#infobox .attr_visibility').html('Public');
		} else {
			// Photo private
			$('#button_share')
				.removeClass('active')
				.attr('title', 'Make Public');
			if (photo.json.init) $('#infobox .attr_visibility').html('Private');
		}

	},

	tags: function() {

		$('#infobox #tags').html(build.tags(photo.json.tags));

	},

	photo: function() {

		lychee.imageview.html(build.imageview(photo.json, photo.getSize(), visible.controls()));

		var $nextArrow		= lychee.imageview.find('a#next'),
			$previousArrow	= lychee.imageview.find('a#previous'),
			hasNext			= album.json&&album.json.content&&album.json.content[photo.getID()]&&album.json.content[photo.getID()].nextPhoto==='',
			hasPrevious		= album.json&&album.json.content&&album.json.content[photo.getID()]&&album.json.content[photo.getID()].previousPhoto==='';

		if (hasNext||lychee.viewMode) { $nextArrow.hide(); }
		else {

			var nextPhotoID	= album.json.content[photo.getID()].nextPhoto,
				nextPhoto	= album.json.content[nextPhotoID];

			$nextArrow.css('background-image', 'linear-gradient(to bottom, rgba(0, 0, 0, .4), rgba(0, 0, 0, .4)), url("' + nextPhoto.thumbUrl + '")');

		}

		if (hasPrevious||lychee.viewMode) { $previousArrow.hide(); }
		else {

			var previousPhotoID	= album.json.content[photo.getID()].previousPhoto,
				previousPhoto	= album.json.content[previousPhotoID];

			$previousArrow.css('background-image', 'linear-gradient(to bottom, rgba(0, 0, 0, .4), rgba(0, 0, 0, .4)), url("' + previousPhoto.thumbUrl + '")');

		};

	},

	infobox: function() {

		lychee.infobox.find('.wrapper').html(build.infoboxPhoto(photo.json));

	}

}