var marked  = require('marked')
  , _		= require('underscore')

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: true,
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

var navigation = [];

var renderer = new marked.Renderer()

renderer.table = function(header, body) {
    return '<table class="table table-striped table-bordered">\n'
    + '<thead>\n' + header + '</thead>\n'
    + '<tbody>\n' + body + '</tbody>\n'
    + '</table>\n';
};
renderer.heading = function(text, level, raw) {
	var link = this.options.headerPrefix+raw.toLowerCase().replace(/[\s\n]+/g, '-')
	navigation.push({
		level: level,
		text: text,
		link: '#' + link
	});
    return '<h'+level+' id="'+link+ '">'+ text + '</h'+level+'>\n';
};

module.exports = function(mdSrc){
	var html = marked(mdSrc, {renderer: renderer});
	var navi = _.clone(navigation);
	navigation = [];
	return {html: html, navigation: navi}
}
