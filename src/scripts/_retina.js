/*! jQuery Retina Plugin */
(function(a) {
    a.fn.retina = function(c) {
        var d = {
            "retina-background": false,
            "retina-suffix": "@2x"
        };
        if (c) {
            a.extend(d, c)
        }
        var b = function(f, g) {
            var e = new Image();
            e.onload = function() {
                g(e)
            };
            e.src = f
        };
        if (window.devicePixelRatio > 1) {
            this.each(function() {
                var e = a(this);
                if (this.tagName.toLowerCase() == "img" && e.attr("src")) {
                    var g = e.attr("src").replace(/\.(?!.*\.)/, d["retina-suffix"] + ".");
                    b(g, function(h) {
                        e.attr("src", h.src);
                        var i = a("<div>").append(e.clone()).remove().html();
                        if (!(/(width|height)=["']\d+["']/.test(i))) {
                            e.attr("width", h.width / 2)
                        }
                    })
                }
                if (d["retina-background"]) {
                    var f = e.css("background-image");
                    if (/^url\(.*\)$/.test(f)) {
                        var g = f.substring(4, f.length - 1).replace(/\.(?!.*\.)/, d["retina-suffix"] + ".");
                        b(g, function(h) {
                            e.css("background-image", "url(" + h.src + ")");
                            if (e.css("background-size") == "auto auto") {
                                e.css("background-size", (h.width / 2) + "px auto")
                            }
                        })
                    }
                }
            })
        }
    }
})(jQuery);