/**
 * @name        lychee.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Lychee Module
 * This module provides the basic functions of Lychee.
 */

lychee = {

	init: function(api_path, upload_path) {

		this.version = "1.2";
		this.api_path = api_path;
		this.upload_path = upload_path;
		this.update_path = "http://lychee.electerious.com/version/index.php";
		this.updateURL = "https://github.com/electerious/Lychee";
		this.publicMode = false;

		this.checkForUpdates = false;
		this.bitlyUsername = "";

		this.loadingBar = $("#loading");
		this.header = $("header");
		this.headerTitle = $("#title");
		this.content = $("#content");
		this.image_view = $("#image_view");
		this.infobox = $("#infobox");

	},

	ready: function() {

		if (!mobileBrowser()) $(".tools").tipsy({gravity: 'n'});
		if (window.webkitNotifications) window.webkitNotifications.requestPermission();

		lychee.api("init", "json", function(data) {
			lychee.checkForUpdates = data.config.checkForUpdates;
			lychee.bitlyUsername = data.config.bitlyUsername;
			if (!data.loggedIn) lychee.setPublicMode();
			$(window).bind("popstate", lychee.load);
			lychee.load();
		});

	},

	setPublicMode: function() {

		this.publicMode = true;

		$("#button_signout, #search, #button_trash_album, #button_share_album, #button_edit_album, .button_add, #button_archive, .button_divider").remove();
		$("#button_trash, #button_move, #button_edit, #button_share, #button_star").remove();

		$(document)
			.on("mouseenter", "#title.editable", function() { $(this).removeClass("editable") })
			.off(event_name, "#title.editable")
			.off("contextmenu", ".photo")
			.off("contextmenu", ".album")
			.off("drop");

		$("#button_signin").show();

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

	showLogin: function() {

		$("body").append(build.signInModal());
		$("#username").focus();
		if (localStorage) {
			local_username = localStorage.getItem("username");
			if (local_username==null) return false;
			if (local_username.length>0) $("#username").val(local_username);
			$("#password").focus();
		}
		if (lychee.checkForUpdates) lychee.update();

	},

	login: function() {

		user = $("input#username").val();
		password = hex_md5($("input#password").val());

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

	logout: function() {

		lychee.api("logout", "text", function(data) {
			window.location.reload();
		});

	},

	update: function() {

		$.ajax({
			url: lychee.update_path,
			success: function(data) { if (data!=lychee.version) $("#version span").show(); }
		});

	},

	upload: function(files) {

		pre_progress = 0;

		$(".upload_overlay").remove();
		$("body").append(build.uploadModal());

	    var formData = new FormData();
	    for (var i = 0; i < files.length; i++) formData.append(i, files[i]);

	    formData.append("function", "upload");

	    if (lychee.content.attr("data-id")=="") formData.append("albumID", 0);
	    else formData.append("albumID", lychee.content.attr("data-id"));

	    var xhr = new XMLHttpRequest();

	    xhr.open('POST', lychee.api_path);
	    xhr.onload = function () {

	    	if (xhr.status===200) {

	    		$(".progressbar div").css("width", "100%");
				$(".upload_overlay").removeClass("fadeIn").css("opacity", 0);
				$.timer(300,function(){ $(".upload_overlay").remove() });

				if (window.webkitNotifications&&BrowserDetect.browser=="Safari") {
					var popup = window.webkitNotifications.createNotification("", "Upload complete", "You can now manage your new photos.");
					popup.show();
				}

				if (lychee.content.attr("data-id")=="") lychee.goto("a0");
				else photos.load(lychee.content.attr("data-id"));

	    	}

	    };

	    xhr.upload.onprogress = function (event) {

	    	if (event.lengthComputable) {

	    		var progress = (event.loaded / event.total * 100 | 0);

	    		if (progress>pre_progress) {
	    			$(".progressbar div").css("width", progress + "%");
	    			pre_progress = progress;
	    		}

	    		if (progress>=100) $(".progressbar div").css("opacity", 0.2);

	    	}

	    };

	    $("#upload_files").val("");

	    xhr.send(formData);

	},

	importUrl: function() {

		link = prompt("Please enter the direct link to a photo to import it:", "");
		if (lychee.content.attr("data-id")=="") albumID = 0;
		else albumID = lychee.content.attr("data-id");

		lychee.closeModal();

		if (link.length>3) {

			params = "importUrl&url=" + escape(link) + "&albumID=" + albumID;
			lychee.api(params, "text", function(data) {

				if (data) {
					if (lychee.content.attr("data-id")=="") lychee.goto("a0");
					else photos.load(lychee.content.attr("data-id"));
				} else loadingBar.show("error");

			});

		} else if (link.length>0) loadingBar.show("error", "Error", "Link to short or too long. Please try another one!");

	},

	load: function() {

		contextMenu.close();
		hash = document.location.hash.replace("#", "");

		albumID = "";
		photoID = "";

		if (hash.indexOf("a")!=-1) albumID = hash.split("p")[0].replace("a", ""); else albumID = "";
		if (hash.indexOf("p")!=-1) photoID = hash.split("p")[1];  else photoID = "";

		lychee.content.attr("data-id", albumID);
		lychee.image_view.attr("data-id", photoID);

		if (albumID&&photoID) {

			// Show ImageView
			if (lychee.content.html()==""||($("#search").length&&$("#search").val().length!=0)) {
				lychee.content.hide();
				photos.load(albumID, true);
			}
			photos.loadInfo(photoID, albumID);

		} else if (albumID) {

			// Show Album
			if (visible.infobox) photos.hideInfobox();
			if (!visible.controls()) lychee.showControls();
			if (visible.imageview()) photos.hideView();
			else photos.load(albumID, false);

		} else {

			// Show Albums
			if (visible.infobox) photos.hideInfobox();
			if (!visible.controls()) lychee.showControls();
			if (visible.imageview()) photos.hideView();
			albums.load();

		}

	},

	goto: function(url) {

		document.location.hash = url;

	},

	title: function() {

		return lychee.headerTitle.html().replace($("#title span").html(), "").replace("<span></span>", "");

	},

	showControls: function() {

		clearTimeout($(window).data("timeout"));

		if (visible.imageview()) {
			lychee.image_view.removeClass("full");
			lychee.loadingBar.css("opacity", 1);
			lychee.header.css("margin-Top", "0px");
			if ($("#image_view #image.small").length>0) {
				$("#image_view #image").css({
					marginTop: -1*($("#image_view #image").height()/2)+20
				});
			} else {
				$("#image_view #image").css({
					top: 70,
					right: 30,
					bottom: 30,
					left: 30
				});
			}
		}

	},

	hideControls: function() {

		if (visible.imageview()&&!visible.infobox()) {
			clearTimeout($(window).data("timeout"));
			$(window).data("timeout", setTimeout(function() {
				lychee.image_view.addClass("full");
				lychee.loadingBar.css("opacity", 0);
				lychee.header.css("margin-Top", "-45px");
				if ($("#image_view #image.small").length>0) {
					$("#image_view #image").css({
						marginTop: -1*($("#image_view #image").height()/2)
					});
				} else {
					$("#image_view #image").css({
						top: 0,
						right: 0,
						bottom: 0,
						left: 0
					});
				}
			}, 500));
		}

	},

	closeModal: function() {

		$(".message_overlay").removeClass("fadeIn").css("opacity", 0);
		$.timer(300,function(){ $(".message_overlay").remove() });

	},

	animate: function(obj, animation) {

		animations = [
			["fadeIn", "fadeOut"],
			["contentZoomIn", "contentZoomOut"]
		];

		if (!obj.jQuery) obj = $(obj);

		for (i = 0; i < animations.length; i++) {
			for (var x = 0; x < animations[i].length; x++) {
				if (animations[i][x]==animation) {
					obj.removeClass(animations[i][0] + " " + animations[i][1]).addClass(animation);
					return true;
				}
			}
		}

		return false;

	},

	error: function(jqXHR, textStatus, errorThrown) {

		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
		loadingBar.show("error", textStatus, errorThrown);

	}

}