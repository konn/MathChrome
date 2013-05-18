var selector = "img[src *= 'mimetex.cgi'], img[src^='http://chart.apis.google.com/chart'][src *='cht=tx']"

if ($.url().attr("host") == "hooktail.sub.jp") {
  selector = selector + ", img.inlinemath, img.dispmath";
};

var isLaTeX2HTML = $("meta[name='Generator'][content*='LaTeX2HTML']").length > 0;

if (isLaTeX2HTML) {
  selector = selector + ", span.MATH img[alt]";
  selector = selector + ", div.mathdisplay img[alt]";
};

var els = $(selector);

function getMath(obj){
    var url = obj.url();
    var type = url.attr('file');
    var tex;
    if (type == 'mimetex.cgi') {
	tex = decodeURIComponent(url.attr("query")).replace(/\~/g, " ");
    } else if (url.attr("host") == "chart.apis.google.com" && url.param('cht') == 'tx') {
	tex = url.param("chl");
    } else if ($.url().attr("host") == "hooktail.sub.jp") {
	if (obj.hasClass('dispmath')) {
	    tex = '\\begin{align*}' + obj.attr("alt") + '\\end{align*}';
	} else {
	    tex = obj.attr("alt");
	};
    } else if (isLaTeX2HTML) {
	tex = obj.attr('alt').slice(1,-1);
    };
    return tex.replace(/￥|¥/g, '\\');
};

function isDisplay(obj) {
    var singleton = !isLaTeX2HTML && obj.parent().text().replace(/\s/g, "") == "" && !(obj.siblings().length);
    var dispclass = obj.hasClass('dispmath');
    return singleton || dispclass;
};

if (els.length) {
    els.replaceWith(function() {
	var math = getMath($(this));
	var display = '';
	if (isDisplay($(this))) {
	    display = '; mode=display';
	};

	return '<span style="font-size: 100%"><script type="math/tex' + display + '">' + math  + '</script></span>';
    });
    $('script').append('<script type="text/x-mathjax-config">MathJax.Hub.Config({TeX: {\
      Macros: {\
	bm:         ["{\\\\bf #1}",1]\
      }\
    }\
  });</script>');

    $('script').append('<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>');
};
