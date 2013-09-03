/**
 * @name        modal.js
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2013 by Philipp Maurer, Tobias Reich
 *
 * Modal Module
 * Build, show and hide a modal.
 */

modal = {

	fns: null,

	show: function(title, text, buttons) {

		if (!buttons) {
			var buttons = [];
			buttons[0] = ["", function() {}];
			buttons[1] = ["", function() {}];
		}

		modal.fns = [buttons[0][1], buttons[1][1]];
		$("body").append(build.modal(title, text, buttons));
		$(".message input").focus();

	},

	close: function() {

		modal.fns = null;
		$(".message_overlay").removeClass("fadeIn").css("opacity", 0);
		$.timer(300,function(){ $(".message_overlay").remove() });

	}

}