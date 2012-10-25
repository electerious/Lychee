/**
 * @name        functions.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2012 by Philipp Maurer, Tobias Reich
 */

/*
	Init Function
	This function is called when the site is loaded.
*/

function init() {

	$("#tools_albums").show();
	$(".tools").tipsy({gravity: 'n'});
	params = "function=loggedIn";
	$.ajax({type: "POST", url: api_path, data: params, success: function(data) {
		if (data!=1) {
			$("body").append(buildSignInModal());
			$("#username").focus();
		} else if (data) {
			if (headerTitle.html().length<1&&BrowserDetect.browser=="Firefox") getURL();
		}
	}});
	
}

/*
	Session Function
	This functions are called when the user tries to login or logout.
*/

function login() {

	user = $("input#username").val();
	password = $("input#password").val();

	params = "function=login&user=" + user + "&password=" + password;
	$.ajax({type: "POST", url: api_path, data: params, success: function(data) {
		if (data==1) {
			getURL();
			closeModal();
		} else {
			$("#password").val("").addClass("error");
			$(".message .button.active").removeClass("pressed");
		}
	}});

}

function logout() {

	params = "function=logout";
	$.ajax({type: "POST", url: api_path, data: params, success: function(data) {
		window.location.reload();
	}});

}

/*
	URL Function
	This functions are used to get and set the URL.
*/

function setURL(website_url) {
	document.location.hash = website_url;
}

function getURL() {

	closeContextMenu();
	hash = document.location.hash.replace("#", "");
	
	albumID = "";
	photoID = "";
	
	if (hash.indexOf("a")!=-1) albumID = hash.split("p")[0].replace("a", "");
	if (hash.indexOf("p")!=-1) photoID = hash.split("p")[1];

	if (hash=="upload") {
	
		loadAlbums();
		$("body").append(buildAddModal);
	
	} else if (albumID&&photoID) {
	
		content.hide();
		showImageview(photoID);
		if (content.html()=="") loadPhotos(albumID, true);
	
	} else if (albumID) {
	
		if (!visibleControls()) showControls();
		if (visibleImageview()) hideImageview();
		else loadPhotos(albumID, false);
		
	} else {
	
		loadAlbums();
	
	}
	
}

/*
	Button Functions
	This functions are called from Buttons.
*/

function deleteAlbum() {

	albumTitle = headerTitle.html().replace($("#title span").html(), "").replace("<span></span>", "");
	f1 = "loadDeleteAlbum(" + content.attr("data-id") + ", true);";
	f2 = "loadDeleteAlbum(" + content.attr("data-id") + ", false);";
	modal = buildModal("Delete Album", "Are you sure you want to delete the album '" + albumTitle + "' and all of the photos it contains? This action can't be undone!", ["Delete Album and Photos", "Keep Photos"], [f1, f2]);
	$("body").append(modal);

}

function deleteUnsorted() {

	albumTitle = headerTitle.html().replace($("#title span").html(), "").replace("<span></span>", "");
	f1 = "loadDeleteAlbum(" + content.attr("data-id") + ", true);";
	f2 = "";
	modal = buildModal("Clear Unsorted", "Are you sure you want to delete all photos from 'Unsorted'?<br>This action can't be undone!", ["Clear Unsorted", "Keep Photos"], [f1, f2]);
	$("body").append(modal);

}

function deletePhoto(photoID) {

	if (photoID==undefined) photoTitle = " '" + headerTitle.html() + "'"; else photoTitle = "";
	if (photoID==undefined) photoID = image_view.attr("data-id");

	f1 = "loadDeletePhoto(" + photoID + ");";
	f2 = "";
	modal = buildModal("Delete Photo", "Are you sure you want to delete the photo" + photoTitle + "?<br>This action can't be undone!", ["Delete Photo", "Keep Photo"], [f1, f2]);
	$("body").append(modal);

}

function closeModal() {
	$(".message_overlay").removeClass("fadeIn").css("opacity", 0);
	$.timer(300,function(){ $(".message_overlay").remove() });
}

/*
	Show/Hide Functions
	This functions are used to show/hide content.
*/

function loadingFadeIn(status, errorTitle, errorText) {
	switch (status) {
		case "error":
			loading.removeClass("loading uploading error").addClass(status);
			if (!errorTitle||!errorText) {
				errorTitle = "Error";
				errorText = "Whoops, it looks like something went wrong. Please reload the site and try again!"
			}
			loading.html("<h1>" + errorTitle + ": <span>" + errorText + "</span></h1>");
			loading.css("height", "40px");
			header.css("margin-Top", "40px");
			$.timer(3000,function(){ loadingFadeOut() });
			break;
		case "loading":
			loading.removeClass("loading uploading error").addClass(status);
			if (visibleControls()) header.css("margin-Top", "3px");
			break;
	}
}
function loadingFadeOut() {
	loading.html("").css("height", "3px");
	if (visibleControls()) header.css("marginTop", "0px");
}

function showImageview(photoID) {
	// Change toolbar-buttons
	$("#tools_albums, #tools_album").hide();
	$("#tools_photo").show();
	// Make body scrollable
	$("body").css("overflow", "hidden");
	// Load photo
	loadPhotoInfo(photoID);
}
function hideImageview() {
	// Change toolbar-buttons
	$("#tools_photo, #tools_albums").hide();
	$("#tools_album").show();
	// Make body scrollable
	$("body").css("overflow", "scroll");
	// Change website title and url by using loadAlbumInfo
	loadAlbumInfo(content.attr("data-id"));
	// Hide ImageViewer
	image_view.removeClass("fadeIn").addClass("fadeOut");
	$.timer(300,function(){ image_view.hide() });
}
function visibleImageview() {
	if ($("#image_view.fadeIn").length>0) return true;
	else return false;
}

function showControls() {
	clearTimeout($(window).data("timeout"));
	if (visibleImageview()&&!runningDiashow()) {
		$("#image_view a#previous").css("left", "20px");
		$("#image_view a#next").css("right", "20px");
		image_view.css("background-color", "rgba(30,30,30,.99)");
		loading.css("opacity", 1);
		header.css("margin-Top", "0px");
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
}
function hideControls() {
	if (visibleImageview()) {
		clearTimeout($(window).data("timeout"));
		$(window).data("timeout", setTimeout( function () {
			$("#image_view a#previous").css("left", "-50px");
			$("#image_view a#next").css("right", "-50px");
			image_view.css("background-color", "#111");
			loading.css("opacity", 0);
			header.css("margin-Top", "-45px");
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
}
function visibleControls() {
	if (loading.css("opacity")>0) return true;
	else return false;
}

function showContextMenuPhoto(photoID, mouse_x, mouse_y) {

	mouse_y -= $(document).scrollTop();

	items = [
		["Rename", "renamePhoto(" + photoID + ")"],
		["Move to Album", "showContextMenuMove(" + photoID + ", " + (mouse_x+150) + ", " + (mouse_y+$(document).scrollTop()) + ")"],
		["Delete", "deletePhoto(" + photoID + ")"]
	];
	
	closeContextMenu();
	$("body").css("overflow", "hidden");
	$(".photo[data-id='" + photoID + "']").addClass("active");
	$("body").append(buildContextMenu(items));
	$(".contextmenu").css({
		"top": mouse_y,
		"left": mouse_x
	});
	
}
function showContextMenuMove(photoID, mouse_x, mouse_y) {

	mouse_y -= $(document).scrollTop();
	
	params = "function=getAlbums";
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {
	
		if (content.attr("data-id")==0) {
			items = new Array();
		} else {
			items = [
				["Unsorted", "loadMovePhoto(" + photoID + ", 0)"]
			];
		}
		
		$.each(data, function(index) {
			if (this.id!=content.attr("data-id")) {
				if(!this.title) this.title = "Untitled";
				items[items.length] = new Array(this.title, "loadMovePhoto(" + photoID + ", " + this.id + ")");
			} else {
				items[items.length] = new Array("", "");
			}
		});
		
		if (items.length==0) {
			items = [
				["Create new Album", "addAlbum()"]
			];
		}
		
		closeContextMenu();
		$("body").css("overflow", "hidden");
		$(".photo[data-id='" + photoID + "']").addClass("active");
		$("body").append(buildContextMenu(items));
		$(".contextmenu").css({
			"top": mouse_y,
			"left": mouse_x-150
		});
		
	}, error: ajaxError });
		
}
function showContextMenuShare(photoID, mouse_x, mouse_y) {

	mouse_y -= $(document).scrollTop();
	
	items = [
		["<a class='icon-eye-close'></a> Make Private", "setPhotoPublic()"],
		["<a class='icon-twitter'></a> Twitter", "loadSharePhoto(0, " + photoID + ")"],
		["<a class='icon-facebook'></a> Facebook", "loadSharePhoto(1, " + photoID + ")"],
		["<a class='icon-sign-blank'></a> Tumblr", "loadSharePhoto(2, " + photoID + ")"],
		["<a class='icon-pinterest'></a> Pinterest", "loadSharePhoto(3, " + photoID + ")"],
		["<a class='icon-envelope'></a> Mail", "loadSharePhoto(4, " + photoID + ")"],
		["<a class='icon-link'></a> Copy Link", "loadSharePhoto(5, " + photoID + ")"],
		["<a class='icon-link'></a> Copy Shortlink", "loadSharePhoto(6, " + photoID + ")"]
	];
			
	closeContextMenu();
	$("body").css("overflow", "hidden");
	$(".photo[data-id='" + photoID + "']").addClass("active");
	$("body").append(buildContextMenu(items));
	$(".contextmenu").css({
		"top": mouse_y,
		"left": mouse_x
	});
				
}
function closeContextMenu() {
	$(".contextmenu_bg, .contextmenu").remove();
	$(".photo.active").removeClass("active");
	$("body").css("overflow", "scroll");
}

function hidePhoto(photoID) {
	$(".photo[data-id='" + photoID + "']").css("opacity", 0).animate({
		width: 0,
		marginLeft: 0
	}, 300, function() {
		$(this).remove();
		imgNum = parseInt($("#title span").html().replace("- ", "").replace(" photos", ""))-1;
		$("#title span").html(" - " + imgNum + " photos");
	});
}

function startDiashow() {
	image_view.attr("data-diashow", "play");
	clearInterval($(window).data("diashow"));
	hideControls();
	$(window).data("diashow", setInterval(function() { loadNextPhoto() }, 3000));
}
function stopDiashow() {
	image_view.attr("data-diashow", "stop");
	clearInterval($(window).data("diashow"));
	showControls();
}
function runningDiashow() {
	if (image_view.attr("data-diashow")=="play") return true;
	else return false;
}

function showInfobox() {
	$("body").append("<div id='infobox_overlay'></div>");
	infobox.css("right", "0px");
}
function hideInfobox() {
	$("#infobox_overlay").remove();
	infobox.css("right", "-320px");
}
function visibleInfobox() {
	if (parseInt(infobox.css("right").replace("px", ""))<0) return false;
	else return true;
}

function isPhotoSmall(photo) {

	size = [
		["width", false],
		["height", false]
	];

	if (photo.width<$(window).width()-60) size["width"] = true;
	if (photo.height<$(window).height()-100) size["height"] = true;
	
	if (size["width"]&&size["height"]) return true;
	else return false;

}

/*
	Key Function
	This function triggers events when a special key is pressed.
*/

function key(e) {

	code = (e.keyCode ? e.keyCode : e.which);
	
	if (code==13||code==37||code==39||code==32||code==27) e.preventDefault();
	
	if (code==13&&$(".message .button.active").length) $(".message .button.active").addClass("pressed").click();
	if (code==37&&visibleImageview()) loadPreviousPhoto();
	if (code==39&&visibleImageview()) loadNextPhoto();
	if (code==32&&visibleImageview()&&!runningDiashow()) startDiashow();
	else if (code==32&&visibleImageview()&&runningDiashow()) stopDiashow();
	if (code==27&&$(".message").length&&$(".sign_in").length==0) closeModal();
	else if (code==27&&visibleInfobox()) { hideInfobox(); e.preventDefault(); }
	else if (code==27&&visibleImageview()&&runningDiashow()) stopDiashow();
	else if (code==27&&visibleImageview()&&!runningDiashow()) { showControls(); setURL("a" + content.attr("data-id")); };

}

function getViewLink(photoID) {

	if (location.href.indexOf("index.html")>0) return location.href.replace("index.html" + location.hash, "view.php?p=" + photoID);
	else return location.href.replace(location.hash, "view.php?p=" + photoID);

}

/*
	Ajax Functions
	This functions are used to get and process data from the Api.
*/

function addAlbum() {

	title = prompt("Please enter a title for this album:", "Untitled");
	closeModal();

	if (title.length>2&&title.length<31) {

		loadingFadeIn("loading");

		params = "function=addAlbum&title=" + escape(title);
		$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

			if (data==0) loadingFadeIn("error");
			else setURL("a" + data);

		}, error: ajaxError });

	} else if (title.length>0) loadingFadeIn("error", "Error", "Title to short or too long. Please try another one!");

}

function renameAlbum() {

	oldTitle = headerTitle.html().replace($("#title span").html(), "").replace("<span></span>", "");
	newTitle = prompt("Please enter a new title for this album:", oldTitle);
	albumID = content.attr("data-id");

	if (albumID!=""&&albumID!=null&&albumID!=undefined&&newTitle.length>2&&newTitle.length<31) {

		loadingFadeIn("loading");

		params = "function=setAlbumTitle&albumID=" + albumID + "&title=" + encodeURI(newTitle);
		$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

			if (data==1) {
				headerTitle.html(newTitle + "<span>" + $("#title span").html() + "</span>");
				document.title = "Lychee - " + newTitle;
				loadingFadeOut();
			} else loadingFadeIn("error");

		}, error: ajaxError });

	} else if (newTitle.length>0) loadingFadeIn("error", "Error", "New title to short or too long. Please try another one!");

}

function renamePhoto(photoID) {

	if (photoID==undefined) {
	
		// Function called from ImageViewer
		oldTitle = headerTitle.html();
		photoID = image_view.attr("data-id");
		
	} else oldTitle = "";
	
	newTitle = prompt("Please enter a new title for this photo:", oldTitle);

	if (photoID!=null&&photoID!=undefined&&newTitle.length<31) {

		loadingFadeIn("loading");

		params = "function=setPhotoTitle&photoID=" + photoID + "&title=" + encodeURI(newTitle);
		$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

			if (data==1) {
				if (oldTitle!="") {
					headerTitle.html(newTitle);
					document.title = "Lychee - " + newTitle;
				}
				$(".photo[data-id='" + photoID + "'] .overlay h1").html(newTitle);
				loadingFadeOut();
			} else loadingFadeIn("error");

		}, error: ajaxError });

	} else if (newTitle.length>0) loadingFadeIn("error", "Error", "New title to short or too long. Please try another one!");

}

function loadAlbums() {

	loadingFadeIn("loading");
	$(".album, .photo").removeClass("contentZoomIn").addClass("contentZoomOut");
	
	startTime = new Date().getTime();

	params = "function=getAlbums";
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {
	
		durationTime = (new Date().getTime() - startTime);
		if (durationTime>300) waitTime = 0; else waitTime = 300 - durationTime;
		
		$.timer(waitTime,function(){

			$("#tools_album, #tools_photo").hide();
			$("#tools_albums").show();

			content.attr("data-id", "");

			/* Smart Albums */
			unsortedAlbum = new Object();
			unsortedAlbum.id = 0;
			unsortedAlbum.title = "Unsorted";
			unsortedAlbum.sysdate = "";
			unsortedAlbum.unsorted = 1;

			starredAlbum = new Object();
			starredAlbum.id = "f";
			starredAlbum.title = "Starred";
			starredAlbum.sysdate = "";
			starredAlbum.star = 1;

			sharedAlbum = new Object();
			sharedAlbum.id = "s";
			sharedAlbum.title = "Public";
			sharedAlbum.sysdate = "";
			sharedAlbum.public = 1;

			content.html("").append(buildDivider("Smart Albums") + buildAlbum(unsortedAlbum) + buildAlbum(starredAlbum) + buildAlbum(sharedAlbum));

			if (data!=false) {

				/*  Albums */
				albums = "";
				$.each(data, function() { albums += buildAlbum(this); });
				content.append(buildDivider("Albums") + albums);
	
				$(".album, .photo").removeClass("contentZoomOut").addClass("contentZoomIn");
			
			}

			document.title = "Lychee";
			headerTitle.html("Albums").removeClass("editable");

			loadSmartAlbums();
			
		});

	}, error: ajaxError });

}

function loadSmartAlbums() {

	params = "function=getSmartInfo";
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {
			
		$(".album[data-id='0'] img:nth-child(1)").attr("src", data.unsortThumb2);
		$(".album[data-id='0'] img:nth-child(2)").attr("src", data.unsortThumb1);
		$(".album[data-id='0'] img:nth-child(3)").attr("src", data.unsortThumb0);
		$(".album[data-id='0'] .overlay a").html(data.unsortNum + " photos");
		
		$(".album[data-id='s'] img:nth-child(1)").attr("src", data.publicThumb2);
		$(".album[data-id='s'] img:nth-child(2)").attr("src", data.publicThumb1);
		$(".album[data-id='s'] img:nth-child(3)").attr("src", data.publicThumb0);
		$(".album[data-id='s'] .overlay a").html(data.publicNum + " photos");
		
		$(".album[data-id='f'] img:nth-child(1)").attr("src", data.starredThumb2);
		$(".album[data-id='f'] img:nth-child(2)").attr("src", data.starredThumb1);
		$(".album[data-id='f'] img:nth-child(3)").attr("src", data.starredThumb0);
		$(".album[data-id='f'] .overlay a").html(data.starredNum + " photos");
		
		loadingFadeOut();
	
	}, error: ajaxError });

}

function loadPhotos(albumID, refresh) {

	// If refresh is true the function will only refresh the content and not change the toolbar buttons either the title

	if (!refresh) {
		loadingFadeIn("loading");
		if (visibleImageview()) hideImageview();
		$(".album, .photo").removeClass("contentZoomIn").addClass("contentZoomOut");
		$(".divider").removeClass("fadeIn").addClass("fadeOut");
	}
	
	startTime = new Date().getTime();
	
	params = "function=getPhotos&albumID=" + albumID;
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {
	
		durationTime = (new Date().getTime() - startTime);
		if (durationTime>300) waitTime = 0; else if (refresh) waitTime = 0; else waitTime = 300 - durationTime;
		
		$.timer(waitTime,function(){

			content.attr("data-id", albumID);

			photos = "";
			$.each(data, function() { photos += buildPhoto(this); });
			content.html("").append(photos);

			if (!refresh) {

				$(".album, .photo").removeClass("contentZoomOut").addClass("contentZoomIn");
				$("#tools_albums, #tools_photo").hide();
				$("#tools_album").show();

				loadAlbumInfo(albumID);

			}
		
		});

	}, error: ajaxError });

}

function loadAlbumInfo(albumID) {

	if (albumID=="f"||albumID=="s"||albumID==0) {
	
		params = "function=getSmartInfo";
		$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {
		
			switch (albumID) {
				case "f":
					document.title = "Lychee - Starred";
					headerTitle.html("Starred<span> - " + data.starredNum + " photos</span>");
					$("#button_edit_album, #button_trash_album, .button_divider").hide();
					break;
				case "s":
					document.title = "Lychee - Public";
					headerTitle.html("Public<span> - " + data.publicNum + " photos</span>");
					$("#button_edit_album, #button_trash_album .button_divider").hide();
					break;
				case "0":
					document.title = "Lychee - Unsorted";
					headerTitle.html("Unsorted<span> - " + data.unsortNum + " photos</span>");
					$("#button_edit_album").hide();
					$("#button_trash_album, .button_divider").show();
					break;
			}
			
			loadingFadeOut();
			
		}, error: ajaxError });
	
	} else {
	
		params = "function=getAlbumInfo&albumID=" + albumID;
		$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {
		
			$("#button_edit_album, #button_trash_album, .button_divider").show();
	
			if (!data.title) data.title = "Untitled";
			document.title = "Lychee - " + data.title;
			headerTitle.html(data.title + "<span> - " + data.num + " photos</span>").addClass("editable");
	
			loadingFadeOut();
	
		}, error: ajaxError });
	
	}	

}

function loadPhotoInfo(photoID) {

	loadingFadeIn("loading");

	params = "function=getPhotoInfo&photoID=" + photoID;
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {

		if (!data.title) data.title = "Untitled";

		document.title = "Lychee - " + data.title;
		headerTitle.html(data.title).addClass("editable");

		$("#button_star a").removeClass("icon-star-empty icon-star");
		if (data.star=="1") {
			$("#button_star a").addClass("icon-star");
			$("#button_star").attr("title", "Unstar Photo");
		} else {
			$("#button_star a").addClass("icon-star-empty");
			$("#button_star").attr("title", "Star Photo");
		}

		if (data.public=="1") {
			$("#button_share a").addClass("active");
			$("#button_share").attr("title", "Make Photo Private");
		} else {
			$("#button_share a").removeClass("active");
			$("#button_share").attr("title", "Share Photo");
		}

		image_view.attr("data-id", photoID);
		if (visibleControls()&&isPhotoSmall(data)) image_view.html("").append("<a id='previous' class='icon-caret-left'></a><a id='next' class='icon-caret-right'></a><div id='image' class='small' style='background-image: url(" + data.url + "); width: " + data.width + "px; height: " + data.height + "px; margin-top: -" + parseInt(data.height/2-20) + "px; margin-left: -" + data.width/2 + "px;'></div>");
		else if (visibleControls()) image_view.html("").append("<a id='previous' class='icon-caret-left'></a><a id='next' class='icon-caret-right'></a><div id='image' style='background-image: url(" + data.url + ")'></div>");
		else if (isPhotoSmall(data)) image_view.html("").append("<a id='previous' style='left: -50px' class='icon-caret-left'></a><a id='next' style='right: -50px' class='icon-caret-right'></a><div id='image' class='small' style='background-image: url(" + data.url + "); width: " + data.width + "px; height: " + data.height + "px; margin-top: -" + parseInt(data.height/2) + "px; margin-left: -" + data.width/2 + "px;'></div>");
		else image_view.html("").append("<a id='previous' style='left: -50px' class='icon-caret-left'></a><a id='next' style='right: -50px' class='icon-caret-right'></a><div id='image' style='background-image: url(" + data.url + "); top: 0px; right: 0px; bottom: 0px; left: 0px;'></div>");
		image_view.removeClass("fadeOut").addClass("fadeIn").show();
		
		if (!visibleControls()) hideControls(true);
		
		infobox.html(buildInfobox(data)).show();
		
		$.timer(300,function(){ content.show(); });
		
		loadingFadeOut();

	}, error: ajaxError });

}

function setPhotoStar() {

	loadingFadeIn("loading");

	photoID = image_view.attr("data-id");

	params = "function=setPhotoStar&photoID=" + photoID;
	$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

		if (data==1) {

			if ($("#button_star a.icon-star-empty").length) {
				$("#button_star a").removeClass("icon-star-empty icon-star").addClass("icon-star");
				$("#button_star").attr("title", "Unstar Photo");
			} else {
				$("#button_star a").removeClass("icon-star-empty icon-star").addClass("icon-star-empty");
				$("#button_star").attr("title", "Star Photo");
			}

			loadPhotos(content.attr("data-id"), true);
			loadingFadeOut();

		} else loadingFadeIn("error");

	}, error: ajaxError });

}

function setPhotoPublic(e) {

	loadingFadeIn("loading");

	photoID = image_view.attr("data-id");

	params = "function=setPhotoPublic&photoID=" + photoID + "&url=" + getViewLink(photoID);
	$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

		if (data==1) {

			if ($("#button_share a.active").length) {
				$("#button_share a").removeClass("active");
				$("#button_share").attr("title", "Make Private");
			} else {
				$("#button_share a").addClass("active");
				$("#button_share").attr("title", "Share Photo");
				showContextMenuShare(photoID, e.pageX, e.pageY);
			}

			loadPhotos(content.attr("data-id"), true);
			loadingFadeOut();

		} else loadingFadeIn("error");

	}, error: ajaxError });

}

function setPhotoDescription() {
	
	description = prompt("Please enter a description for this photo:", "");
	photoID = image_view.attr("data-id");
	
	if (description.length>0&&description.length<160) {
	
		loadingFadeIn("loading");

		params = "function=setPhotoDescription&photoID=" + photoID + "&description=" + escape(description);
		$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

			if (data==0) loadingFadeIn("error");
			else loadPhotoInfo(photoID);

		}, error: ajaxError });

	} else if (description.length>0) loadingFadeIn("error", "Error", "Description to short or too long. Please try another one!");

}

function loadDeleteAlbum(albumID, delAll) {

	loadingFadeIn("loading");

	params = "function=deleteAlbum&albumID=" + albumID + "&delAll=" + delAll;
	$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

		if (data==1) setURL("");
		else loadingFadeIn("error");

	}, error: ajaxError });

}

function loadDeletePhoto(photoID) {

	loadingFadeIn("loading");

	params = "function=deletePhoto&photoID=" + photoID;
	$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

		if (data==1) {
			hidePhoto(photoID);
			setURL("a" + content.attr("data-id"));
			loadingFadeOut();
		}
		else loadingFadeIn("error");

	}, error: ajaxError });

}

function loadSharePhoto(service, photoID) {

	loadingFadeIn("loading");

	params = "function=sharePhoto&photoID=" + photoID + "&url=" + getViewLink(photoID);
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {
	
		switch (service) {
			case 0:
				link = data.twitter;
				break;
			case 1:
				link = data.facebook;
				break;
			case 2:
				link = data.tumblr;
				break;
			case 3:
				link = data.pinterest;
				break;
			case 4:
				link = data.mail;
				break;
			case 5:
				link = "copy";
				modal = buildModal("Copy Link", "You can use this link to share your image with other people: <input class='copylink' value='" + getViewLink(photoID) + "'>", ["Close"], [""]);
				$("body").append(modal);
				$(".copylink").click();
				break;
			case 6:
				link = "copy";
				modal = buildModal("Copy Shortlink", "You can use this link to share your image with other people: <input class='copylink' value='" + data.shortlink + "'>", ["Close"], [""]);
				$("body").append(modal);
				$(".copylink").click();
				break;
			default:
				link = "";
				break;
		}

		if (link=="copy") loadingFadeOut();
		else if (link.length>5) {
			location.href = link;
			loadingFadeOut();
		} else loadingFadeIn("error");
		
	}, error: ajaxError });

}

function getAlbumArchive() {

	albumID = content.attr("data-id");
	if (location.href.indexOf("index.html")>0) link = location.href.replace(location.hash, "").replace("index.html", "php/api.php?function=getAlbumArchive&albumID=" + albumID);
	else link = location.href.replace(location.hash, "") + "php/api.php?function=getAlbumArchive&albumID=" + albumID;
	location.href = link;

}

function loadMovePhoto(photoID, albumID) {

	if (albumID>=0) {

		loadingFadeIn("loading");

		params = "function=movePhoto&photoID=" + photoID + "&albumID=" + albumID;
		$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

			if (data==1) {
				hidePhoto(photoID);
				setURL("a" + content.attr("data-id"));
				loadingFadeOut();
			} else loadingFadeIn("error");

		}, error: ajaxError });

	}

}

function loadPreviousPhoto() {

	albumID = content.attr("data-id");
	photoID = image_view.attr("data-id");
	
	params = "function=previousPhoto&photoID=" + photoID + "&albumID=" + albumID;
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {
	
		if (data!=false) setURL("a" + albumID + "p" + data.id);
	
	}, error: ajaxError });

}

function loadNextPhoto() {

	albumID = content.attr("data-id");
	photoID = image_view.attr("data-id");
	
	params = "function=nextPhoto&photoID=" + photoID + "&albumID=" + albumID;
	$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {

		if (data) setURL("a" + albumID + "p" + data.id);

	}, error: ajaxError });

}

function syncFolder() {

	params = "function=syncFolder";
	$.ajax({type: "POST", url: api_path, data: params, success: function(data) {

		if (data==1) setURL("a0");
		else loadingFadeIn("error");

	}, error: ajaxError });

}

function search(term) {

	clearTimeout($(window).data("timeout"));
	$(window).data("timeout", setTimeout(function() {
	
		if ($("#search").val().length<=2) {
		
			$(".divider").removeClass("fadeIn").addClass("fadeOut");
			loadAlbums();
			
		} else {
		
			$(".album, .photo").removeClass("contentZoomIn").addClass("contentZoomOut");
			$(".divider").removeClass("fadeIn").addClass("fadeOut");
			
			startTime = new Date().getTime();
		
			params = "function=search&term=" + term;
			$.ajax({type: "POST", url: api_path, data: params, dataType: "json", success: function(data) {
				console.log(data);
				albums = "";
				if (data.albums!=undefined&&data.albums!=null) $.each(data.albums, function() { albums += buildAlbum(this); });

				photos = "";
				if (data.photos!=undefined&&data.photos!=null) $.each(data.photos, function() { photos += buildPhoto(this); });
		
				durationTime = (new Date().getTime() - startTime);
				if (durationTime>300) waitTime = 0; else waitTime = 300 - durationTime;
				
				$.timer(waitTime,function(){
				
					if (albums==""&&photos=="") code = "";
					else if (albums=="") code = buildDivider("Photos")+photos;
					else if (photos=="") code = buildDivider("Albums")+albums;
					else code = buildDivider("Photos")+photos+buildDivider("Albums")+albums;

					content.html("").append(code);

					$(".album, .photo").removeClass("contentZoomOut").addClass("contentZoomIn");
					
				});
		
			}, error: ajaxError });
		
		}
		
	}, 250));

}

/*
	Error Function
	This function is called when an ajax-request fails.
*/

function ajaxError(jqXHR, textStatus, errorThrown) {
	console.log(jqXHR);
	console.log(textStatus);
	console.log(errorThrown);
	loadingFadeIn("error", textStatus, errorThrown);
}