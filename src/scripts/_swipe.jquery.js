(function($) {
	var Swipe = function(el) {
		var self = this

		this.el = $(el)
		this.pos = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }
		this.startTime

		el.on('touchstart', function(e) { self.touchStart(e) })
		el.on('touchmove',  function(e) { self.touchMove(e) })
		el.on('touchend',   function(e) { self.swipeEnd() })
		el.on('mousedown',  function(e) { self.mouseDown(e) })
	}

	Swipe.prototype = {
		touchStart: function(e) {
			var touch = e.originalEvent.touches[0]

			this.swipeStart(e, touch.pageX, touch.pageY)
		},

		touchMove: function(e) {
			var touch = e.originalEvent.touches[0]

			this.swipeMove(e, touch.pageX, touch.pageY)
		},

		mouseDown: function(e) {
			var self = this

			this.swipeStart(e, e.pageX, e.pageY)

			this.el.on('mousemove', function(e) { self.mouseMove(e) })
			this.el.on('mouseup', function() { self.mouseUp() })
		},

		mouseMove: function(e) {
			this.swipeMove(e, e.pageX, e.pageY)
		},

		mouseUp: function(e) {
			this.swipeEnd(e)

			this.el.off('mousemove')
			this.el.off('mouseup')
		},

		swipeStart: function(e, x, y) {
			this.pos.start.x = x
			this.pos.start.y = y
			this.pos.end.x = x
			this.pos.end.y = y

			this.startTime = new Date().getTime()

			this.trigger('swipeStart', e)
		},

		swipeMove: function(e, x, y) {
			this.pos.end.x = x
			this.pos.end.y = y

			this.trigger('swipeMove', e)
		},

		swipeEnd: function(e) {
			this.trigger('swipeEnd', e)
		},

		trigger: function(e, originalEvent) {
			var self = this

			var
				event = $.Event(e),
				x = self.pos.start.x - self.pos.end.x,
				y = self.pos.end.y - self.pos.start.y,
				radians = Math.atan2(y, x),
				direction = 'up',
				distance = Math.round(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))),
				angle = Math.round(radians * 180 / Math.PI),
				speed = Math.round(distance / ( new Date().getTime() - self.startTime ) * 1000)

			if ( angle < 0 ) {
				angle = 360 - Math.abs(angle)
			}

			if ( ( angle <= 45 && angle >= 0 ) || ( angle <= 360 && angle >= 315 ) ) {
				direction = 'left'
			} else if ( angle >= 135 && angle <= 225 ) {
				direction = 'right'
			} else if ( angle > 45 && angle < 135 ) {
				direction = 'down'
			}

			event.originalEvent = originalEvent

			event.swipe = { x: x, y: y, direction: direction, distance: distance, angle: angle, speed: speed }

			$(self.el).trigger(event)
		}
	}

	$.fn.swipe = function() {
		var swipe = new Swipe(this)

		return this
	}
})(jQuery)