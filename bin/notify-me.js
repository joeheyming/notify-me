#!/usr/bin/env node

var http = require('http');
var https = require('https'),
    fs = require('fs'),
    url = require('url'),
    sys = require('util'),
    exec = require('child_process').exec;

var handler = function(req, res) {
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
};

var server;
var cert = process.env.NOTIFYMECERT,
    key = process.env.NOTIFYMEKEY;
if (cert && key) {
   key = fs.readFileSync(key);
   cert = fs.readFileSync(cert);
   console.log('Reading in https certs');
   var options = { 
     key: key, 
     cert: cert
   };
   server = https.createServer(options, handler);
} else {
 server = http.createServer(handler);
}
server.addListener('request', handler);

var port = process.env.NOTIFYMEPORT || 3000;
server.listen(port);
console.log('Running notify-me.js on port ' + port);
