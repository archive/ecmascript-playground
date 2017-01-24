'use strict';

let fs = require('fs');
let http = require('http');

function getIpFromConfig(yielder) {
    fs.readFile('config.conf', function (err, config) {
        if (err) {
            console.error(err);
            throw err;
        }

        let port = config.toString().match(/port=(\d+)/)[1]
        console.log(`Getting port ${port} from config`);

        yielder.next(port);
    });
}

function startWebServer(yielder, port) {
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
    }).listen(port);

    console.log(`Server is running (localhost:${port})`);

    setImmediate(function() {
        yielder.next();
    });
}

/*function* run() {
    const yielder = this;
    let port = yield getIpFromConfig(yielder);
    yield startWebServer(yielder, port);

    console.log('Done!');
}

var r = new run();
r.next();*/


(new function* run() {
    const yielder = this;
    let port = yield getIpFromConfig(yielder);
    yield startWebServer(yielder, port);

    console.log('Done!');
}()).next();



