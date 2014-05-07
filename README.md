GFM-srv [![](https://badge.fury.io/js/gfm-srv.png)](https://npmjs.org/package/gfm-srv)
========
Github Flavored Markdown renderer server. Supports Heroku.

## Install

~~~~~ bash
$ npm install -g gfm-srv
~~~~~

## Use

~~~~~ bash
# Start server on port 8000
$ gfm-srv

# Start server on port 8001 with writing logs in file *./nodeserver.log*
$ gfm-srv --port 8001 --logs ./nodeserver.log
~~~~~

## Use from scripts

~~~~~ js
//Require module
var server = require('gfm-srv');

// Start server
var nodeSrv = new server({
	port: 5000,
	root: '../www/',
	logs: true,
  static: './static/'
});

//Stop server
gfmSrv.stop();
~~~~~

## Options

- **-r, --root [path]** — Path, for server root-folder (default *./*)
- **-p, --port [number]** — Port on which the server is started (default *8000*, or env PORT)
- **-i, --index [file]** — Sets the index file for opening like default file in directories. For example: for uri */test/*, server open *test/index.html*. Default *index.html*
- **-l, --logs [path/boolean]** — Write logs flag. If you specify a path, it will write to this file (if path is folder, default filename node-srv.log) 
- **--404 [path]** — Path to 404 error page
- **--500 [path]** — Path to 500 error page
- **-s, --static [path]** — Sets path to folder with static files. Default `./static` in this module

## Use for [Heroku](https://heroku.com)

1. Install **gfm-srv** localy

  ~~~~~ bash
  $ npm install gfm-srv --save
  ~~~~~

2. Make [Procfile](https://devcenter.heroku.com/articles/getting-started-with-nodejs#declare-process-types-with-procfile)

  You can use root, logs, 404 500 arguments 

  ~~~~~ bash
  web: node node_modules/gfm-srv/index --logs --404 404.html
  ~~~~~

3. Deploy to heroku and enjoy!
