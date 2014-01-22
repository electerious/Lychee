/**
 * @name		Album Module
 * @description	Takes care of every action an album can handle and execute.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

upload = {

	show: function(icon, text) {

		if (icon===undefined) icon = "upload";

		upload.close(true);
		$("body").append(build.uploadModal(icon, text));

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

	start: {

		local: function(files) {

			var pre_progress = 0,
				formData = new FormData(),
				xhr = new XMLHttpRequest(),
				albumID = album.getID(),
				popup,
				progress;

			if (files.length<=0) return false;
			if (albumID===false) albumID = 0;

			formData.append("function", "upload");
			formData.append("albumID", albumID);

			for (var i = 0; i < files.length; i++) {

				if (files[i].type!=="image/jpeg"&&files[i].type!=="image/jpg"&&files[i].type!=="image/png"&&files[i].type!=="image/gif") {
					loadingBar.show("error", "The file format of " + files[i].name + " is not supported.");
					return false;
				} else {
					formData.append(i, files[i]);
				}

			}

			upload.show();

			window.onbeforeunload = function() { return "Lychee is currently uploading!"; };

			xhr.open("POST", lychee.api_path);

			xhr.onload = function() {

				if (xhr.status===200) {

					upload.close();

					// WebKit Notification
					if (window.webkitNotifications&&BrowserDetect.browser==="Safari") {
						popup = window.webkitNotifications.createNotification("", "Upload complete", "You can now manage your new photo.");
						popup.show();
					}

					window.onbeforeunload = null;

					if (album.getID()===false) lychee.goto("0");
					else album.load(albumID);

				}

			};

			xhr.upload.onprogress = function(e) {

				if (e.lengthComputable) {

					progress = (e.loaded / e.total * 100 | 0);

					if (progress>pre_progress) {
						upload.setProgress(progress);
						pre_progress = progress;
					}

					if (progress>=100) {
						upload.setIcon("cog");
						upload.setText("Processing photos");
					}

				}

			};

			$("#upload_files").val("");

			xhr.send(formData);

		},

		url: function() {

			var albumID = album.getID(),
				params,
				extension,
				buttons;

			if (albumID===false) albumID = 0;

			buttons = [
				["Import", function() {

					link = $(".message input.text").val();

					if (link&&link.length>3) {

						extension = link.split('.').pop();
						if (extension!=="jpeg"&&extension!=="jpg"&&extension!=="png"&&extension!=="gif") {
							loadingBar.show("error", "The file format of this link is not supported.");
							return false;
						}

						modal.close();
						upload.show("cog", "Importing from URL");

						params = "importUrl&url=" + escape(encodeURI(link)) + "&albumID=" + albumID;
						lychee.api(params, function(data) {

							upload.close();

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

						if (album.getID()===false) lychee.goto("0");
						else album.load(albumID);

						if (data==="Warning: Folder empty!") lychee.error("Folder empty. No photos imported!", params, data);
						else if (data!==true) lychee.error(null, params, data);

					});

				}],
				["Cancel", function() {}]
			];
			modal.show("Import from Server", "This action will import all photos which are located in <b>'uploads/import/'</b> of your Lychee installation.", buttons);

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

}