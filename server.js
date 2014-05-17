var fs      = require('fs')
  , url     = require('url')
  , path    = require('path')
  , srv     = require('node-srv')
  , _       = require('underscore')
  , tmpl    = require('./template')
  , render  = require('./renderer')
  , mdExts  = ['.md', '.markdown'];

srv.prototype.addRequest = function(req, res){
    reqObj = {
        request: req,
        response: res,
        uid: _.random(0, 10000000),
        startTime: new Date(),
        uri: url.parse(req.url).pathname.replace(/^\//, '').replace(/\/$/, '/'+this.options.index),
        body: ''
    }
    if(reqObj.uri.length === 0){
        reqObj.uri = this.options.index;
    }

    if(_.compact(reqObj.uri.split(path.sep))[0] == 'static'){
        reqObj.filename = path.resolve(process.cwd(), this.options.static ? this.options.static : '', reqObj.uri);
    } else {
        reqObj.filename = path.resolve(process.cwd(), this.options.root ? this.options.root : '', reqObj.uri);
    }

    this.stack.push(reqObj);
    this.ev.emit('request');
}

srv.extendHandlers({
    extnames: mdExts,
    method: function(reqObj, callback){
        var err = null;
        var filePath = reqObj.filename;
        var fileName = path.basename(filePath, path.extname(filePath));

        reqObj.mime = {"Content-Type": "text/html"};
        reqObj.status = 200;
        fs.readFile(filePath, {encoding: 'utf-8'}, function(err, file){
            if(err){
                _this.response500(err, callback);
                this.errorLog(reqObj, 'Error 500: '+JSON.stringify(err));
                return false;
            }
            try {
                var readyFile = render(file);
                html = _.template(tmpl, {title: fileName.slice(0,1).toUpperCase() + fileName.slice(1).replace('_', ' '), content: readyFile.html, navigation: readyFile.navigation});
                reqObj.body = html;
            } catch(e) {
                err = e;
            }

            callback(err, reqObj);
        });
    }
});

module.exports = srv;
