/**
 * @name        lychee.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Lychee Module
 * This module provides the basic functions of Lychee.
 */

var lychee = {

	init: function() {

		this.version = "1.3";
		this.api_path = "php/api.php";
		this.update_path = "http://lychee.electerious.com/version/index.php";
		this.updateURL = "https://github.com/electerious/Lychee";

		this.upload_path_thumb = "uploads/thumb/";
		this.upload_path_big = "uploads/big/";

		this.publicMode = false;
		this.viewMode = false;

		this.checkForUpdates = false;

		this.dropbox = false;

		this.loadingBar = $("#loading");
		this.header = $("header");
		this.content = $("#content");
		this.imageview = $("#imageview");
		this.infobox = $("#infobox");

	},

	run: function() {

		lychee.api("init", "json", function(data) {
			lychee.checkForUpdates = data.config.checkForUpdates;
			if (!data.loggedIn) lychee.setMode("public");
			$(window).bind("popstate", lychee.load);
			lychee.load();
		});

	},

	api: function(params, type, callback, loading) {

		if (loading==undefined) loadingBar.show();

		$.ajax({
			type: "POST",
			url: lychee.api_path,
			data: "function=" + params,
			dataType: type,
			success:
				function(data) {
					$.timer(100, function(){ loadingBar.hide() });
					callback(data);
				},
			error: lychee.error
		});

	},

	login: function() {

		var user = $("input#username").val(),
			password = hex_md5($("input#password").val()),
			params;

		params = "login&user=" + user + "&password=" + password;
		lychee.api(params, "text", function(data) {
			if (data) {
				localStorage.setItem("username", user);
				window.location.reload();
			} else {
				$("#password").val("").addClass("error");
				$(".message .button.active").removeClass("pressed");
			}
		});

	},

	loginDialog: function() {

		$("body").append(build.signInModal());
		$("#username").focus();
		if (localStorage) {
			local_username = localStorage.getItem("username");
			if (local_username!=null) {
				if (local_username.length>0) $("#username").val(local_username);
				$("#password").focus();
			}
		}
		if (lychee.checkForUpdates) lychee.getUpdate();

	},

	logout: function() {

		lychee.api("logout", "text", function(data) {
			window.location.reload();
		});

	},

	goto: function(url) {

		if (url==undefined) url = "";
		document.location.hash = url;

	},

	load: function() {

		var albumID = "",
			photoID = "",
			hash = document.location.hash.replace("#", "");

		contextMenu.close();

		if (hash.indexOf("a")!=-1) albumID = hash.split("p")[0].replace("a", "");
		if (hash.indexOf("p")!=-1) photoID = hash.split("p")[1];

		if (albumID&&photoID) {

			// Trash data
			albums.json = null;
			photo.json = null;

			// Show Photo
			if (lychee.content.html()==""||($("#search").length&&$("#search").val().length!=0)) {
				lychee.content.hide();
				album.load(albumID, true);
			}
			if (!visible.photo()) view.photo.show();
			photo.load(photoID, albumID);

		} else if (albumID) {

			// Trash data
			albums.json = null;
			photo.json = null;

			// Show Album
			if (visible.photo()) view.photo.hide();
			if (album.json&&albumID==album.json.id) view.album.title();
			else album.load(albumID);

		} else {

			// Trash data
			albums.json = null;
			album.json = null;
			photo.json = null;
			search.code = "";

			// Show Albums
			if (visible.photo()) view.photo.hide();
			albums.load();

		}

	},

	getUpdate: function() {

		$.ajax({
			url: lychee.update_path,
			success: function(data) { if (data!=lychee.version) $("#version span").show(); }
		});

	},

	setTitle: function(title, count, editable) {

		if (title=="Albums") document.title = "Lychee";
		else document.title = "Lychee - " + title;

		if (count) title += "<span> - " + count + " photos</span>";
		if (editable) $("#title").addClass("editable");
		else $("#title").removeClass("editable");

		$("#title").html(title);

	},

	setMode: function(mode) {

		$("#button_signout, #search, #button_trash_album, #button_share_album, #button_edit_album, .button_add, #button_archive, .button_divider").remove();
		$("#button_trash, #button_move, #button_edit, #button_share, #button_star").remove();

		$(document)
			.on("mouseenter", "#title.editable", function() { $(this).removeClass("editable") })
			.off("click", "#title.editable")
			.off("touchend", "#title.editable")
			.off("contextmenu", ".photo")
			.off("contextmenu", ".album")
			.off("drop");

		Mousetrap
			.unbind('n')
			.unbind('u')
			.unbind('s')
			.unbind('backspace');

		if (mode=="public") {

			$("#button_signin").show();
			lychee.publicMode = true;

		} else if (mode=="view") {

			Mousetrap.unbind('esc');
			$("#button_back, a#next, a#previous").remove();

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

	loadDropbox: function(callback) {

		if (!lychee.dropbox) {

			loadingBar.show();

			var g = document.createElement("script"),
				s = document.getElementsByTagName("script")[0];

			g.src = "https://www.dropbox.com/static/api/1/dropins.js";
			g.id = "dropboxjs";
			g.type = "text/javascript";
			g.async = "true";
			g.setAttribute("data-app-key", "iq7lioj9wu0ieqs");
			g.onload = g.onreadystatechange = function() {
				var rs = this.readyState;
				if (rs&&rs!="complete"&&rs!="loaded") return;
				lychee.dropbox = true;
				loadingBar.hide();
				callback();
			};
			s.parentNode.insertBefore(g, s);

		} else callback();

	},

	error: function(jqXHR, textStatus, errorThrown) {

		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
		loadingBar.show("error", textStatus, errorThrown);

	}

}