#!/usr/bin/env node

var http = require('http');
var url = require('url');
var sys = require('util'),
    exec = require('child_process').exec;

var app = http.createServer(function(req, res) {
        var parsedUrl = url.parse(req.url, true);
        var query = parsedUrl.query;
        var cocoa_cmd = parsedUrl.pathname.split('/')[1];
        
        console.log(req.url);
        console.log(cocoa_cmd, query);
        var cmd = "/Applications/CocoaDialog.app/Contents/MacOS/CocoaDialog " + cocoa_cmd;
        for (var k in query) {
            var v = query[k];
            var vmatch = v.match(/^[^']+$/);
            var kmatch = k.match(/^[0-9a-zA-Z\-_]+$/);
            if (kmatch) {
                cmd += ' --' + k;
            }
            if (vmatch && kmatch) { 
                cmd += ' \'' + v + '\'';
            }
        }
        console.log(cmd);
        var child = exec(cmd, 
                     function (errror, stdout, stderr) {
                         console.log('stdout: ', stdout);   
                         console.log('stderr: ', stderr);   
                     }
                     );  
        res.writeHead(200);
        res.end('OK\n');
});

port = process.env.NOTIFYMEPORT || 3000;
app.listen(port);
console.log('Running notify-me.js on port ' + port);
