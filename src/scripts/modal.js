/**
 * @description	Build, show and hide a modal.
 * @copyright	2014 by Tobias Reich
 */

modal = {

	fns: null

}

modal.show = function(title, text, buttons, marginTop, closeButton) {

	if (!buttons) {
		buttons = [
			['', function() {}],
			['', function() {}]
		];
	}

	modal.fns = [buttons[0][1], buttons[1][1]];

	$('body').append(build.modal(title, text, buttons, marginTop, closeButton));
	$('.message input:first-child').focus().select();

}

modal.close = function() {

	modal.fns = null;
	$('.message_overlay').removeClass('fadeIn').css('opacity', 0);
	setTimeout(function() { $('.message_overlay').remove() }, 300);

}
