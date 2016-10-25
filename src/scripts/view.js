/**
 * @description Responsible to reflect data changes to the UI.
 */

view = {}

view.albums = {

	init: function() {

		view.albums.title()
		view.albums.content.init()

	},

	title: function() {

		lychee.setTitle('Albums', false)

	},

	content: {

		scrollPosition: 0,

		init: function() {

			let smartData  = ''
			let albumsData = ''

			// Smart Albums
			if (lychee.publicMode===false) {

				albums.parse(albums.json.smartalbums.unsorted)
				albums.parse(albums.json.smartalbums.public)
				albums.parse(albums.json.smartalbums.starred)
				albums.parse(albums.json.smartalbums.recent)

				smartData = build.divider('Smart Albums') + build.album(albums.json.smartalbums.unsorted) + build.album(albums.json.smartalbums.public) + build.album(albums.json.smartalbums.starred) + build.album(albums.json.smartalbums.recent)

			}

			// Albums
			if (albums.json.albums && albums.json.num!==0) {

				$.each(albums.json.albums, function() {
					albums.parse(this)
					albumsData += build.album(this)
				})

				// Add divider
				if (lychee.publicMode===false) albumsData = build.divider('Albums') + albumsData

			}

			if (smartData==='' && albumsData==='') {
				lychee.content.html('')
				$('body').append(build.no_content('eye'))
			} else {
				lychee.content.html(smartData + albumsData)
			}

			// Restore scroll position
			if (view.albums.content.scrollPosition!=null && view.albums.content.scrollPosition!==0) {
				$(document).scrollTop(view.albums.content.scrollPosition)
			}

		},

		title: function(albumID) {

			let title = albums.getByID(albumID).title

			title = lychee.escapeHTML(title)

			$('.album[data-id="' + albumID + '"] .overlay h1')
				.html(title)
				.attr('title', title)

		},

		delete: function(albumID) {

			$('.album[data-id="' + albumID + '"]').css('opacity', 0).animate({
				width      : 0,
				marginLeft : 0
			}, 300, function() {
				$(this).remove()
				if (albums.json.num<=0) lychee.content.find('.divider:last-child').remove()
			})

		}

	}

}

view.album = {

	init: function() {

		album.parse()

		view.album.sidebar()
		view.album.title()
		view.album.public()
		view.album.content.init()

		album.json.init = 1

	},

	title: function() {

		if ((visible.album() || !album.json.init) && !visible.photo()) {

			switch (album.getID()) {
				case 'f':
					lychee.setTitle('Starred', false)
					break
				case 's':
					lychee.setTitle('Public', false)
					break
				case 'r':
					lychee.setTitle('Recent', false)
					break
				case '0':
					lychee.setTitle('Unsorted', false)
					break
				default:
					if (album.json.init) sidebar.changeAttr('title', album.json.title)
					lychee.setTitle(album.json.title, true)
					break
			}

		}

	},

	content: {

		init: function() {

			let photosData = ''

			// Sub albums
			if (album.subjson && album.subjson.albums && album.subjson.num!==0) {

				photosData = build.divider('Albums')

				$.each(album.subjson.albums, function() {
					albums.parse(this)
					photosData += build.album(this)
				})

			}

			if (album.json.content && album.json.content!==false) {

				photosData += build.divider('Photos', 'divider-photos')

				// Build photos
				$.each(album.json.content, function() {
					photosData += build.photo(this)
				})

			}

			// Save and reset scroll position
			view.albums.content.scrollPosition = $(document).scrollTop()
			requestAnimationFrame(() => $(document).scrollTop(0))

			// Add photos to view
			lychee.content.html(photosData)

		},

		title: function(photoID) {

			let ntitle = ''
			let prefix = ''

			if (album.json.content[photoID]) {

				prefix = '.photo'
				ntitle = album.json.content[photoID].title

			} else {

				prefix = '.album'

				for (i in album.subjson.albums) {
					if (album.subjson.albums[i].id==photoID) {
						ntitle = album.subjson.albums[i].title
						break
					}
				}

			}

			ntitle = lychee.escapeHTML(ntitle)

			$(prefix + '[data-id="' + photoID + '"] .overlay h1')
				.html(ntitle)
				.attr('title', ntitle)

		},

		star: function(photoID) {

			let $badge = $('.photo[data-id="' + photoID + '"] .icn-star')

			if (album.json.content[photoID].star==='1') $badge.addClass('badge--visible')
			else                                        $badge.removeClass('badge--visible')

		},

		public: function(photoID) {

			let $badge = $('.photo[data-id="' + photoID + '"] .icn-share')

			if (album.json.content[photoID].public==='1') $badge.addClass('badge--visible')
			else                                          $badge.removeClass('badge--visible')

		},

		delete: function(photoID) {

			$('.photo[data-id="' + photoID + '"]').css('opacity', 0).animate({
				width      : 0,
				marginLeft : 0
			}, 300, function() {
				$(this).remove()
				// Only when search is not active
				if (!visible.albums()) {
					album.json.num--
					view.album.num()
					if (album.json.num == 0) $('#divider-photos').hide()
				}
			})

		}

	},

	description: function() {

		sidebar.changeAttr('description', album.json.description)

	},

	num: function() {

		sidebar.changeAttr('images', album.json.num)

	},

	public: function() {

		if (album.json.public==='1') {

			$('#button_share_album')
				.addClass('active')
				.attr('title', 'Share Album')

			$('.photo .iconic-share').remove()

			if (album.json.init) sidebar.changeAttr('public', 'Yes')

		} else {

			$('#button_share_album')
				.removeClass('active')
				.attr('title', 'Make Public')

			if (album.json.init) sidebar.changeAttr('public', 'No')

		}

	},

	hidden: function() {

		if (album.json.visible==='1') sidebar.changeAttr('hidden', 'No')
		else                          sidebar.changeAttr('hidden', 'Yes')

	},

	downloadable: function() {

		if (album.json.downloadable==='1') sidebar.changeAttr('downloadable', 'Yes')
		else                               sidebar.changeAttr('downloadable', 'No')

	},

	password: function() {

		if (album.json.password==='1') sidebar.changeAttr('password', 'Yes')
		else                           sidebar.changeAttr('password', 'No')

	},

	sidebar: function() {

		if ((visible.album() || !album.json.init) && !visible.photo()) {

			let structure = sidebar.createStructure.album(album.json)
			let html      = sidebar.render(structure)

			sidebar.dom('.sidebar__wrapper').html(html)
			sidebar.bind()

		}

	}

}

view.photo = {

	init: function() {

		photo.parse()

		view.photo.sidebar()
		view.photo.title()
		view.photo.star()
		view.photo.public()
		view.photo.photo()

		photo.json.init = 1

	},

	show: function() {

		// Change header
		lychee.content.addClass('view')
		header.setMode('photo')

		// Make body not scrollable
		$('body').css('overflow', 'hidden')

		// Fullscreen
		let timeout = null
		$(document).bind('mousemove', function() {
			clearTimeout(timeout)
			header.show()
			timeout = setTimeout(header.hide, 2500)
		})

		lychee.animate(lychee.imageview, 'fadeIn')

	},

	hide: function() {

		header.show()

		lychee.content.removeClass('view')
		header.setMode('album')

		// Make body scrollable
		$('body').css('overflow', 'auto')

		// Disable Fullscreen
		$(document).unbind('mousemove')

		// Hide Photo
		lychee.animate(lychee.imageview, 'fadeOut')
		setTimeout(() => {
			lychee.imageview.hide()
			view.album.sidebar()
		}, 300)

	},

	title: function() {

		if (photo.json.init) sidebar.changeAttr('title', photo.json.title)
		lychee.setTitle(photo.json.title, true)

	},

	description: function() {

		if (photo.json.init) sidebar.changeAttr('description', photo.json.description)

	},

	star: function() {

		if (photo.json.star==='1') {

			// Starred
			$('#button_star')
				.addClass('active')
				.attr('title', 'Unstar Photo')

		} else {

			// Unstarred
			$('#button_star').removeClass('active')
			$('#button_star').attr('title', 'Star Photo')

		}

	},

	public: function() {

		if (photo.json.public==='1' || photo.json.public==='2') {

			// Photo public
			$('#button_share')
				.addClass('active')
				.attr('title', 'Share Photo')

			if (photo.json.init) sidebar.changeAttr('public', 'Yes')

		} else {

			// Photo private
			$('#button_share')
				.removeClass('active')
				.attr('title', 'Make Public')

			if (photo.json.init) sidebar.changeAttr('public', 'No')

		}

	},

	tags: function() {

		sidebar.changeAttr('tags', build.tags(photo.json.tags), true)
		sidebar.bind()

	},

	photo: function() {

		lychee.imageview.html(build.imageview(photo.json, visible.header()))

		let $nextArrow     = lychee.imageview.find('a#next')
		let $previousArrow = lychee.imageview.find('a#previous')
		let photoID        = photo.getID()
		let hasNext        = album.json && album.json.content && album.json.content[photoID] && album.json.content[photoID].nextPhoto!=null && album.json.content[photoID].nextPhoto!==''
		let hasPrevious    = album.json && album.json.content && album.json.content[photoID] && album.json.content[photoID].previousPhoto!=null && album.json.content[photoID].previousPhoto!==''

		if (hasNext===false || lychee.viewMode===true) {

			$nextArrow.hide()

		} else {

			let nextPhotoID = album.json.content[photoID].nextPhoto
			let nextPhoto   = album.json.content[nextPhotoID]

			$nextArrow.css('background-image', lychee.html`linear-gradient(to bottom, rgba(0, 0, 0, .4), rgba(0, 0, 0, .4)), url("$${ nextPhoto.thumbUrl }")`)

		}

		if (hasPrevious===false || lychee.viewMode===true) {

			$previousArrow.hide()

		} else {

			let previousPhotoID = album.json.content[photoID].previousPhoto
			let previousPhoto   = album.json.content[previousPhotoID]

			$previousArrow.css('background-image', lychee.html`linear-gradient(to bottom, rgba(0, 0, 0, .4), rgba(0, 0, 0, .4)), url("$${ previousPhoto.thumbUrl }")`)

		}

	},

	sidebar: function() {

		let structure = sidebar.createStructure.photo(photo.json)
		let html      = sidebar.render(structure)

		sidebar.dom('.sidebar__wrapper').html(html)
		sidebar.bind()

	}

}