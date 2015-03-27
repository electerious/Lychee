###
# @description	This module is used to generate HTML-Code.
# @copyright	2014 by Tobias Reich
###

_b = i18n.build

window.build = {}

build.divider = (title) ->

	"<div class='divider fadeIn'><h1>#{ title }</h1></div>"

build.editIcon = (id) ->

	"<div id='#{ id }' class='edit'><a class='icon-pencil'></a></div>"

build.multiselect = (top, left) ->

	"<div id='multiselect' style='top: #{ top }px; left: #{ left }px;'></div>"

build.album = (data) ->

	return '' if not data?

	title     = data.title
	longTitle = ''
	typeThumb = ''

	if title? and title.length > 18

		title     = data.title.substr(0, 18) + '&hellip;'
		longTitle = data.title

	if data.thumb0.split('.').pop() is 'svg' then typeThumb = 'nonretina'

	html =	"""
			<div  class='album' data-id='#{ data.id }' data-password='#{ data.password }'>
				<img src='#{ data.thumb2 }' width='200' height='200' alt='thumb' data-type='nonretina'>
				<img src='#{ data.thumb1 }' width='200' height='200' alt='thumb' data-type='nonretina'>
				<img src='#{ data.thumb0 }' width='200' height='200' alt='thumb' data-type='#{ typeThumb }'>
				<div class='overlay'>
			"""

	if data.password and lychee.publicMode is false
		html += "<h1 title='#{ longTitle }'><span class='icon-lock'></span> #{ title }</h1>"
	else
		html += "<h1 title='#{ longTitle }'>#{ title }</h1>"

	html +=	"""
					<a>#{ data.sysdate }</a>
				</div>
			""" # the date is localized in the loading process, because of smart albums that have count instead of date

	if lychee.publicMode is false

		if data.star is '1' then     html += "<a class='badge icon-star'></a>"
		if data.public is '1' then   html += "<a class='badge icon-share'></a>"
		if data.unsorted is '1' then html += "<a class='badge icon-reorder'></a>"
		if data.recent is '1' then   html += "<a class='badge icon-time'></a>"

	html += "</div>"

	return html

build.photo = (data) ->

	return '' if not data?

	title     = data.title
	longTitle = ''

	if title? and title.length > 18

		title     = data.title.substr(0, 18) + '&hellip;'
		longTitle = data.title

	html =	"""
			<div class='photo' data-album-id='#{ data.album }' data-id='#{ data.id }'>
				<img src='#{ data.thumbUrl }' width='200' height='200' alt='thumb'>
				<div class='overlay'>
					<h1 title='#{ longTitle }'>#{ title }</h1>
			"""

	if data.cameraDate is '1'
		html += "<a><span class='icon-camera' title='" + _b.photoDate() + "'></span>#{ data.sysdate }</a>"
	else
		html += "<a>#{ lychee.localizeDate(data.sysdate) }</a>"

	html += "</div>"

	if data.star is '1' then html += "<a class='badge icon-star'></a>"
	if lychee.publicMode is false and data.public is '1' and album.json.public isnt '1' then html += "<a class='badge icon-share'></a>"

	html += "</div>"

	return html

build.imageview = (data, size, visibleControls) ->

	return '' if not data?

	html =	"""
			<div class='arrow_wrapper previous'><a id='previous' class='icon-caret-left'></a></div>
			<div class='arrow_wrapper next'><a id='next' class='icon-caret-right'></a></div>
			"""

	if size is 'big'

		if visibleControls is true
			html += "<div id='image' style='background-image: url(#{ data.url })'></div>"
		else
			html += "<div id='image' style='background-image: url(#{ data.url });' class='full'></div>"

	else if size is 'medium'

		if visibleControls is true
			html += "<div id='image' style='background-image: url(#{ data.medium })'></div>"
		else
			html += "<div id='image' style='background-image: url(#{ data.medium });' class='full'></div>"

	else if size is 'small'

		if visibleControls is true
			html += "<div id='image' class='small' style='background-image: url(#{ data.url }); width: #{ data.width }px; height: #{ data.height }px; margin-top: -#{ parseInt(data.height/2-20) }px; margin-left: -#{ data.width/2 }px;'></div>"
		else
			html += "<div id='image' class='small' style='background-image: url(#{ data.url }); width: #{ data.width }px; height: #{ data.height }px; margin-top: -#{ parseInt(data.height/2) }px; margin-left: -#{ data.width/2 }px;'></div>"

	return html

build.no_content = (typ) ->

	html =	"""
			<div class='no_content fadeIn'>
				<a class='icon icon-#{ typ }'></a>
			"""

	switch typ
		when 'search' then html += "<p>#{_b.noSearch()}</p>"
		when 'share' then  html += "<p>#{_b.noShare()}</p>"
		when 'cog' then    html += "<p>#{_b.noCog()}</p>"

	html += "</div>"

	return html

build.modal = (title, text, button, marginTop, closeButton) ->

	if marginTop? then custom_style = "style='margin-top: #{ marginTop }px;'"
	else               custom_style = ''

	html =	"""
			<div class='message_overlay fadeIn'>
				<div class='message center' #{ custom_style }>
					<h1>#{ title }</h1>
			"""

	if closeButton isnt false then html += "<a class='close icon-remove-sign'></a>"

	html += "<p>#{ text }</p>"

	$.each button, (index) ->

		if this[0] isnt ''

			if index is 0 then html += "<a class='button active'>#{ this[0] }</a>"
			else               html += "<a class='button'>#{ this[0] }</a>"

	html +=	"""
				</div>
			</div>
			"""

	return html

build.signInModal = ->

	html =	"""
			<div class='message_overlay'>
				<div class='message center'>
					<h1><a class='icon-lock'></a> #{_b.signIn()}</h1>
					<a class='close icon-remove-sign'></a>
					<div class='sign_in'>
						<input id='username' type='text' value='' placeholder='#{_b.username()}' autocapitalize='off' autocorrect='off'>
						<input id='password' type='password' value='' placeholder='#{_b.password()}'>
					</div>
					<div id='version'>#{_b.version()} #{ lychee.version }<span> &#8211; <a target='_blank' href='#{ lychee.updateURL }'>#{_b.updateAvail()}</a><span></div>
					<a onclick='lychee.login()' class='button active'>#{_b.signIn()}</a>
				</div>
			</div>
			"""

	return html

build.uploadModal = (title, files) ->

	html =	"""
			<div class='upload_overlay fadeIn'>
				<div class='upload_message center'>
					<h1>#{ title }</h1>
					<a class='close icon-remove-sign'></a>
					<div class='rows'>
			"""

	i		= 0
	file	= null

	while i < files.length

		file = files[i]

		if file.name.length > 40
			file.name = file.name.substr(0, 17) + '&hellip;' + file.name.substr(file.name.length-20, 20)

		html +=	"""
				<div class='row'>
					<a class='name'>#{ lychee.escapeHTML(file.name) }</a>
				"""

		if file.supported is true then html += "<a class='status'></a>"
		else                           html += "<a class='status error'>#{_b.notSupported()}</a>"

		html +=	"""
					<p class='notice'></p>
				</div>
				"""

		i++

	html +=	"""
					</div>
				</div>
			</div>
			"""

	return html

build.tags = (tags, forView) ->

	html = ''

	if forView is true or lychee.publicMode is true then editTagsHTML = ''
	else                                                 editTagsHTML = ' ' + build.editIcon('edit_tags')

	if tags isnt ''

		tags = tags.split ','

		tags.forEach (tag, index, array) ->
			html += "<a class='tag'>#{ tag }<span class='icon-remove' data-index='#{ index }'></span></a>"

		html += editTagsHTML

	else

		html = "<div class='empty'>#{_b.noTags()}#{ editTagsHTML }</div>"

	return html

build.infoboxPhoto = (data, forView) ->

	html =	"""
			<div class='header'><h1>#{_b.about()}</h1><a class='icon-remove-sign'></a></div>
			<div class='wrapper'>
			"""

	switch data.public
		when '0' then visible = _b.no()
		when '1' then visible = _b.yes()
		when '2' then visible = _b.yesAlbum()
		else          visible = '-'

	if forView is true or lychee.publicMode is true then editTitleHTML = ''
	else                                                 editTitleHTML = ' ' + build.editIcon('edit_title')

	if forView is true or lychee.publicMode is true then editDescriptionHTML = ''
	else                                                 editDescriptionHTML = ' ' + build.editIcon('edit_description')

	infos = [
		['', _b.basics()]
		[_b.title(), data.title + editTitleHTML]
		[_b.uploaded(), lychee.localizeDate(data.sysdate)]
		[_b.description(), data.description + editDescriptionHTML]
		['', _b.image()]
		[_b.size(), data.size]
		[_b.format(), data.type]
		[_b.resolution(), data.width + ' x ' + data.height]
		[_b.tags(), build.tags(data.tags, forView)]
	]

	exifHash = data.takestamp+data.make+data.model+data.shutter+data.aperture+data.focal+data.iso

	if exifHash isnt '0' or exifHash isnt '0'

		infos = infos.concat [
			['', _b.camera()]
			[_b.takedate(), lychee.localizeDate(data.takedate)]
			[_b.make(), data.make]
			[_b.model(), data.model]
			[_b.shutter(), data.shutter]
			[_b.aperture(), data.aperture]
			[_b.focal(), data.focal]
			[_b.iso(), data.iso]
		]

	infos = infos.concat [
		['', _b.share()]
		[_b.public(), visible]
	]

	infos.forEach (info, i, items) ->

		if	info[1] is '' or
			not info[1]?

				info[1] = '-'

		switch info[0]

			when ''

				# Separator
				html +=	"""
						</table>
						<div class='separator'><h1>#{ info[1] }</h1></div>
						<table>
						"""

			when _b.tags()

				# Tags
				if forView isnt true and lychee.publicMode is false

					html +=	"""
							</table>
							<div class='separator'><h1>#{ info[0] }</h1></div>
							<div id='tags'>#{ info[1] }</div>
							"""

			else

				# Item
				html += """
						<tr>
							<td>#{ info[0] }</td>
							<td class='attr_#{ info[0].toLowerCase() }'>#{ info[1] }</td>
						</tr>
						"""

	html +=	"""
			</table>
			<div class='bumper'></div>
			</div>
			"""

	return html

build.infoboxAlbum = (data, forView) ->

	html =	"""
			<div class='header'><h1>#{_b.about()}</h1><a class='icon-remove-sign'></a></div>
			<div class='wrapper'>
			"""

	switch data.public
		when '0' then visible = _b.no()
		when '1' then visible = _b.yes()
		else          visible = '-'

	switch data.password
		when false then password = _b.no()
		when true then  password = _b.yes()
		else            password = '-'

	switch data.downloadable
		when '0' then downloadable = _b.no()
		when '1' then downloadable = _b.yes()
		else          downloadable = '-'

	if forView is true or lychee.publicMode is true then editTitleHTML = ''
	else                                                 editTitleHTML = ' ' + build.editIcon('edit_title_album')

	if forView is true or lychee.publicMode is true then editDescriptionHTML = ''
	else                                                 editDescriptionHTML = ' ' + build.editIcon('edit_description_album')

	infos = [
		['', _b.basics()]
		[_b.title(), data.title + editTitleHTML]
		[_b.description(), data.description + editDescriptionHTML]
		['', _b.album()]
		[_b.created(), lychee.localizeDate(data.sysdate)]
		[_b.images(), data.num]
		['', _b.share()]
		[_b.public(), visible]
		[_b.downloadable(), downloadable]
		[_b.usesPassword(), password]
	]

	infos.forEach (info, i, items) ->

		if info[0] is ''

			# Separator
			html +=	"""
					</table>
					<div class='separator'><h1>#{ info[1] }</h1></div>
					<table id='infos'>
					"""

		else

			# Item
			html += """
					<tr>
						<td>#{ info[0] }</td>
						<td class='attr_#{ info[0].toLowerCase() }'>#{ info[1] }</td>
					</tr>
					"""

	html += """
			</table>
			<div class='bumper'></div>
			</div>
			"""

	return html
