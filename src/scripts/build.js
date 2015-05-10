/**
 * @description	This module is used to generate HTML-Code.
 * @copyright	2015 by Tobias Reich
 */

window.build = {}

build.iconic = function(icon, classes) {

	var html = '';

	classes	= classes || '';

	html =	`
			<svg class='iconic ${ classes }'>
				<use xlink:href='#${ icon }' />
			</svg>
			`

	return html;

}

build.divider = function(title) {

	var html = '';

	html =	`
			<div class='divider'>
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
		longTitle	= '';

	if (title!==null&&title.length>18) {

		title		= data.title.substr(0, 18) + '...';
		longTitle	= data.title;

	}

	var {path: thumbPath, hasRetina: thumbRetina} = lychee.retinize(data.thumbs[0]);

	html =	`
			<div class='album' data-id='${ data.id }'>
				<img src='${ data.thumbs[2] }' width='200' height='200' alt='thumb' data-retina='false'>
				<img src='${ data.thumbs[1] }' width='200' height='200' alt='thumb' data-retina='false'>
				<img src='${ thumbPath }' width='200' height='200' alt='thumb' data-retina='${ thumbRetina }'>
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
		if (data.password==='1')	html += `<a class='badge'>${ build.iconic('lock-locked') }</a>`;

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

	var {path: thumbPath, hasRetina: thumbRetina} = lychee.retinize(data.thumbUrl);

	html =	`
			<div class='photo' data-album-id='${ data.album }' data-id='${ data.id }'>
				<img src='${ thumbPath }' width='200' height='200' alt='thumb'>
				<div class='overlay'>
					<h1 title='${ longTitle }'>${ title }</h1>
			`

	if (data.cameraDate==='1')	html += `<a><span title='Camera Date'>${ build.iconic('camera-slr') }</span>${ data.sysdate }</a>`;
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
		case 'question-mark':		html += '<p>Photo not found</p>';
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

build.tags = function(tags) {

	var html			= '',
		editTagsHTML	= '';

	if (tags!=='') {

		tags = tags.split(',');

		tags.forEach(function(tag, index, array) {
			html += `<a class='tag'>${ tag }<span data-index='${ index }'>${ build.iconic('x') }</span></a>`
		});

	} else {

		html = `<div class='empty'>No Tags</div>`;

	}

	return html;

}