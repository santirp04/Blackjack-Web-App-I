//-------------------------------------------------------------------------------
//Santiago Ramirez
//server.js
//runs a local server using node.js that parses the URL for a GET request
//-------------------------------------------------------------------------------


const http = require('http');
const url = require('url');         // Require the URL module
const fs = require('fs');           // Require the file system module
const blackjackAdvice = require('./blackjackadvice'); 


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const parsedUrl = url.parse(req.url, true);
    const userScoreParam = parsedUrl.query.userscore;
    const dealerScoreParam = parsedUrl.query.dealerscore;
    const outcomeParam = parsedUrl.query.outcome;

    if (outcomeParam) {
        // Handle outcome reporting
        blackjackAdvice.reportOutcome(outcomeParam, (responseData) => {
            if (responseData.status === 'Success') {
                res.statusCode = 200;
            } else {
                res.statusCode = 400; // Bad Request for invalid outcomes
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(responseData));
            console.log(`Outcome Response sent: ${JSON.stringify(responseData)}`);
        });
    } else if (userScoreParam !== undefined && dealerScoreParam !== undefined) {
        // Parse scores as integers
        const userScore = parseInt(userScoreParam, 10);
        const dealerScore = parseInt(dealerScoreParam, 10);

        // Handle the advice generation asynchronously
        blackjackAdvice.generateAdvice(userScore, dealerScore, (responseData) => {
            if (responseData.status === 'Success') {
                res.statusCode = 200;
            } else {
                res.statusCode = 404;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(responseData));
            console.log(`Response sent: ${JSON.stringify(responseData)}`);
        });   
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
