var Rcon = require('rcon');
const http = require('http');
const url = require('url');

// Get our environment variables - set in launch.json or in the docker-compose.yml file usually
const LISTENPORT = process.env.LISTENPORT || 8000;
const RCONPORT = process.env.RCONPORT || 8888;
const RCONSERVER = process.env.RCONSERVER;
const RCONPASSWORD = process.env.RCONPASSWORD;

// Toss up our little API server
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
  
    if (pathname === '/version') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        getServerVersion(callbackServerVersion, res);
    } else if (pathname === '/age') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        getServerAge(callbackServerAge, res);
    } else if (pathname === '/players') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        getServerPlayers(callbackServerPlayers, res);
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
        });
        res.end('Nothing found here!');
    }
});

server.listen(LISTENPORT, '0.0.0.0', () => {
    console.log('Listening to requests on port ' + LISTENPORT);
  });


function callbackServerAge(factorioAge, res) {
    res.end(JSON.stringify({"age" : factorioAge}));
}

function getServerAge(callback, res) {
    var conn = new Rcon(RCONSERVER, RCONPORT, RCONPASSWORD);

    conn.on('auth', function() {

    conn.send("/time");

    }).on('response', function(str) {
        callbackServerAge(str, res);
        conn.disconnect();
    });

    conn.connect();
}


function callbackServerVersion(factorioVersion, res) {
    res.end(JSON.stringify({"version" : factorioVersion}));
}

function getServerVersion(callback, res) {
    var conn = new Rcon(RCONSERVER, RCONPORT, RCONPASSWORD);

    conn.on('auth', function() {

    conn.send("/version");

    }).on('response', function(str) {
        callbackServerVersion(str, res);
        conn.disconnect();
    });

    conn.connect();
}

function callbackServerPlayers(playersList, res) {
    res.end(JSON.stringify(playersList)); // TODO: parse into a nice json setup
}

function getServerPlayers(callback, res) {
    var conn = new Rcon(RCONSERVER, RCONPORT, RCONPASSWORD);

    conn.on('auth', function() {

    conn.send("/players");

    }).on('response', function(str) {
        callbackServerPlayers(str, res);
        conn.disconnect();
    });

    conn.connect();
}