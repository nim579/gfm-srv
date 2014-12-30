marked = require 'marked'
_      = require 'underscore'

marked.setOptions
    gfm: true
    tables: true
    breaks: true
    pedantic: true
    sanitize: true
    smartLists: true
    smartypants: true
    highlight: (code)->
        return require('highlight.js').highlightAuto(code).value

navigation = []
renderer = new marked.Renderer()

renderer.table = (header, body)->
    return """
           <table class="table table-striped table-bordered">
           <thead>#{header}</thead>
           <tbody>#{body}</tbody>
           </table>
           """

renderer.heading = (text, level, raw)->
    link = @options.headerPrefix + raw.toLowerCase().replace(/[\s\n]+/g, '-')
    navigation.push
        level: level
        text: text
        link: '#' + link

    return "<h#{level} id=\"#{link}\">#{text}</h#{level}>\n"

module.exports = (mdSrc)->
    html = marked mdSrc, renderer: renderer
    navi = _.clone navigation
    navigation = []
    return html: html, navigation: navi
