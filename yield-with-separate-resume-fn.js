'use strict';

let fs = require('fs');
let http = require('http');

function getIpFromConfig(resume) {
    fs.readFile('config.conf', function (err, config) {
        if (err) {
            console.error(err);
            throw err;
        }

        let port = config.toString().match(/port=(\d+)/)[1]
        console.log(`Getting port ${port} from config`);

        resume(port);
    });
}

function startWebServer(resume, port) {
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
    }).listen(port);

    console.log(`Server is running (localhost:${port})`);

    setImmediate(function() {
        resume();
    });
}

function* run(resume) {
    let port = yield getIpFromConfig(resume);
    yield startWebServer(resume, port);

    console.log('Done!');
}

var r = run(resume);
r.next();

function resume(value) {
    r.next(value);
}

