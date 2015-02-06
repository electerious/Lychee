/**
 * @description	This module provides the basic functions of Lychee.
 * @copyright	2015 by Tobias Reich
 */

lychee = {

	title:			document.title,
	version:		'3.0.0',
	version_code:	'030000',

	update_path:	'http://lychee.electerious.com/version/index.php',
	updateURL:		'https://github.com/electerious/Lychee',
	website:		'http://lychee.electerious.com',

	publicMode:		false,
	viewMode:		false,
	debugMode:		false,

	checkForUpdates:false,
	username:		'',
	sorting:		'',
	location:		'',

	dropbox:		false,
	dropboxKey:		'',

	loadingBar:		$('#loading'),
	content:		$('#content'),
	imageview:		$('#imageview'),
	infobox:		$('#infobox')

}

lychee.init = function() {

	var params;

	params = {
		version: lychee.version_code
	}

	api.post('Session::init', params, function(data) {

		if (data.loggedIn!==true) {
			lychee.setMode('public');
		} else {
			lychee.username		= data.config.username		|| '';
			lychee.sorting		= data.config.sorting		|| '';
			lychee.dropboxKey	= data.config.dropboxKey	|| '';
			lychee.location		= data.config.location		|| '';
		}

		// No configuration
		if (data==='Warning: No configuration!') {
			header.dom().hide();
			lychee.content.hide();
			$('body').append(build.no_content('cog'));
			settings.createConfig();
			return true;
		}

		// No login
		if (data.config.login===false) {
			settings.createLogin();
		}

		lychee.checkForUpdates = data.config.checkForUpdates;
		$(window).bind('popstate', lychee.load);
		lychee.load();

	});

}

lychee.login = function(data) {

	var user		= data.username,
		password	= md5(data.password),
		params;

	params = {
		user,
		password
	}

	api.post('Session::login', params, function(data) {

		if (data===true) {

			// Use 'try' to catch a thrown error when Safari is in private mode
			try { localStorage.setItem('lychee_username', user); }
			catch (err) {}

			window.location.reload();

		} else {

			// Show error and reactive button
			basicModal.error('password');

		}

	});

}

lychee.loginDialog = function() {

	var localUsername,
		msg = '';

	msg =	`
			<p class='signIn'>
				<input class='text' data-name='username' type='text' value='' placeholder='username' autocapitalize='off' autocorrect='off'>
				<input class='text' data-name='password' type='password' value='' placeholder='password'>
			</p>
			<p class='version'>Lychee ${ lychee.version }<span> &#8211; <a target='_blank' href='${ lychee.updateURL }'>Update available!</a><span></p>
			`

	basicModal.show({
		body: msg,
		buttons: {
			action: {
				title: 'Sign In',
				fn: lychee.login
			},
			cancel: {
				title: 'Cancel',
				fn: basicModal.close
			}
		}
	});

	if (localStorage) {
		localUsername = localStorage.getItem('lychee_username');
		if (localUsername!==null) {
			if (localUsername.length>0) $('.basicModal input[data-name="username"]').val(localUsername);
			$('.basicModal input[data-name="password"]').focus();
		}
	}

	if (lychee.checkForUpdates==='1') lychee.getUpdate();

}

lychee.logout = function() {

	api.post('Session::logout', {}, function() {
		window.location.reload();
	});

}

lychee.goto = function(url) {

	if (url===undefined)	url = '#';
	else					url = '#' + url;

	history.pushState(null, null, url);
	lychee.load();

}

lychee.load = function() {

	var albumID	= '',
		photoID	= '',
		hash	= document.location.hash.replace('#', '').split('/');

	$('.no_content').remove();
	contextMenu.close();
	multiselect.close();

	if (hash[0]!==undefined) albumID = hash[0];
	if (hash[1]!==undefined) photoID = hash[1];

	if (albumID&&photoID) {

		// Trash data
		photo.json = null;

		// Show Photo
		if (lychee.content.html()===''||
			($('#search').length&&$('#search').val().length!==0)) {
				lychee.content.hide();
				album.load(albumID, true);
		}
		photo.load(photoID, albumID);

	} else if (albumID) {

		// Trash data
		photo.json = null;

		// Show Album
		if (visible.photo()) view.photo.hide();
		if (album.json&&albumID==album.json.id) view.album.title();
		else album.load(albumID);

	} else {

		// Trash albums.json when filled with search results
		if (search.code!=='') {
			albums.json = null;
			search.code = '';
		}

		// Trash data
		album.json = null;
		photo.json = null;

		// Show Albums
		if (visible.album()) view.album.hide();
		if (visible.photo()) view.photo.hide();
		albums.load();

	}

}

lychee.getUpdate = function() {

	$.ajax({
		url: lychee.update_path,
		success: function(data) { if (parseInt(data)>parseInt(lychee.version_code)) $('.version span').show(); }
	});

}

lychee.setTitle = function(title, editable) {

	document.title = lychee.title + ' - ' + title;

	header.setEditable(editable);
	header.setTitle(title);

}

lychee.setMode = function(mode) {

	$('#button_settings, #button_settings, #button_search, #search, #button_trash_album, #button_share_album, .button_add, .button_divider').remove();
	$('#button_trash, #button_move, #button_share, #button_star').remove();

	$(document)
		.off('click',		'#title.editable')
		.off('touchend',	'#title.editable')
		.off('contextmenu',	'.photo')
		.off('contextmenu',	'.album')
		.off('drop');

	Mousetrap
		.unbind('u')
		.unbind('s')
		.unbind('f')
		.unbind('r')
		.unbind('d')
		.unbind('t')
		.unbind(['command+backspace', 'ctrl+backspace'])
		.unbind(['command+a', 'ctrl+a']);

	if (mode==='public') {

		header.dom('#button_signin, #hostedwith').show();
		lychee.publicMode = true;

	} else if (mode==='view') {

		Mousetrap.unbind(['esc', 'command+up']);
		$('#button_back, a#next, a#previous').remove();
		$('.no_content').remove();

		lychee.publicMode	= true;
		lychee.viewMode		= true;

	}

}

lychee.animate = function(obj, animation) {

	var animations = [
		['fadeIn', 'fadeOut'],
		['contentZoomIn', 'contentZoomOut']
	];

	if (!obj.jQuery) obj = $(obj);

	for (var i = 0; i < animations.length; i++) {
		for (var x = 0; x < animations[i].length; x++) {
			if (animations[i][x]==animation) {
				obj.removeClass(animations[i][0] + ' ' + animations[i][1]).addClass(animation);
				return true;
			}
		}
	}

	return false;

}

lychee.escapeHTML = function(s) {

	return s.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');

}

lychee.loadDropbox = function(callback) {

	if (!lychee.dropbox&&lychee.dropboxKey) {

		loadingBar.show();

		var g = document.createElement('script'),
			s = document.getElementsByTagName('script')[0];

		g.src	= 'https://www.dropbox.com/static/api/1/dropins.js';
		g.id	= 'dropboxjs';
		g.type	= 'text/javascript';
		g.async = 'true';
		g.setAttribute('data-app-key', lychee.dropboxKey);
		g.onload = g.onreadystatechange = function() {
			var rs = this.readyState;
			if (rs&&rs!=='complete'&&rs!=='loaded') return;
			lychee.dropbox = true;
			loadingBar.hide();
			callback();
		};
		s.parentNode.insertBefore(g, s);

	} else if (lychee.dropbox&&lychee.dropboxKey) {

		callback();

	} else {

		settings.setDropboxKey(callback);

	}

}

lychee.removeHTML = function(html) {

	var tmp = document.createElement('DIV');
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText;

}

lychee.error = function(errorThrown, params, data) {

	console.error({
		description:	errorThrown,
		params:			params,
		response:		data
	});

	loadingBar.show('error', errorThrown);

}