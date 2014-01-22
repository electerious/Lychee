/**
 * @name        Modal Module
 * @description	Build, show and hide a modal.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

modal = {

	fns: null,

	show: function(title, text, buttons, marginTop, closeButton) {

		if (!buttons) {
			var buttons = [
				["", function() {}],
				["", function() {}]
			];
		}

		modal.fns = [buttons[0][1], buttons[1][1]];
		$("body").append(build.modal(title, text, buttons, marginTop, closeButton));
		$(".message input:first-child").focus();

	},

	close: function() {

		modal.fns = null;
		$(".message_overlay").removeClass("fadeIn").css("opacity", 0);
		setTimeout(function() { $(".message_overlay").remove() }, 300);

	}

}