/**
 * @name		Swipe Module
 * @description	Swipes and moves an object.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

swipe = {

	object: null,
	position: {
		x: null,
		y: null
	},

	start: function(object, e) {

		console.log('start with ' + object);

		swipe.object = object;

		if (swipe.position.x===null)
			swipe.position.x = e.originalEvent.pageX;

		if (swipe.position.y===null)
			swipe.position.y = e.originalEvent.pageY;

		return true;

	},

	move: function(e) {

		var offset = {
			x: -1 * (swipe.position.x - e.originalEvent.pageX),
			y: -1 * (swipe.position.y - e.originalEvent.pageY)
		}

		if (swipe.position.x!==null) {
			$(swipe.object).css({
				'-webkit-transform': 'translateX(' + offset.x + 'px);',
				'-moz-transform': 'translateX(' + offset.x + 'px);',
				'transform': 'translateX(' + offset.x + 'px);'
			});
		}

		console.log(offset);

	},

	stop: function() {

		console.log('stop');

		swipe.object = null;
		swipe.position.x = null;
		swipe.position.y = null;

	}

};