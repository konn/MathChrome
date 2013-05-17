var els = $("img[src *= 'mimetex.cgi'], img[src^='http://chart.apis.google.com/chart'][src *='cht=tx']");

function getMath(obj){
    var url = obj.url();
    var type = url.attr('file');
    var tex;
    if (type == 'mimetex.cgi') {
	tex = decodeURIComponent(url.attr("query")).replace(/\~/g, " ");
    } else if (url.attr("host") == "chart.apis.google.com" && url.param('cht') == 'tx') {
	tex = url.param("chl");
    };
    return tex.replace(/￥|¥/g, '\\');
};

if (els.length) {
    els.replaceWith(function() {
	var math = getMath($(this));
	var display = '';
	if ($(this).parent().text().replace(/\s/g, "") == "" && !($(this).siblings().length)) {
	    display = '; mode=display';
	};

	return '<span style="font-size: 100%"><script type="math/tex' + display + '">' + math  + '</script></span>';
    });
    $('script').append('<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>');
};
