var fs      = require('fs')
  , marked  = require('marked')
  , program = require('commander')
  , http    = require('http')
  , url     = require('url')
  , path    = require('path')
  , srv     = require('node-srv')
  , _       = require('underscore')
  , tmpl    = require('./template')
  , mdExts  = ['.md', '.markdown'];

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

var gfm = srv;

_.extend(gfm.prototype, {
    addRequest: function(req, res){
        reqObj = {
            request: req,
            response: res,
            uid: Math.floor(Math.random()*10000000),
            startTime: new Date(),
            uri: url.parse(req.url).pathname.replace(/^\//, '').replace(/\/$/, '/'+this.options.index),
            body: ''
        }
        if(reqObj.uri.length === 0){
            reqObj.uri = this.options.index;
        }
        if(this.isMD(reqObj.uri)){
            reqObj.filename = path.resolve(process.cwd(), this.options.root ? this.options.root : '', reqObj.uri);
        } else {
            reqObj.filename = path.resolve(process.cwd(), this.options.static ? this.options.static : '', reqObj.uri);
        }
        

        this.stack.push(reqObj);
        this.ev.emit('request');
    },
    isMD: function(filepath){
        return _.contains(mdExts, path.extname(filepath).toLowerCase())
    },
    startResponse: function(){
        if(this.stack.length > 0){
            var _this = this;
            var reqObj = this.stack[0];
            this.stack = _.without(this.stack, reqObj);

            if(this.isMD(reqObj.filename)){
                this.responseMD(reqObj, function(err, resObj){
                    _this.response(resObj);
                });
            } else {
                this.responseStatic(reqObj, function(err, resObj){
                    _this.response(resObj);
                });
            }
        }
    },
    responseMD: function(reqObj, callback){
        var _this = this;
        var filePath = reqObj.filename;
        var fileName = path.basename(filePath, path.extname(filePath))

        if(fs.existsSync(filePath)){
            reqObj.mime = {"Content-Type": "text/html"};
            reqObj.status = 200;
            fs.readFile(filePath, "binary", function(err, file){
                if(err){
                    _this.response500(err, callback);
                    this.errorLog(reqObj, 'Error 500: '+JSON.stringify(err));
                    return false;
                }
                try {
                    reqObj.body = _.template(tmpl, {title: fileName.slice(0,1).toUpperCase() + fileName.slice(1).replace('_', ' '), content: marked(file)});
                    reqObj.bodyType = "binary";

                    callback(null, reqObj);
                } catch(e) {
                    _this.response500(reqObj, e, callback);
                }
            });
        } else {
            this.response404(callback);
        }
    }
});

module.exports = gfm;