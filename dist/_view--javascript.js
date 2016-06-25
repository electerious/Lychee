"use strict";

var _templateObject = _taggedTemplateLiteral(["<svg class='iconic $", "'><use xlink:href='#$", "' /></svg>"], ["<svg class='iconic $", "'><use xlink:href='#$", "' /></svg>"]),
    _templateObject2 = _taggedTemplateLiteral(["<div class='divider'><h1>$", "</h1></div>"], ["<div class='divider'><h1>$", "</h1></div>"]),
    _templateObject3 = _taggedTemplateLiteral(["<div id='$", "' class='edit'>", "</div>"], ["<div id='$", "' class='edit'>", "</div>"]),
    _templateObject4 = _taggedTemplateLiteral(["<div id='multiselect' style='top: $", "px; left: $", "px;'></div>"], ["<div id='multiselect' style='top: $", "px; left: $", "px;'></div>"]),
    _templateObject5 = _taggedTemplateLiteral(["\n\t        <div class='album' data-id='$", "'>\n\t            <img src='$", "' width='200' height='200' alt='Photo thumbnail' data-overlay='false' draggable='false'>\n\t            <img src='$", "' width='200' height='200' alt='Photo thumbnail' data-overlay='false' draggable='false'>\n\t            <img src='$", "' srcset='$", " 1.5x' width='200' height='200' alt='Photo thumbnail' data-overlay='$", "' draggable='false'>\n\t            <div class='overlay'>\n\t                <h1 title='$", "'>$", "</h1>\n\t                <a>$", "</a>\n\t            </div>\n\t        "], ["\n\t        <div class='album' data-id='$", "'>\n\t            <img src='$", "' width='200' height='200' alt='Photo thumbnail' data-overlay='false' draggable='false'>\n\t            <img src='$", "' width='200' height='200' alt='Photo thumbnail' data-overlay='false' draggable='false'>\n\t            <img src='$", "' srcset='$", " 1.5x' width='200' height='200' alt='Photo thumbnail' data-overlay='$", "' draggable='false'>\n\t            <div class='overlay'>\n\t                <h1 title='$", "'>$", "</h1>\n\t                <a>$", "</a>\n\t            </div>\n\t        "]),
    _templateObject6 = _taggedTemplateLiteral(["\n\t\t        <div class='badges'>\n\t\t            <a class='badge $", " icn-star'>", "</a>\n\t\t            <a class='badge $", " icn-share'>", "</a>\n\t\t            <a class='badge $", "'>", "</a>\n\t\t            <a class='badge $", "'>", "</a>\n\t\t            <a class='badge $", "'>", "</a>\n\t\t        </div>\n\t\t        "], ["\n\t\t        <div class='badges'>\n\t\t            <a class='badge $", " icn-star'>", "</a>\n\t\t            <a class='badge $", " icn-share'>", "</a>\n\t\t            <a class='badge $", "'>", "</a>\n\t\t            <a class='badge $", "'>", "</a>\n\t\t            <a class='badge $", "'>", "</a>\n\t\t        </div>\n\t\t        "]),
    _templateObject7 = _taggedTemplateLiteral(["\n\t        <div class='photo' data-album-id='$", "' data-id='$", "'>\n\t            <img src='$", "' srcset='$", " 1.5x' width='200' height='200' alt='Photo thumbnail' draggable='false'>\n\t            <div class='overlay'>\n\t                <h1 title='$", "'>$", "</h1>\n\t        "], ["\n\t        <div class='photo' data-album-id='$", "' data-id='$", "'>\n\t            <img src='$", "' srcset='$", " 1.5x' width='200' height='200' alt='Photo thumbnail' draggable='false'>\n\t            <div class='overlay'>\n\t                <h1 title='$", "'>$", "</h1>\n\t        "]),
    _templateObject8 = _taggedTemplateLiteral(["<a><span title='Camera Date'>", "</span>$", "</a>"], ["<a><span title='Camera Date'>", "</span>$", "</a>"]),
    _templateObject9 = _taggedTemplateLiteral(["<a>$", "</a>"], ["<a>$", "</a>"]),
    _templateObject10 = _taggedTemplateLiteral(["\n\t\t        <div class='badges'>\n\t\t            <a class='badge $", " icn-star'>", "</a>\n\t\t            <a class='badge $", " icn-share'>", "</a>\n\t\t        </div>\n\t\t        "], ["\n\t\t        <div class='badges'>\n\t\t            <a class='badge $", " icn-star'>", "</a>\n\t\t            <a class='badge $", " icn-share'>", "</a>\n\t\t        </div>\n\t\t        "]),
    _templateObject11 = _taggedTemplateLiteral(["<img id='image' class='$", "' src='$", "' draggable='false'>"], ["<img id='image' class='$", "' src='$", "' draggable='false'>"]),
    _templateObject12 = _taggedTemplateLiteral(["<img id='image' class='$", "' src='$", "' srcset='$", " 1920w, $", " $", "w' draggable='false'>"], ["<img id='image' class='$", "' src='$", "' srcset='$", " 1920w, $", " $", "w' draggable='false'>"]),
    _templateObject13 = _taggedTemplateLiteral(["\n\t        <h1>$", "</h1>\n\t        <div class='rows'>\n\t        "], ["\n\t        <h1>$", "</h1>\n\t        <div class='rows'>\n\t        "]),
    _templateObject14 = _taggedTemplateLiteral(["\n\t\t        <div class='row'>\n\t\t            <a class='name'>$", "</a>\n\t\t            <a class='status'></a>\n\t\t            <p class='notice'></p>\n\t\t        </div>\n\t\t        "], ["\n\t\t        <div class='row'>\n\t\t            <a class='name'>$", "</a>\n\t\t            <a class='status'></a>\n\t\t            <p class='notice'></p>\n\t\t        </div>\n\t\t        "]),
    _templateObject15 = _taggedTemplateLiteral(["<a class='tag'>$", "<span data-index='$", "'>", "</span></a>"], ["<a class='tag'>$", "<span data-index='$", "'>", "</span></a>"]),
    _templateObject16 = _taggedTemplateLiteral(["$", "", ""], ["$", "", ""]),
    _templateObject17 = _taggedTemplateLiteral(["<span class='attr_$", "'>$", "</span>"], ["<span class='attr_$", "'>$", "</span>"]),
    _templateObject18 = _taggedTemplateLiteral(["\n\t\t\t         <tr>\n\t\t\t             <td>$", "</td>\n\t\t\t             <td>", "</td>\n\t\t\t         </tr>\n\t\t\t         "], ["\n\t\t\t         <tr>\n\t\t\t             <td>$", "</td>\n\t\t\t             <td>", "</td>\n\t\t\t         </tr>\n\t\t\t         "]),
    _templateObject19 = _taggedTemplateLiteral(["\n\t\t         <div class='sidebar__divider'>\n\t\t             <h1>$", "</h1>\n\t\t         </div>\n\t\t         <div id='tags'>\n\t\t             <div class='attr_$", "'>", "</div>\n\t\t             ", "\n\t\t         </div>\n\t\t         "], ["\n\t\t         <div class='sidebar__divider'>\n\t\t             <h1>$", "</h1>\n\t\t         </div>\n\t\t         <div id='tags'>\n\t\t             <div class='attr_$", "'>", "</div>\n\t\t             ", "\n\t\t         </div>\n\t\t         "]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function gup(b) {

	b = b.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

	var a = "[\\?&]" + b + "=([^&#]*)";
	var d = new RegExp(a);
	var c = d.exec(window.location.href);

	if (c === null) return '';else return c[1];
}
/**
 * @description This module is used to generate HTML-Code.
 * @copyright   2015 by Tobias Reich
 */

build = {};

build.iconic = function (icon) {
	var classes = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];


	var html = '';

	html += lychee.html(_templateObject, classes, icon);

	return html;
};

build.divider = function (title) {

	var html = '';

	html += lychee.html(_templateObject2, title);

	return html;
};

build.editIcon = function (id) {

	var html = '';

	html += lychee.html(_templateObject3, id, build.iconic('pencil'));

	return html;
};

build.multiselect = function (top, left) {

	return lychee.html(_templateObject4, top, left);
};

build.album = function (data) {

	var html = '';

	var _lychee$retinize = lychee.retinize(data.thumbs[0]);

	var retinaThumbUrl = _lychee$retinize.path;
	var isPhoto = _lychee$retinize.isPhoto;


	html += lychee.html(_templateObject5, data.id, data.thumbs[2], data.thumbs[1], data.thumbs[0], retinaThumbUrl, isPhoto, data.title, data.title, data.sysdate);

	if (lychee.publicMode === false) {

		html += lychee.html(_templateObject6, data.star === '1' ? 'badge--visible' : '', build.iconic('star'), data.public === '1' ? 'badge--visible' : '', build.iconic('eye'), data.unsorted === '1' ? 'badge--visible' : '', build.iconic('list'), data.recent === '1' ? 'badge--visible' : '', build.iconic('clock'), data.password === '1' ? 'badge--visible' : '', build.iconic('lock-locked'));
	}

	html += '</div>';

	return html;
};

build.photo = function (data) {

	var html = '';

	var _lychee$retinize2 = lychee.retinize(data.thumbUrl);

	var retinaThumbUrl = _lychee$retinize2.path;


	html += lychee.html(_templateObject7, data.album, data.id, data.thumbUrl, retinaThumbUrl, data.title, data.title);

	if (data.cameraDate === '1') html += lychee.html(_templateObject8, build.iconic('camera-slr'), data.sysdate);else html += lychee.html(_templateObject9, data.sysdate);

	html += "</div>";

	if (lychee.publicMode === false) {

		html += lychee.html(_templateObject10, data.star === '1' ? 'badge--visible' : '', build.iconic('star'), data.public === '1' && album.json.public !== '1' ? 'badge--visible' : '', build.iconic('eye'));
	}

	html += "</div>";

	return html;
};

build.imageview = function (data, visibleControls) {

	var html = '';
	var hasMedium = data.medium !== '';

	if (hasMedium === false) {

		html += lychee.html(_templateObject11, visibleControls === true ? '' : 'full', data.url);
	} else {

		html += lychee.html(_templateObject12, visibleControls === true ? '' : 'full', data.url, data.medium, data.url, data.width);
	}

	html += "\n\t        <div class='arrow_wrapper arrow_wrapper--previous'><a id='previous'>" + build.iconic('caret-left') + "</a></div>\n\t        <div class='arrow_wrapper arrow_wrapper--next'><a id='next'>" + build.iconic('caret-right') + "</a></div>\n\t        ";

	return html;
};

build.no_content = function (typ) {

	var html = '';

	html += "\n\t        <div class='no_content fadeIn'>\n\t            " + build.iconic(typ) + "\n\t        ";

	switch (typ) {
		case 'magnifying-glass':
			html += "<p>No results</p>";
			break;
		case 'eye':
			html += "<p>No public albums</p>";
			break;
		case 'cog':
			html += "<p>No configuration</p>";
			break;
		case 'question-mark':
			html += "<p>Photo not found</p>";
			break;
	}

	html += "</div>";

	return html;
};

build.uploadModal = function (title, files) {

	var html = '';

	html += lychee.html(_templateObject13, title);

	var i = 0;

	while (i < files.length) {

		var file = files[i];

		if (file.name.length > 40) file.name = file.name.substr(0, 17) + '...' + file.name.substr(file.name.length - 20, 20);

		html += lychee.html(_templateObject14, file.name);

		i++;
	}

	html += "</div>";

	return html;
};

build.tags = function (tags) {

	var html = '';

	if (tags !== '') {

		tags = tags.split(',');

		tags.forEach(function (tag, index, array) {
			html += lychee.html(_templateObject15, tag, index, build.iconic('x'));
		});
	} else {

		html = "<div class='empty'>No Tags</div>";
	}

	return html;
};
/**
 * @description This module communicates with Lychee's API
 * @copyright   2015 by Tobias Reich
 */

api = {

	path: 'php/index.php',
	onError: null

};

api.post = function (fn, params, callback) {

	loadingBar.show();

	params = $.extend({ function: fn }, params);

	var success = function success(data) {

		setTimeout(loadingBar.hide, 100);

		// Catch errors
		if (typeof data === 'string' && data.substring(0, 7) === 'Error: ') {
			api.onError(data.substring(7, data.length), params, data);
			return false;
		}

		callback(data);
	};

	var error = function error(jqXHR, textStatus, errorThrown) {

		api.onError('Server error or API not found.', params, errorThrown);
	};

	$.ajax({
		type: 'POST',
		url: api.path,
		data: params,
		dataType: 'json',
		success: success,
		error: error
	});
};
/**
 * @description This module takes care of the header.
 * @copyright   2015 by Tobias Reich
 */

header = {

	_dom: $('.header')

};

header.dom = function (selector) {

	if (selector == null || selector === '') return header._dom;
	return header._dom.find(selector);
};

header.bind = function () {

	// Event Name
	var eventName = lychee.getEventName();

	header.dom('.header__title').on(eventName, function (e) {

		if ($(this).hasClass('header__title--editable') === false) return false;

		if (visible.photo()) contextMenu.photoTitle(album.getID(), photo.getID(), e);else contextMenu.albumTitle(album.getID(), e);
	});

	header.dom('#button_share').on(eventName, function (e) {
		if (photo.json.public === '1' || photo.json.public === '2') contextMenu.sharePhoto(photo.getID(), e);else photo.setPublic(photo.getID(), e);
	});

	header.dom('#button_share_album').on(eventName, function (e) {
		if (album.json.public === '1') contextMenu.shareAlbum(album.getID(), e);else album.setPublic(album.getID(), true, e);
	});

	header.dom('#button_signin').on(eventName, lychee.loginDialog);
	header.dom('#button_settings').on(eventName, contextMenu.settings);
	header.dom('#button_info_album').on(eventName, sidebar.toggle);
	header.dom('#button_info').on(eventName, sidebar.toggle);
	header.dom('.button_add').on(eventName, contextMenu.add);
	header.dom('#button_more').on(eventName, function (e) {
		contextMenu.photoMore(photo.getID(), e);
	});
	header.dom('#button_move').on(eventName, function (e) {
		contextMenu.move([photo.getID()], e);
	});
	header.dom('.header__hostedwith').on(eventName, function () {
		window.open(lychee.website);
	});
	header.dom('#button_trash_album').on(eventName, function () {
		album.delete([album.getID()]);
	});
	header.dom('#button_trash').on(eventName, function () {
		photo.delete([photo.getID()]);
	});
	header.dom('#button_archive').on(eventName, function () {
		album.getArchive(album.getID());
	});
	header.dom('#button_star').on(eventName, function () {
		photo.setStar([photo.getID()]);
	});
	header.dom('#button_back_home').on(eventName, function () {
		lychee.goto();
	});
	header.dom('#button_back').on(eventName, function () {
		lychee.goto(album.getID());
	});

	header.dom('.header__search').on('keyup click', function () {
		search.find($(this).val());
	});
	header.dom('.header__clear').on(eventName, function () {
		header.dom('.header__search').focus();
		search.reset();
	});

	return true;
};

header.show = function () {

	clearTimeout($(window).data('timeout'));

	lychee.imageview.removeClass('full');
	header.dom().removeClass('header--hidden');

	return true;
};

header.hide = function (e) {
	var delay = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];


	if (visible.photo() && !visible.sidebar() && !visible.contextMenu() && basicModal.visible() === false) {

		clearTimeout($(window).data('timeout'));

		$(window).data('timeout', setTimeout(function () {

			lychee.imageview.addClass('full');
			header.dom().addClass('header--hidden');
		}, delay));

		return true;
	}

	return false;
};

header.setTitle = function () {
	var title = arguments.length <= 0 || arguments[0] === undefined ? 'Untitled' : arguments[0];


	var $title = header.dom('.header__title');
	var html = lychee.html(_templateObject16, title, build.iconic('caret-bottom'));

	$title.html(html);

	return true;
};

header.setMode = function (mode) {

	if (mode === 'albums' && lychee.publicMode === true) mode = 'public';

	switch (mode) {

		case 'public':

			header.dom().removeClass('header--view');
			header.dom('.header__toolbar--albums, .header__toolbar--album, .header__toolbar--photo').removeClass('header__toolbar--visible');
			header.dom('.header__toolbar--public').addClass('header__toolbar--visible');

			return true;
			break;

		case 'albums':

			header.dom().removeClass('header--view');
			header.dom('.header__toolbar--public, .header__toolbar--album, .header__toolbar--photo').removeClass('header__toolbar--visible');
			header.dom('.header__toolbar--albums').addClass('header__toolbar--visible');

			return true;
			break;

		case 'album':

			var albumID = album.getID();

			header.dom().removeClass('header--view');
			header.dom('.header__toolbar--public, .header__toolbar--albums, .header__toolbar--photo').removeClass('header__toolbar--visible');
			header.dom('.header__toolbar--album').addClass('header__toolbar--visible');

			// Hide download button when album empty
			if (album.json.content === false) $('#button_archive').hide();else $('#button_archive').show();

			// Hide download button when not logged in and album not downloadable
			if (lychee.publicMode === true && album.json.downloadable === '0') $('#button_archive').hide();

			if (albumID === 's' || albumID === 'f' || albumID === 'r') {
				$('#button_info_album, #button_trash_album, #button_share_album').hide();
			} else if (albumID === '0') {
				$('#button_info_album, #button_share_album').hide();
				$('#button_trash_album').show();
			} else {
				$('#button_info_album, #button_trash_album, #button_share_album').show();
			}

			return true;
			break;

		case 'photo':

			header.dom().addClass('header--view');
			header.dom('.header__toolbar--public, .header__toolbar--albums, .header__toolbar--album').removeClass('header__toolbar--visible');
			header.dom('.header__toolbar--photo').addClass('header__toolbar--visible');

			return true;
			break;

	}

	return false;
};

header.setEditable = function (editable) {

	var $title = header.dom('.header__title');

	// Hide editable icon when not logged in
	if (lychee.publicMode === true) editable = false;

	if (editable) $title.addClass('header__title--editable');else $title.removeClass('header__title--editable');

	return true;
};
/**
 * @description This module is used to check if elements are visible or not.
 * @copyright   2015 by Tobias Reich
 */

visible = {};

visible.albums = function () {
	if (header.dom('.header__toolbar--public').hasClass('header__toolbar--visible')) return true;
	if (header.dom('.header__toolbar--albums').hasClass('header__toolbar--visible')) return true;
	return false;
};

visible.album = function () {
	if (header.dom('.header__toolbar--album').hasClass('header__toolbar--visible')) return true;
	return false;
};

visible.photo = function () {
	if ($('#imageview.fadeIn').length > 0) return true;
	return false;
};

visible.search = function () {
	if (search.hash != null) return true;
	return false;
};

visible.sidebar = function () {
	if (sidebar.dom().hasClass('active') === true) return true;
	return false;
};

visible.sidebarbutton = function () {
	if (visible.photo()) return true;
	if (visible.album() && $('#button_info_album:visible').length > 0) return true;
	return false;
};

visible.header = function () {
	if (header.dom().hasClass('header--hidden') === true) return false;
	return true;
};

visible.contextMenu = function () {
	return basicContext.visible();
};

visible.multiselect = function () {
	if ($('#multiselect').length > 0) return true;
	return false;
};
/**
 * @description This module takes care of the sidebar.
 * @copyright   2015 by Tobias Reich
 */

sidebar = {

	_dom: $('.sidebar'),
	types: {
		DEFAULT: 0,
		TAGS: 1
	},
	createStructure: {}

};

sidebar.dom = function (selector) {

	if (selector == null || selector === '') return sidebar._dom;

	return sidebar._dom.find(selector);
};

sidebar.bind = function () {

	// This function should be called after building and appending
	// the sidebars content to the DOM.
	// This function can be called multiple times, therefore
	// event handlers should be removed before binding a new one.

	// Event Name
	var eventName = lychee.getEventName();

	sidebar.dom('#edit_title').off(eventName).on(eventName, function () {
		if (visible.photo()) photo.setTitle([photo.getID()]);else if (visible.album()) album.setTitle([album.getID()]);
	});

	sidebar.dom('#edit_description').off(eventName).on(eventName, function () {
		if (visible.photo()) photo.setDescription(photo.getID());else if (visible.album()) album.setDescription(album.getID());
	});

	sidebar.dom('#edit_tags').off(eventName).on(eventName, function () {
		photo.editTags([photo.getID()]);
	});

	sidebar.dom('#tags .tag span').off(eventName).on(eventName, function () {
		photo.deleteTag(photo.getID(), $(this).data('index'));
	});

	return true;
};

sidebar.toggle = function () {

	if (visible.sidebar() || visible.sidebarbutton()) {

		header.dom('.button--info').toggleClass('active');
		lychee.content.toggleClass('content--sidebar');
		sidebar.dom().toggleClass('active');

		return true;
	}

	return false;
};

sidebar.setSelectable = function () {
	var selectable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];


	// Attributes/Values inside the sidebar are selectable by default.
	// Selection needs to be deactivated to prevent an unwanted selection
	// while using multiselect.

	if (selectable === true) sidebar.dom().removeClass('notSelectable');else sidebar.dom().addClass('notSelectable');
};

sidebar.changeAttr = function (attr) {
	var value = arguments.length <= 1 || arguments[1] === undefined ? '-' : arguments[1];
	var dangerouslySetInnerHTML = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];


	if (attr == null || attr === '') return false;

	// Set a default for the value
	if (value == null || value === '') value = '-';

	// Escape value
	if (dangerouslySetInnerHTML === false) value = lychee.escapeHTML(value);

	// Set new value
	sidebar.dom('.attr_' + attr).html(value);

	return true;
};

sidebar.createStructure.photo = function (data) {

	if (data == null || data === '') return false;

	var editable = false;
	var exifHash = data.takestamp + data.make + data.model + data.shutter + data.aperture + data.focal + data.iso;
	var structure = {};
	var _public = '';

	// Enable editable when user logged in
	if (lychee.publicMode === false) editable = true;

	// Set value for public
	switch (data.public) {

		case '0':
			_public = 'No';
			break;
		case '1':
			_public = 'Yes';
			break;
		case '2':
			_public = 'Yes (Album)';
			break;
		default:
			_public = '-';
			break;

	}

	structure.basics = {
		title: 'Basics',
		type: sidebar.types.DEFAULT,
		rows: [{ title: 'Title', value: data.title, editable: editable }, { title: 'Uploaded', value: data.sysdate }, { title: 'Description', value: data.description, editable: editable }]
	};

	structure.image = {
		title: 'Image',
		type: sidebar.types.DEFAULT,
		rows: [{ title: 'Size', value: data.size }, { title: 'Format', value: data.type }, { title: 'Resolution', value: data.width + ' x ' + data.height }]
	};

	// Only create tags section when user logged in
	if (lychee.publicMode === false) {

		structure.tags = {
			title: 'Tags',
			type: sidebar.types.TAGS,
			value: build.tags(data.tags),
			editable: editable
		};
	} else {

		structure.tags = {};
	}

	// Only create EXIF section when EXIF data available
	if (exifHash !== '0') {

		structure.exif = {
			title: 'Camera',
			type: sidebar.types.DEFAULT,
			rows: [{ title: 'Captured', value: data.takedate }, { title: 'Make', value: data.make }, { title: 'Type/Model', value: data.model }, { title: 'Shutter Speed', value: data.shutter }, { title: 'Aperture', value: data.aperture }, { title: 'Focal Length', value: data.focal }, { title: 'ISO', value: data.iso }]
		};
	} else {

		structure.exif = {};
	}

	structure.sharing = {
		title: 'Sharing',
		type: sidebar.types.DEFAULT,
		rows: [{ title: 'Public', value: _public }]
	};

	// Construct all parts of the structure
	structure = [structure.basics, structure.image, structure.tags, structure.exif, structure.sharing];

	return structure;
};

sidebar.createStructure.album = function (data) {

	if (data == null || data === '') return false;

	var editable = false;
	var structure = {};
	var _public = '';
	var hidden = '';
	var downloadable = '';
	var password = '';

	// Enable editable when user logged in
	if (lychee.publicMode === false) editable = true;

	// Set value for public
	switch (data.public) {

		case '0':
			_public = 'No';
			break;
		case '1':
			_public = 'Yes';
			break;
		default:
			_public = '-';
			break;

	}

	// Set value for hidden
	switch (data.visible) {

		case '0':
			hidden = 'Yes';
			break;
		case '1':
			hidden = 'No';
			break;
		default:
			hidden = '-';
			break;

	}

	// Set value for downloadable
	switch (data.downloadable) {

		case '0':
			downloadable = 'No';
			break;
		case '1':
			downloadable = 'Yes';
			break;
		default:
			downloadable = '-';
			break;

	}

	// Set value for password
	switch (data.password) {

		case '0':
			password = 'No';
			break;
		case '1':
			password = 'Yes';
			break;
		default:
			password = '-';
			break;

	}

	structure.basics = {
		title: 'Basics',
		type: sidebar.types.DEFAULT,
		rows: [{ title: 'Title', value: data.title, editable: editable }, { title: 'Description', value: data.description, editable: editable }]
	};

	structure.album = {
		title: 'Album',
		type: sidebar.types.DEFAULT,
		rows: [{ title: 'Created', value: data.sysdate }, { title: 'Images', value: data.num }]
	};

	structure.share = {
		title: 'Share',
		type: sidebar.types.DEFAULT,
		rows: [{ title: 'Public', value: _public }, { title: 'Hidden', value: hidden }, { title: 'Downloadable', value: downloadable }, { title: 'Password', value: password }]
	};

	// Construct all parts of the structure
	structure = [structure.basics, structure.album, structure.share];

	return structure;
};

sidebar.render = function (structure) {

	if (structure == null || structure === '') return false;

	var html = '';

	var renderDefault = function renderDefault(section) {

		var _html = '';

		_html += "\n\t\t         <div class='sidebar__divider'>\n\t\t             <h1>" + section.title + "</h1>\n\t\t         </div>\n\t\t         <table>\n\t\t         ";

		section.rows.forEach(function (row) {

			var value = row.value;

			// Set a default for the value
			if (value === '' || value == null) value = '-';

			// Wrap span-element around value for easier selecting on change
			value = lychee.html(_templateObject17, row.title.toLowerCase(), value);

			// Add edit-icon to the value when editable
			if (row.editable === true) value += ' ' + build.editIcon('edit_' + row.title.toLowerCase());

			_html += lychee.html(_templateObject18, row.title, value);
		});

		_html += "\n\t\t         </table>\n\t\t         ";

		return _html;
	};

	var renderTags = function renderTags(section) {

		var _html = '';
		var editable = '';

		// Add edit-icon to the value when editable
		if (section.editable === true) editable = build.editIcon('edit_tags');

		_html += lychee.html(_templateObject19, section.title, section.title.toLowerCase(), section.value, editable);

		return _html;
	};

	structure.forEach(function (section) {

		if (section.type === sidebar.types.DEFAULT) html += renderDefault(section);else if (section.type === sidebar.types.TAGS) html += renderTags(section);
	});

	return html;
};
/**
 * @description Used to view single photos with view.php
 * @copyright   2015 by Tobias Reich
 */

// Sub-implementation of lychee -------------------------------------------------------------- //

var lychee = {};

lychee.content = $('.content');

lychee.escapeHTML = function () {
	var html = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];


	// Ensure that html is a string
	html += '';

	// Escape all critical characters
	html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/`/g, '&#96;');

	return html;
};

lychee.html = function (literalSections) {

	// Use raw literal sections: we don’t want
	// backslashes (\n etc.) to be interpreted
	var raw = literalSections.raw;
	var result = '';

	for (var _len = arguments.length, substs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		substs[_key - 1] = arguments[_key];
	}

	substs.forEach(function (subst, i) {

		// Retrieve the literal section preceding
		// the current substitution
		var lit = raw[i];

		// If the substitution is preceded by a dollar sign,
		// we escape special characters in it
		if (lit.slice(-1) === '$') {
			subst = lychee.escapeHTML(subst);
			lit = lit.slice(0, -1);
		}

		result += lit;
		result += subst;
	});

	// Take care of last literal section
	// (Never fails, because an empty template string
	// produces one literal section, an empty string)
	result += raw[raw.length - 1];

	return result;
};

lychee.getEventName = function () {

	var touchendSupport = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera) && 'ontouchend' in document.documentElement;
	var eventName = touchendSupport === true ? 'touchend' : 'click';

	return eventName;
};

// Sub-implementation of photo -------------------------------------------------------------- //

var photo = {};

photo.share = function (photoID, service) {

	var url = location.toString();

	switch (service) {
		case 'twitter':
			window.open("https://twitter.com/share?url=" + encodeURI(url));
			break;
		case 'facebook':
			window.open("http://www.facebook.com/sharer.php?u=" + encodeURI(url));
			break;
		case 'mail':
			location.href = "mailto:?subject=&body=" + encodeURI(url);
			break;
	}
};

photo.getDirectLink = function () {

	return $('#imageview img').attr('src').replace(/"/g, '').replace(/url\(|\)$/ig, '');
};

// Sub-implementation of contextMenu -------------------------------------------------------------- //

var contextMenu = {};

contextMenu.sharePhoto = function (photoID, e) {

	var iconClass = 'ionicons';

	var items = [{ title: build.iconic('twitter', iconClass) + 'Twitter', fn: function fn() {
			return photo.share(photoID, 'twitter');
		} }, { title: build.iconic('facebook', iconClass) + 'Facebook', fn: function fn() {
			return photo.share(photoID, 'facebook');
		} }, { title: build.iconic('envelope-closed') + 'Mail', fn: function fn() {
			return photo.share(photoID, 'mail');
		} }, { title: build.iconic('link-intact') + 'Direct Link', fn: function fn() {
			return window.open(photo.getDirectLink(), '_newtab');
		} }];

	basicContext.show(items, e.originalEvent);
};

// Main -------------------------------------------------------------- //

var loadingBar = {
	show: function show() {},
	hide: function hide() {}
};
var imageview = $('#imageview');

$(document).ready(function () {

	// Save ID of photo
	var photoID = gup('p');

	// Set API error handler
	api.onError = error;

	// Share
	header.dom('#button_share').on('click', function (e) {
		contextMenu.sharePhoto(photoID, e);
	});

	// Infobox
	header.dom('#button_info').on('click', sidebar.toggle);

	// Load photo
	loadPhotoInfo(photoID);
});

var loadPhotoInfo = function loadPhotoInfo(photoID) {

	var params = {
		photoID: photoID,
		albumID: 0,
		password: ''
	};

	api.post('Photo::get', params, function (data) {

		if (data === 'Warning: Photo private!' || data === 'Warning: Wrong password!') {

			$('body').append(build.no_content('question-mark'));
			$('body').removeClass('view');
			header.dom().remove();
			return false;
		}

		// Set title
		if (!data.title) data.title = 'Untitled';
		document.title = 'Lychee - ' + data.title;
		header.dom('.header__title').html(lychee.escapeHTML(data.title));

		// Render HTML
		imageview.html(build.imageview(data, true));
		imageview.find('.arrow_wrapper').remove();
		imageview.addClass('fadeIn').show();

		// Render Sidebar
		var structure = sidebar.createStructure.photo(data);
		var html = sidebar.render(structure);

		sidebar.dom('.sidebar__wrapper').html(html);
		sidebar.bind();
	});
};

var error = function error(errorThrown, params, data) {

	console.error({
		description: errorThrown,
		params: params,
		response: data
	});

	loadingBar.show('error', errorThrown);
};