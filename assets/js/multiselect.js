/**
 * @name		Multiselect Module
 * @description	Select multiple albums or photos.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

multiselect = {

	position: {

		top: null,
		right: null,
		bottom: null,
		left: null

	},

	show: function(e) {

		if (mobileBrowser()) return false;
		if (lychee.publicMode) return false;
		if (visible.search()) return false;
		if ($('.album:hover, .photo:hover').length!==0) return false;
		if (visible.multiselect()) $('#multiselect').remove();

		multiselect.position.top = e.pageY;
		multiselect.position.right = -1 * (e.pageX - $(document).width());
		multiselect.position.bottom = -1 * (multiselect.position.top - $(window).height());
		multiselect.position.left = e.pageX;

		$('body').append(build.multiselect(multiselect.position.top, multiselect.position.left));
		$(document).on('mousemove', multiselect.resize);

	},

	resize: function(e) {

		var mouse_x = e.pageX,
			mouse_y = e.pageY,
			newHeight,
			newWidth;

		if (multiselect.position.top===null||
			multiselect.position.right===null||
			multiselect.position.bottom===null||
			multiselect.position.left===null) return false;

		if (mouse_y>=multiselect.position.top) {

			// Do not leave the screen
			newHeight = e.pageY - multiselect.position.top;
			if ((multiselect.position.top+newHeight)>=$(document).height())
				newHeight -= (multiselect.position.top + newHeight) - $(document).height() + 2;

			$('#multiselect').css({
				top: multiselect.position.top,
				bottom: 'inherit',
				height: newHeight
			});

		} else {

			$('#multiselect').css({
				top: 'inherit',
				bottom: multiselect.position.bottom,
				height: multiselect.position.top - e.pageY
			});

		}

		if (mouse_x>=multiselect.position.left) {

			// Do not leave the screen
			newWidth = e.pageX - multiselect.position.left;
			if ((multiselect.position.left+newWidth)>=$(document).width())
				newWidth -= (multiselect.position.left + newWidth) - $(document).width() + 2;

			$('#multiselect').css({
				right: 'inherit',
				left: multiselect.position.left,
				width: newWidth
			});

		} else {

			$('#multiselect').css({
				right: multiselect.position.right,
				left: 'inherit',
				width: multiselect.position.left - e.pageX
			});

		}

	},

	stopResize: function() {

		$(document).off('mousemove');

	},

	getSize: function() {

		if (!visible.multiselect()) return false;

		return {
			top: $('#multiselect').offset().top,
			left: $('#multiselect').offset().left,
			width: parseInt($('#multiselect').css('width').replace('px', '')),
			height: parseInt($('#multiselect').css('height').replace('px', ''))
		};

	},

	getSelection: function(e) {

		var tolerance = 150,
			id,
			ids = [],
			offset,
			size = multiselect.getSize();

		if (visible.contextMenu()) return false;
		if (!visible.multiselect()) return false;

		$('.photo, .album').each(function() {

			offset = $(this).offset();

			if (offset.top>=(size.top-tolerance)&&
				offset.left>=(size.left-tolerance)&&
				(offset.top+206)<=(size.top+size.height+tolerance)&&
				(offset.left+206)<=(size.left+size.width+tolerance)) {

					id = $(this).data('id');

					if (id!=='0'&&id!==0&&id!=='f'&&id!=='s'&&id!==null&id!==undefined) {

						ids.push(id);
						$(this).addClass('active');

					}

				}

		});

		if (ids.length!==0&&visible.album()) contextMenu.photoMulti(ids, e);
		else if (ids.length!==0&&visible.albums()) contextMenu.albumMulti(ids, e);
		else multiselect.close();

	},

	close: function() {

		multiselect.stopResize();

		multiselect.position.top = null;
		multiselect.position.right = null;
		multiselect.position.bottom = null;
		multiselect.position.left = null;

		lychee.animate('#multiselect', 'fadeOut');
		setTimeout(function() {
			$('#multiselect').remove();
		}, 300);

	}

};