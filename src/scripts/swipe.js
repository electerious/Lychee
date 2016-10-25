/**
 * @description Swipes and moves an object.
 */

swipe = {

	obj       : null,
	tolerance : 150,
	offset    : 0

}

swipe.start = function(obj, tolerance) {

	if (obj)       swipe.obj       = obj
	if (tolerance) swipe.tolerance = tolerance

	return true

}

swipe.move = function(e) {

	if (swipe.obj===null) return false

	swipe.offset = -1 * e.x

	swipe.obj.css({
		WebkitTransform : 'translateX(' + swipe.offset + 'px)',
		MozTransform    : 'translateX(' + swipe.offset + 'px)',
		transform       : 'translateX(' + swipe.offset + 'px)'
	})

}

swipe.stop = function(e, left, right) {

	// Only execute once
	if (swipe.obj==null) return false

	if (e.x<=-swipe.tolerance) {

		left(true)

	} else if (e.x>=swipe.tolerance) {

		right(true)

	} else {

		swipe.obj.css({
			WebkitTransform : 'translateX(0px)',
			MozTransform    : 'translateX(0px)',
			transform       : 'translateX(0px)'
		})

	}

	swipe.obj    = null
	swipe.offset = 0

}