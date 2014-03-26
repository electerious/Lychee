/**
 * @name		Swipe Module
 * @description	Swipes and moves an object.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

swipe = {

	obj: null,
	tolerance: 150,
	offset: 0,

	start: function(obj, tolerance) {

		console.log('start with ' + obj);

		if (obj) swipe.obj = obj;
		if (tolerance) swipe.tolerance = tolerance;

		return true;

	},

	move: function(e) {

		console.log(e);

		offset = -1 * e.x;

		swipe.obj.css({
			WebkitTransform: 'translateX(' + offset + 'px)',
			MozTransform: 'translateX(' + offset + 'px)',
			transform: 'translateX(' + offset + 'px)'
		});

	},

	stop: function(e, left, right) {

		console.log('stop with ' + e.x);

		if (e.x<=-150) left();
		else if (e.x>=150) right();
		else {
			console.log('reset');
			swipe.obj.css({
				WebkitTransform: 'translateX(0px)',
				MozTransform: 'translateX(0px)',
				transform: 'translateX(0px)'
			});
		}

		swipe.obj = null;
		swipe.offset = 0;

	}

};