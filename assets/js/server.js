//-------------------------------------------------------------------------------
//Santiago Ramirez
//server.js
//runs a local server using node.js that parses the URL for a GET request
//-------------------------------------------------------------------------------


const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const userScore = parsedUrl.query.userscore;
    const dealerScore = parsedUrl.query.dealerscore;
    
    if (userScore && dealerScore) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({userScore, dealerScore}));
        console.log(JSON.stringify({userScore, dealerScore}));
    } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Missing userScore or dealerScore query parameters\n');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
