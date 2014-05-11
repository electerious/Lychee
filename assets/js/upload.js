/**
 * @name		Album Module
 * @description	Takes care of every action an album can handle and execute.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

upload = {

	show: function(icon, text, html) {

		if (icon===undefined) icon = "upload";

		upload.close(true);
		$("body").append(build.uploadModal(icon, text, html));

	},

	setIcon: function(icon) {

		$(".upload_message a").remove();
		$(".upload_message").prepend("<a class='icon-" + icon + "'></a>");

	},

	setProgress: function(progress) {

		$(".progressbar div").css("width", progress + "%");

	},

	setText: function(text) {

		$(".progressbar").remove();
		$(".upload_message").append("<p>" + text + "</p>");

	},

	notify: function(title) {

		var popup;

		if (!window.webkitNotifications) return false;

		if (window.webkitNotifications.checkPermission()!==0) window.webkitNotifications.requestPermission();

		if (window.webkitNotifications.checkPermission()===0&&title) {
			popup = window.webkitNotifications.createNotification("", title, "You can now manage your new photo(s).");
			popup.show();
		}

	},

	start: {

		local: function(files) {

			var albumID = album.getID(),
				html = "";

			var process = function(files, file) {

				var formData = new FormData(),
					xhr = new XMLHttpRequest(),
					pre_progress = 0,
					progress;

				formData.append("function", "upload");
				formData.append("albumID", albumID);
				formData.append(0, file);

				xhr.open("POST", lychee.api_path);

				xhr.onload = function() {

					var wait;

					if (xhr.status===200) {

						$(".upload_message .rows .row:nth-child(" + (file.num+1) + ") .status")
							.html("Finished")
							.addClass("success");

						file.ready = true;
						wait = false;

						for (var i = 0; i < files.length; i++) {

							if (files[i].ready===false) {
								wait = true;
								break;
							}

						}

						if (wait===false) {

							$("#upload_files").val("");

							if (album.getID()===false) lychee.goto("0");
							else album.load(albumID);

						}

					}

				};

				xhr.upload.onprogress = function(e) {

					if (e.lengthComputable) {

						progress = (e.loaded / e.total * 100 | 0);

						if (progress>pre_progress) {
							$(".upload_message .rows .row:nth-child(" + (file.num+1) + ") .status").html(progress + "%");
							pre_progress = progress;
						}

						if (progress>=100) {

							$(".upload_message .rows .row:nth-child(" + (file.num+1) + ") .status").html("Processing");

							if (file.next!==null) process(files, file.next);

						}

					}

				};

				xhr.send(formData);

			}

			if (files.length<=0) return false;
			if (albumID===false) albumID = 0;

			html = "<div class='rows'>";

			for (var i = 0; i < files.length; i++) {

				files[i].num = i;
				files[i].ready = false;

				if (i < files.length-1) files[i].next = files[i+1];
				else files[i].next = null;

				if (files[i].type!=="image/jpeg"&&files[i].type!=="image/jpg"&&files[i].type!=="image/png"&&files[i].type!=="image/gif") {

					files[i].ready = true;

					// Generate html with error
					html += "<div class='row'><a class='name'>" + lychee.escapeHTML(files[i].name) + "</a><a class='status error'>Not supported</a></div>";

				} else {

					// Generate html
					html += "<div class='row'><a class='name'>" + lychee.escapeHTML(files[i].name) + "</a><a class='status'></a></div>";

				}

			}

			html += "</div>";

			window.onbeforeunload = function() { return "Lychee is currently uploading!"; };
			window.onbeforeunload = null;

			upload.show(null, "Uploading", html);

			process(files, files[0]);

		},

		url: function() {

			var albumID = album.getID(),
				params,
				extension,
				buttons,
				link;

			if (albumID===false) albumID = 0;

			buttons = [
				["Import", function() {

					link = $(".message input.text").val();

					if (link&&link.length>3) {

						extension = link.split('.').pop();
						if (extension!=="jpeg"&&extension!=="jpg"&&extension!=="png"&&extension!=="gif"&&extension!=="webp") {
							loadingBar.show("error", "The file format of this link is not supported.");
							return false;
						}

						modal.close();
						upload.show("cog", "Importing from URL");

						params = "importUrl&url=" + escape(encodeURI(link)) + "&albumID=" + albumID;
						lychee.api(params, function(data) {

							upload.close();
							upload.notify("Import complete");

							if (album.getID()===false) lychee.goto("0");
							else album.load(albumID);

							if (data!==true) lychee.error(null, params, data);

						});

					} else loadingBar.show("error", "Link to short or too long. Please try another one!");

				}],
				["Cancel", function() {}]
			];

			modal.show("Import from Link", "Please enter the direct link to a photo to import it: <input class='text' type='text' placeholder='http://' value='http://'>", buttons);

		},

		server: function() {

			var albumID = album.getID(),
				params,
				buttons;

			if (albumID===false) albumID = 0;

			buttons = [
				["Import", function() {

					modal.close();
					upload.show("cog", "Importing photos");

					params = "importServer&albumID=" + albumID;
					lychee.api(params, function(data) {

						upload.close();
						upload.notify("Import complete");

						if (data==="Notice: Import only contains albums!") {
							if (visible.albums()) lychee.load();
							else lychee.goto("");
						}
						else if (album.getID()===false) lychee.goto("0");
						else album.load(albumID);

						if (data==="Notice: Import only contains albums!") return true;
						else if (data==="Warning: Folder empty!") lychee.error("Folder empty. No photos imported!", params, data);
						else if (data!==true) lychee.error(null, params, data);

					});

				}],
				["Cancel", function() {}]
			];

			modal.show("Import from Server", "This action will import all photos and albums which are located in <b>'uploads/import/'</b> of your Lychee installation.", buttons);

		},

		dropbox: function() {

			var albumID = album.getID(),
				params;

			if (albumID===false) albumID = 0;

			lychee.loadDropbox(function() {
				Dropbox.choose({
					linkType: "direct",
					multiselect: true,
					success: function(files) {

						if (files.length>1) {

							for (var i = 0; i < files.length; i++) files[i] = files[i].link;

						} else files = files[0].link;

						upload.show("cog", "Importing photos");

						params = "importUrl&url=" + escape(files) + "&albumID=" + albumID;
						lychee.api(params, function(data) {

							upload.close();
							upload.notify("Import complete");

							if (album.getID()===false) lychee.goto("0");
							else album.load(albumID);

							if (data!==true) lychee.error(null, params, data);

						});

					}
				});
			});

		}

	},

	close: function(force) {

		if (force===true) {
			$(".upload_overlay").remove();
		} else {
			upload.setProgress(100);
			$(".upload_overlay").removeClass("fadeIn").css("opacity", 0);
			setTimeout(function() { $(".upload_overlay").remove() }, 300);
		}

	}

};