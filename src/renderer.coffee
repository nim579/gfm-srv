Remarkable = require 'remarkable'
_          = require 'underscore'
hljs       = require 'highlight.js'

navigation = []


md = new Remarkable 'full',
    html: true
    linkify: true
    typographer: true

    highlight: (str, lang)->
        if lang and hljs.getLanguage(lang)
            try
                return hljs.highlight(lang, str).value

            catch e

        try
            return hljs.highlightAuto(str).value

        catch e

        return ''

md.renderer.rules.heading_open = (tokens, idx)->
    text = tokens[idx+1].content
    link = tokens[idx+1].content.toLowerCase().replace(/[\s\n]+/g, '-')

    navigation.push
        level: tokens[idx+1].level
        text: text
        link: '#' + link

    return "<h#{tokens[idx].hLevel} id=\"#{link}\">"

md.renderer.rules.table_open ->
    return '<table class="table table-striped table-bordered">'


module.exports = (mdSrc)->
    html = md.render mdSrc
    navi = _.clone navigation
    navigation = []
    return html: html, navigation: navi
