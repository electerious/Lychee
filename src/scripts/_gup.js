function gup(b) {

	b = b.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")

	let a = "[\\?&]" + b + "=([^&#]*)"
	let d = new RegExp(a)
	let c = d.exec(window.location.href)

	if (c === null) return ''
	else return c[1]

}