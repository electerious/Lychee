/**
 * @description	Used to view single photos with view.php
 * @copyright	2015 by Tobias Reich
 */

var header		= $('header'),
	headerTitle	= $('#title'),
	imageview	= $('#imageview'),
	api_path	= 'php/api.php',
	infobox		= $('#infobox');

$(document).ready(function(){

	/* Event Name */
	if ('ontouchend' in document.documentElement)	eventName = 'touchend';
	else											eventName = 'click';

	/* Window */
	$(window).keydown(key);

	/* Infobox */
	infobox.find('.header .close').on(eventName, hideInfobox);
	$(document)			.on(eventName, '#infobox_overlay', hideInfobox);
	$('#button_info')	.on(eventName, showInfobox);

	/* Direct Link */
	$('#button_direct').on(eventName, function() {

		var link = $('#imageview #image').css('background-image').replace(/"/g,'').replace(/url\(|\)$/ig, '');
		window.open(link, '_newtab');

	});

	loadPhotoInfo(gup('p'));

});

key = function(e) {

	var code = (e.keyCode ? e.keyCode : e.which);

	if (code===27) {
		hideInfobox();
		e.preventDefault();
	}

}

getPhotoSize = function(photo) {

	// Size can be 'big', 'medium' or 'small'
	// Default is big
	// Small is centered in the middle of the screen
	var size		= 'big',
		scaled		= false,
		hasMedium	= photo.medium!=='',
		pixelRatio	= window.devicePixelRatio,
		view		= {
			width:	$(window).width()-60,
			height:	$(window).height()-100
		};

	// Detect if the photo will be shown scaled,
	// because the screen size is smaller than the photo
	if (photo.width>view.width||
		photo.width>view.height) scaled = true;

	// Calculate pixel ratio of screen
	if (pixelRatio!==undefined&&pixelRatio>1) {
		view.width	= view.width * pixelRatio;
		view.height	= view.height * pixelRatio;
	}

	// Medium available and
	// Medium still bigger than screen
	if (hasMedium===true&&
		(1920>view.width&&1080>view.height)) size = 'medium';

	// Photo not scaled
	// Photo smaller then screen
	if (scaled===false&&
		(photo.width<view.width&&
		photo.width<view.height)) size = 'small';

	return size;

}

showInfobox = function() {

	$('body').append("<div id='infobox_overlay' class='fadeIn'></div>");
	infobox.addClass('active');

}

hideInfobox = function() {

	$('#infobox_overlay').removeClass('fadeIn').addClass('fadeOut');
	setTimeout(function() { $('#infobox_overlay').remove() }, 300);
	infobox.removeClass('active');

}

loadPhotoInfo = function(photoID) {

	var params = 'function=getPhoto&photoID=' + photoID + '&albumID=0&password=""';
	$.ajax({type: 'POST', url: api_path, data: params, dataType: 'json', success: function(data) {

		var size = getPhotoSize(data);

		if (!data.title) data.title = 'Untitled';
		document.title = 'Lychee - ' + data.title;
		headerTitle.html(data.title);

		imageview.attr('data-id', photoID);

		if (size==='big')			imageview.html("<div id='image' style='background-image: url(" + data.url + ");'></div>");
		else if (size==='medium')	imageview.html("<div id='image' style='background-image: url(" + data.medium + ");'></div>");
		else						imageview.html("<div id='image' class='small' style='background-image: url(" + data.url + "); width: " + data.width + "px; height: " + data.height + "px; margin-top: -" + parseInt((data.height/2)-20) + "px; margin-left: -" + data.width/2 + "px;'></div>");

		imageview
			.removeClass('fadeOut')
			.addClass('fadeIn')
			.show();

		infobox.find('.wrapper').html(build.infoboxPhoto(data, true));

	}, error: ajaxError });

}

ajaxError = function(errorThrown, params, data) {

	console.error({
		description:	errorThrown,
		params:			params,
		response:		data
	});

}