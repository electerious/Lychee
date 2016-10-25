/**
 * @description Takes care of every action albums can handle and execute.
 */

albums = {

	json: null

}

albums.load = function() {

	let startTime = new Date().getTime()

	lychee.animate('.content', 'contentZoomOut')

	if (albums.json===null) {

		let params = {
			parent: 0
		}

		api.post('Albums::get', params, function(data) {

			let waitTime = 0

			// Smart Albums
			if (lychee.publicMode===false) albums._createSmartAlbums(data.smartalbums)

			albums.json = data

			// Calculate delay
			let durationTime = (new Date().getTime() - startTime)
			if (durationTime>300) waitTime = 0
			else                  waitTime = 300 - durationTime

			// Skip delay when opening a blank Lychee
			if (!visible.albums() && !visible.photo() && !visible.album()) waitTime = 0
			if (visible.album() && lychee.content.html()==='')             waitTime = 0

			setTimeout(() => {
				header.setMode('albums')
				view.albums.init()
				lychee.animate(lychee.content, 'contentZoomIn')
			}, waitTime)

		})

	} else {

		setTimeout(() => {
			header.setMode('albums')
			view.albums.init()
			lychee.animate(lychee.content, 'contentZoomIn')
		}, 300)

	}
}

albums.parse = function(album) {

	if (album.password==='1' && lychee.publicMode===true) {
		album.thumbs[0] = 'src/images/password.svg'
		album.thumbs[1] = 'src/images/password.svg'
		album.thumbs[2] = 'src/images/password.svg'
	} else {
		if (!album.thumbs[0]) album.thumbs[0] = 'src/images/no_images.svg'
		if (!album.thumbs[1]) album.thumbs[1] = 'src/images/no_images.svg'
		if (!album.thumbs[2]) album.thumbs[2] = 'src/images/no_images.svg'
	}

}

albums._createSmartAlbums = function(data) {

	data.unsorted = {
		id       : 0,
		title    : 'Unsorted',
		sysdate  : data.unsorted.num + ' photos',
		unsorted : '1',
		thumbs   : data.unsorted.thumbs
	}

	data.starred = {
		id      : 'f',
		title   : 'Starred',
		sysdate : data.starred.num + ' photos',
		star    : '1',
		thumbs  : data.starred.thumbs
	}

	data.public = {
		id      : 's',
		title   : 'Public',
		sysdate : data.public.num + ' photos',
		public  : '1',
		thumbs  : data.public.thumbs
	}

	data.recent = {
		id      : 'r',
		title   : 'Recent',
		sysdate : data.recent.num + ' photos',
		recent  : '1',
		thumbs  : data.recent.thumbs
	}

}

albums.getByID = function(albumID) {

	// Function returns the JSON of an album

	if (albumID==null)       return undefined
	if (albumID instanceof Array)
		albumID = albumID[0]

	let json = undefined

	let func = function() {
		if (this.id==albumID) json = this
	}

	if (albums.json && albums.json.albums) {
		$.each(albums.json.albums, func)
	}
	else if (album.subjson && album.subjson.albums) {
		$.each(album.subjson.albums, func)
	}

	return json

}

albums.deleteByID = function(albumID) {

	// Function returns the JSON of an album

	if (albumID==null)       return false
	if (!albums.json)        return false
	if (!albums.json.albums) return false

	let deleted = false

	$.each(albums.json.albums, function(i) {

		if (albums.json.albums[i].id==albumID) {
			albums.json.albums.splice(i, 1)
			deleted = true
			return false
		}

	})

	return deleted

}

albums.refresh = function() {

	albums.json = null

}