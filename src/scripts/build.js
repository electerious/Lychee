/**
 * @description	This module is used to generate HTML-Code.
 * @copyright	2015 by Tobias Reich
 */

window.build = {}

build.iconic = function(icon, classes, file) {

	var html	= '',
		path	= 'src/images/';

	file	= file		|| 'iconic';
	classes	= classes	|| '';

	html =	`
			<svg viewBox='0 0 8 8' class='iconic ${ classes }'>
				<use xlink:href='${ path }${ file }.svg#${ icon }' />
			</svg>
			`

	return html;

}

build.divider = function(title) {

	var html = '';

	html =	`
			<div class='divider fadeIn'>
				<h1>${ title }</h1>
			</div>
			`

	return html;

}

build.editIcon = function(id) {

	var html = '';

	html =	`<div id='${ id }' class='edit'>${ build.iconic('pencil') }</div>`

	return html;

}

build.multiselect = function(top, left) {

	var html = '';

	html =	`<div id='multiselect' style='top: ${ top }px; left: ${ left }px;'></div>`

	return html;

}

build.album = function(data) {

	if (data===null||data===undefined) return '';

	var html		= '',
		title		= data.title,
		longTitle	= '',
		typeThumb	= '';

	if (title!==null&&title.length>18) {

		title		= data.title.substr(0, 18) + '...';
		longTitle	= data.title;

	}

	if (data.thumb0.split('.').pop()==='svg') typeThumb = 'nonretina';

	html =	`
			<div  class='album' data-id='${ data.id }' data-password='${ data.password }'>
				<img src='${ data.thumb2 }' width='200' height='200' alt='thumb' data-type='nonretina'>
				<img src='${ data.thumb1 }' width='200' height='200' alt='thumb' data-type='nonretina'>
				<img src='${ data.thumb0 }' width='200' height='200' alt='thumb' data-type='${ typeThumb }'>
				<div class='overlay'>
				<h1 title='${ longTitle }'>${ title }</h1>
				<a>${ data.sysdate }</a>
				</div>
			`

	if (lychee.publicMode===false) {

		if (data.star==='1')		html += `<a class='badge icn-star'>${ build.iconic('star') }</a>`;
		if (data.public==='1')		html += `<a class='badge icn-share'>${ build.iconic('eye') }</a>`;
		if (data.unsorted==='1')	html += `<a class='badge'>${ build.iconic('list') }</a>`;
		if (data.recent==='1')		html += `<a class='badge'>${ build.iconic('clock') }</a>`;
		if (data.password===true)	html += `<a class='badge'>${ build.iconic('lock-locked') }</a>`;

	}

	html += '</div>'

	return html;

}

build.photo = function(data) {

	if (data===null||data===undefined) return '';

	var html		= '',
		title		= data.title,
		longTitle	= '';

	if (title!==null&&title.length>18) {

		title		= data.title.substr(0, 18) + '...';
		longTitle	= data.title;

	}

	html =	`
			<div class='photo' data-album-id='${ data.album }' data-id='${ data.id }'>
				<img src='${ data.thumbUrl }' width='200' height='200' alt='thumb'>
				<div class='overlay'>
					<h1 title='${ longTitle }'>${ title }</h1>
			`

	if (data.cameraDate===1)	html += `<a><span title='Camera Date'>${ build.iconic('camera-slr') }</span>${ data.sysdate }</a>`;
	else						html += `<a>${ data.sysdate }</a>`;

	html += '</div>';

	if (lychee.publicMode===false) {

		if (data.star==='1') html += `<a class='badge iconic-star'>${ build.iconic('star') }</a>`;
		if (data.public==='1'&&album.json.public!=='1') html += `<a class='badge iconic-share'>${ build.iconic('eye') }</a>`;

	}

	html += '</div>';

	return html

}

build.imageview = function(data, size, visibleControls) {

	if (data===null||data===undefined) return '';

	var html = '';

	html =	`
			<div class='arrow_wrapper arrow_wrapper--previous'><a id='previous'>${ build.iconic('caret-left') }</a></div>
			<div class='arrow_wrapper arrow_wrapper--next'><a id='next'>${ build.iconic('caret-right') }</a></div>
			`

	if (size==='big') {

		if (visibleControls===true)
			html += `<div id='image' style='background-image: url(${ data.url })'></div>`;
		else
			html += `<div id='image' style='background-image: url(${ data.url });' class='full'></div>`;

	} else if (size==='medium') {

		if (visibleControls===true)
			html += `<div id='image' style='background-image: url(${ data.medium })'></div>`;
		else
			html += `<div id='image' style='background-image: url(${ data.medium });' class='full'></div>`;

	} else if (size==='small') {

		if (visibleControls===true)
			html += `<div id='image' class='small' style='background-image: url(${ data.url }); width: ${ data.width }px; height: ${ data.height }px; margin-top: -${ parseInt(data.height/2-20) }px; margin-left: -${ data.width/2 }px;'></div>`;
		else
			html += `<div id='image' class='small' style='background-image: url(${ data.url }); width: ${ data.width }px; height: ${ data.height }px; margin-top: -${ parseInt(data.height/2) }px; margin-left: -${ data.width/2 }px;'></div>`;

	}

	return html;

}

build.no_content = function(typ) {

	var html;

	html =	`
			<div class='no_content fadeIn'>
				${ build.iconic(typ) }
			`

	switch (typ) {
		case 'magnifying-glass':	html += '<p>No results</p>';
									break;
		case 'eye':					html += '<p>No public albums</p>';
									break;
		case 'cog':					html += '<p>No configuration</p>';
									break;
	}

	html += '</div>';

	return html;

}

build.uploadModal = function(title, files) {

	var html	= '',
		i		= 0,
		file	= null;

	html =	`
			<h1>${ title }</h1>
			<div class='rows'>
			`

	while (i<files.length) {

		file = files[i];

		if (file.name.length>40) file.name = file.name.substr(0, 17) + '...' + file.name.substr(file.name.length-20, 20);

		html +=	`
				<div class='row'>
					<a class='name'>${ lychee.escapeHTML(file.name) }</a>
				`

		if (file.supported===true)	html += `<a class='status'></a>`;
		else						html += `<a class='status error'>Not supported</a>`;

		html +=	`
					<p class='notice'></p>
				</div>
				`

		i++;

	}

	html +=	'</div>';

	return html;

}

build.tags = function(tags, forView) {

	var html			= '',
		editTagsHTML	= '';

	if (forView!==true&&lychee.publicMode!==true) editTagsHTML = ' ' + build.editIcon('edit_tags');

	if (tags!=='') {

		tags = tags.split(',');

		tags.forEach(function(tag, index, array) {
			html += `<a class='tag'>${ tag }<span data-index='${ index }'>${ build.iconic('x') }</span></a>`
		});

		html += editTagsHTML;

	} else {

		html = `<div class='empty'>No Tags${ editTagsHTML }</div>`;

	}

	return html;

}

build.infoboxPhoto = function(data, forView) {

	var html				= '',
		visible				= '',
		editTitleHTML		= '',
		editDescriptionHTML	= '',
		exifHash			= '',
		info				= [];

	switch (data.public) {

		case '0':	visible = 'No';
					break;
		case '1':	visible = 'Yes';
					break;
		case '2':	visible = 'Yes (Album)';
					break;
		default:	visible = '-';
					break;

	}

	if (forView!==true&&lychee.publicMode!==true) {
		editTitleHTML		= ' ' + build.editIcon('edit_title');
		editDescriptionHTML	= ' ' + build.editIcon('edit_description');
	}

	infos = [
		['', 'Basics'],
		['Title', data.title + editTitleHTML],
		['Uploaded', data.sysdate],
		['Description', data.description + editDescriptionHTML],
		['', 'Image'],
		['Size', data.size],
		['Format', data.type],
		['Resolution', data.width + ' x ' + data.height],
		['Tags', build.tags(data.tags, forView)]
	]

	exifHash = data.takestamp+data.make+data.model+data.shutter+data.aperture+data.focal+data.iso;

	if (exifHash!=='0') {

		infos = infos.concat([
			['', 'Camera'],
			['Captured', data.takedate],
			['Make', data.make],
			['Type/Model', data.model],
			['Shutter Speed', data.shutter],
			['Aperture', data.aperture],
			['Focal Length', data.focal],
			['ISO', data.iso]
		]);

	}

	infos = infos.concat([
		['', 'Share'],
		['Public', visible]
	]);

	infos.forEach(function(info, i, items) {

		// Set default for empty values
		if (info[1]===''||info[1]===null||info[1]===undefined) info[1] = '-';

		switch (info[0]) {

			case '':

				// Divider
				html +=	`
						</table>
						<div class='divider'>
							<h1>${ info[1] }</h1>
						</div>
						<table>
						`

				break;

			case 'Tags':

				// Tags
				if (forView!==true&&lychee.publicMode===false) {

					html +=	`
							</table>
							<div class='divider'>
								<h1>${ info[0] }</h1>
							</div>
							<div id='tags'>${ info[1] }</div>
							`

				}

				break;

			default:

				// Item
				html += `
						<tr>
							<td>${ info[0] }</td>
							<td class='attr_${ info[0].toLowerCase() }'>${ info[1] }</td>
						</tr>
						`

				break;

		}


	});

	html +=	`
			</table>
			<div class='bumper'></div>
			`

	return html;

}

build.infoboxAlbum = function(data, forView) {

	var html				= '',
		visible				= '',
		password			= '',
		downloadable		= '',
		editTitleHTML		= '',
		editDescriptionHTML	= '',
		infos				= [];

	switch (data.public) {

		case '0':	visible = 'No';
					break;
		case '1': 	visible = 'Yes';
					break;
		default:	visible = '-';
					break;

	}

	switch (data.password) {

		case false:	password = 'No';
					break;
		case true:	password = 'Yes';
					break;
		default:	password = '-';
					break;

	}

	switch (data.downloadable) {

		case '0':	downloadable = 'No';
					break;
		case '1':	downloadable = 'Yes';
					break;
		default:	downloadable = '-';
					break;

	}

	if (forView!==true&&lychee.publicMode!==true) {
		editTitleHTML		= ' ' + build.editIcon('edit_title_album');
		editDescriptionHTML	= ' ' + build.editIcon('edit_description_album');
	}

	infos = [
		['', 'Basics'],
		['Title', data.title + editTitleHTML],
		['Description', data.description + editDescriptionHTML],
		['', 'Album'],
		['Created', data.sysdate],
		['Images', data.num],
		['', 'Share'],
		['Public', visible],
		['Downloadable', downloadable],
		['Password', password]
	]

	infos.forEach(function(info, i, items) {

		// Set default for empty values
		if (info[1]===''||info[1]===null||info[1]===undefined) info[1] = '-';

		if (info[0]==='') {

			// Divider
			html +=	`
					</table>
					<div class='divider'>
						<h1>${ info[1] }</h1>
					</div>
					<table id='infos'>
					`

		} else {

			// Item
			html += `
					<tr>
						<td>${ info[0] }</td>
						<td class='attr_${ info[0].toLowerCase() }'>${ info[1] }</td>
					</tr>
					`

		}

	});

	html += `
			</table>
			<div class='bumper'></div>
			`

	return html;

}