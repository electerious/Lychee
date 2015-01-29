function gup(b) {

	b = b.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

	var a = "[\\?&]" + b + "=([^&#]*)",
		d = new RegExp(a),
		c = d.exec(window.location.href);

	if (c === null) return '';
	else return c[1];

};