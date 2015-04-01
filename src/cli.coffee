pkg     = require '../package.json'
server  = require './server'
program = require 'commander'
_       = require 'underscore'
path    = require 'path'
root    = ''

try
    root = _.without(JSON.parse(process.env.npm_config_argv).original, 'start', 'gfm-srv', 'run-script', 'npm')[0]

catch e
    root = process.cwd()

module.exports = (pathToModuleRoot='./')->
    program.version pkg.version
        .option '-p, --port [number]', 'Sets port on which the server will work', process.env.PORT or '8000'
        .option '-r, --root [path]', 'Sets the root from which the server will run', root
        .option '-h, --host [host]', 'Sets hots on which the server will work', '0.0.0.0'
        .option '-i, --index [file]', 'Sets the index file for opening like default file in directories', 'README.md'
        .option '-l, --logs [path/boolean]', 'Logs writing flag', false
        .option '--404 [path]', 'Path to 404 error page', null
        .option '--500 [path]', 'Path to 500 error page', null
        .option '-s, --static [path]', 'Sets static folder', path.join path.dirname(process.mainModule.filename), pathToModuleRoot
        .option '-t, --template [path]', 'Sets path to page template', path.join path.dirname(process.mainModule.filename), pathToModuleRoot, './templates/main.html'
        .parse process.argv

    srv = new server program
    srv.exitCallback = ()->
        console.log('Server was shutdown at ' + new Date().toJSON());
