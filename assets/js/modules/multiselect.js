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
	
		if ($('.album:hover, .photo:hover').length!=0) return false;
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
		
	close: function() {
	
		$(document).off('mousemove');
		
		multiselect.position.top = null;
		multiselect.position.right = null;
		multiselect.position.bottom = null;
		multiselect.position.left = null;
		
		lychee.animate('#multiselect', "fadeOut");
		setTimeout(function() {
			$('#multiselect').remove();
		}, 300);
	
	}

}