/**
 * @name		Lychee Module
 * @description	This module provides the basic functions of Lychee.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

var lychee = {

	title: "",
	version: "2.6.3",
	version_code: "020603",

	api_path: "php/api.php",
	update_path: "http://lychee.electerious.com/version/index.php",
	updateURL: "https://github.com/electerious/Lychee",
	website: "http://lychee.electerious.com",

	publicMode: false,
	viewMode: false,
	debugMode: false,

	username: "",
	checkForUpdates: false,
	sorting: "",
	location: "",

	dropbox: false,
	dropboxKey: '',

	loadingBar: $("#loading"),
	header: $("header"),
	content: $("#content"),
	imageview: $("#imageview"),
	infobox: $("#infobox"),

	init: function() {

		var params;

		params = "init&version=" + lychee.version_code;
		lychee.api(params, function(data) {

			if (data.loggedIn!==true) {
				lychee.setMode("public");
			} else {
				lychee.username = data.config.username || '';
				lychee.sorting = data.config.sorting || '';
				lychee.dropboxKey = data.config.dropboxKey || '';
				lychee.location = data.config.location || '';
			}

			// No configuration
			if (data==="Warning: No configuration!") {
				lychee.header.hide();
				lychee.content.hide();
				$("body").append(build.no_content("cog"));
				settings.createConfig();
				return true;
			}

			// No login
			if (data.config.login===false) {
				settings.createLogin();
			}

			lychee.checkForUpdates = data.config.checkForUpdates;
			$(window).bind("popstate", lychee.load);
			lychee.load();

		});

	},

	api: function(params, callback, loading) {

		if (loading===undefined) loadingBar.show();

		$.ajax({
			type: "POST",
			url: lychee.api_path,
			data: "function=" + params,
			dataType: "text",
			success: function(data) {

				setTimeout(function() { loadingBar.hide() }, 100);

				if (typeof data==="string"&&data.substring(0, 7)==="Error: ") {
					lychee.error(data.substring(7, data.length), params, data);
					upload.close(true);
					return false;
				}

				if (data==="1") data = true;
				else if (data==="") data = false;

				if (typeof data==="string"&&data.substring(0, 1)==="{"&&data.substring(data.length-1, data.length)==="}") data = $.parseJSON(data);

				if (lychee.debugMode) console.log(data);

				callback(data);

			},
			error: function(jqXHR, textStatus, errorThrown) {

				lychee.error("Server error or API not found.", params, errorThrown);
				upload.close(true);

			}
		});

	},

	login: function() {

		var user = $("input#username").val(),
			password = md5($("input#password").val()),
			params;

		params = "login&user=" + user + "&password=" + password;
		lychee.api(params, function(data) {

			if (data===true) {

				// Use 'try' to catch a thrown error when Safari is in private mode
				try { localStorage.setItem("lychee_username", user); }
				catch (err) {}

				window.location.reload();

			} else {

				// Show error and reactive button
				$("#password").val("").addClass("error").focus();
				$(".message .button.active").removeClass("pressed");

			}

		});

	},

	loginDialog: function() {

		var local_username;

		$("body").append(build.signInModal());
		$("#username").focus();
		if (localStorage) {
			local_username = localStorage.getItem("lychee_username");
			if (local_username!==null) {
				if (local_username.length>0) $("#username").val(local_username);
				$("#password").focus();
			}
		}
		if (lychee.checkForUpdates==="1") lychee.getUpdate();

	},

	logout: function() {

		lychee.api("logout", function() {
			window.location.reload();
		});

	},

	goto: function(url) {

		if (url===undefined) url = "#";
		else url = "#" + url;

		history.pushState(null, null, url);
		lychee.load();

	},

	load: function() {

		var albumID = "",
			photoID = "",
			hash = document.location.hash.replace("#", "").split("/");

		$(".no_content").remove();
		contextMenu.close();
		multiselect.close();

		if (hash[0]!==undefined) albumID = hash[0];
		if (hash[1]!==undefined) photoID = hash[1];

		if (albumID&&photoID) {

			// Trash data
			photo.json = null;

			// Show Photo
			if (lychee.content.html()===""||($("#search").length&&$("#search").val().length!==0)) {
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

			// Trash data
			album.json = null;
			photo.json = null;
			search.code = "";

			// Show Albums
			if (visible.album()) view.album.hide();
			if (visible.photo()) view.photo.hide();
			albums.load();

		}

	},

	getUpdate: function() {

		$.ajax({
			url: lychee.update_path,
			success: function(data) { if (parseInt(data)>parseInt(lychee.version_code)) $("#version span").show(); }
		});

	},

	setTitle: function(title, editable) {

		if (lychee.title==="") lychee.title = document.title;

		if (title==="Albums") document.title = lychee.title;
		else document.title = lychee.title + " - " + title;

		if (editable) $("#title").addClass("editable");
		else $("#title").removeClass("editable");

		$("#title").html(title);

	},

	setMode: function(mode) {

		$("#button_settings, #button_settings, #button_search, #search, #button_trash_album, #button_share_album, .button_add, .button_divider").remove();
		$("#button_trash, #button_move, #button_share, #button_star").remove();

		$(document)
			.on("mouseenter", "#title.editable", function() { $(this).removeClass("editable") })
			.off("click", "#title.editable")
			.off("touchend", "#title.editable")
			.off("contextmenu", ".photo")
			.off("contextmenu", ".album")
			.off("drop");

		Mousetrap
			.unbind(['u', 'ctrl+u'])
			.unbind(['s', 'ctrl+s'])
			.unbind(['r', 'ctrl+r'])
			.unbind(['d', 'ctrl+d'])
			.unbind(['t', 'ctrl+t'])
			.unbind(['command+backspace', 'ctrl+backspace']);

		if (mode==="public") {

			$("header #button_signin, header #hostedwith").show();
			lychee.publicMode = true;

		} else if (mode==="view") {

			Mousetrap.unbind('esc');
			$("#button_back, a#next, a#previous").remove();
			$(".no_content").remove();

			lychee.publicMode = true;
			lychee.viewMode = true;

		}

	},

	animate: function(obj, animation) {

		var animations = [
			["fadeIn", "fadeOut"],
			["contentZoomIn", "contentZoomOut"]
		];

		if (!obj.jQuery) obj = $(obj);

		for (var i = 0; i < animations.length; i++) {
			for (var x = 0; x < animations[i].length; x++) {
				if (animations[i][x]==animation) {
					obj.removeClass(animations[i][0] + " " + animations[i][1]).addClass(animation);
					return true;
				}
			}
		}

		return false;

	},

	escapeHTML: function(s) {

		return s.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');

	},

	loadDropbox: function(callback) {

		if (!lychee.dropbox&&lychee.dropboxKey) {

			loadingBar.show();

			var g = document.createElement("script"),
				s = document.getElementsByTagName("script")[0];

			g.src = "https://www.dropbox.com/static/api/1/dropins.js";
			g.id = "dropboxjs";
			g.type = "text/javascript";
			g.async = "true";
			g.setAttribute("data-app-key", lychee.dropboxKey);
			g.onload = g.onreadystatechange = function() {
				var rs = this.readyState;
				if (rs&&rs!=="complete"&&rs!=="loaded") return;
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

	},

	removeHTML: function(html) {

		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText;

	},

	error: function(errorThrown, params, data) {

		console.error({
			description: errorThrown,
			params: params,
			response: data
		});

		loadingBar.show("error", errorThrown);

	}

};