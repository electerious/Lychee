/**
 * @description	This module communicates with Lychee's API
 * @copyright	2015 by Tobias Reich
 */

api = {

	path: 'php/api.php'

}

api.post = function(fn, params, callback) {

	var success,
		error;

	loadingBar.show();

	params =  $.extend({function: fn}, params);

	success = function(data) {

		setTimeout(function() { loadingBar.hide() }, 100);

		// Catch errors
		if (typeof data==='string'&&
			data.substring(0, 7)==='Error: ') {
				lychee.error(data.substring(7, data.length), params, data);
				return false;
		}

		// Convert 1 to true and an empty string to false
		if (data==='1')		data = true;
		else if (data==='')	data = false;

		// Convert to JSON if string start with '{' and ends with '}'
		if (typeof data==='string'&&
			data.substring(0, 1)==='{'&&
			data.substring(data.length-1, data.length)==='}') data = $.parseJSON(data);

		// Output response when debug mode is enabled
		if (lychee.debugMode) console.log(data);

		callback(data);

	}

	error = function(jqXHR, textStatus, errorThrown) {

		lychee.error('Server error or API not found.', params, errorThrown);

	}

	$.ajax({
		type: 'POST',
		url: api.path,
		data: params,
		dataType: 'text',
		success,
		error
	});

}