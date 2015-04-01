fs     = require 'fs'
url    = require 'url'
path   = require 'path'
srv    = require 'node-srv'
_      = require 'underscore'
render = require './renderer'
pkg    = require '../package.json'

mdExts = ['.md', '.markdown']


gfmSrv = srv.extend
    name: pkg.name
    version: pkg.version

    constructor: (options)->
        @loadTemplate options.template if options and options.template
        srv.apply @, arguments

    addRequest: (req, res)->
        reqObj =
            request: req
            response: res
            uid: _.random 0, 10000000
            startTime: new Date()
            uri: url.parse(req.url).pathname.replace(/^\//, '').replace(/\/$/, '/' + @options.index)
            body: ''

        if reqObj.uri.length is 0
            reqObj.uri = @options.index

        if _.compact(reqObj.uri.split('/'))[0] is 'static'
            reqObj.filename = path.resolve process.cwd(), @options.static or '', reqObj.uri

        else
            reqObj.filename = path.resolve process.cwd(), @options.root or '', reqObj.uri

        @stack.push reqObj
        @ev.emit 'request'

    loadTemplate: (templatePath)->
        @_tmpl = fs.readFileSync(templatePath).toString()


gfmSrv.extendHandlers
    extnames: mdExts
    method: (reqObj, callback)->
        err = null
        filePath = reqObj.filename
        fileName = path.basename filePath, path.extname(filePath)

        reqObj.mime = "Content-Type": "text/html"
        reqObj.status = 200

        fs.readFile filePath, {encoding: 'utf-8'}, (err, file)=>
            if(err)
                @response500 err, callback
                @errorLog reqObj, 'Error 500: ' + JSON.stringify(err)
                return false

            try
                readyFile = render file
                template = _.template @_tmpl
                html = template
                    title: fileName.slice(0,1).toUpperCase() + fileName.slice(1).replace('_', ' ')
                    content: readyFile.html
                    navigation: readyFile.navigation

                reqObj.body = html

            catch e
                err = e
                console.error e

            callback err, reqObj


module.exports = gfmSrv
