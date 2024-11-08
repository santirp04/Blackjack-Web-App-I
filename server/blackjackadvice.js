//-------------------------------------------------------------------------------
//Santiago Ramirez
//blackjackadvice.js
//gives advice based on the scores paresed from the URL on the local server
//-------------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const outcomesFilePath = path.join(__dirname, 'outcomes.json');     // the path to the outcomes file

// generates the advice based on the user and dealer scores
exports.generateAdvice = function(userScore, dealerScore, callback) {
    setImmediate(() => {
        // checks if score is an integer between 1 and 21
        const isValidScore = (score) => Number.isInteger(score) && score >= 1 && score <= 21;

        let validUserScore = isValidScore(userScore);
        let validDealerScore = isValidScore(dealerScore);

        
        if (validUserScore && !validDealerScore) {  // default scores if one of the scores are missing or invalid
            dealerScore = 6;
            validDealerScore = true;
        }
        if (!validUserScore && validDealerScore) {
            userScore = 14;
            validUserScore = true;
        }
        if (!validUserScore && !validDealerScore) {     // check if both scores are invalid or missing
            callback({status: 'Error', message: 'Invalid or missing userScore and dealerScore.'});
            return;
        }

        // decide on advice based on the scores
        let advice = '';
        if (userScore >= 17 && userScore <= 21) {
            advice = 'Stay';
        } else if (userScore >= 13 && userScore <= 16) {
            if (dealerScore >= 2 && dealerScore <= 6) {
                advice = 'Stay';
            } else {
                advice = 'Hit';
            }
        } else if (userScore >= 4 && userScore <= 12) {
            advice = 'Hit';
        } else {                // default for any unexpected scenarios
            advice = 'Stay';
        }
  
        const responseContent = {                   // create the response content with the scores and advice
            "User's Score": userScore.toString(),
            "Dealer's Score": dealerScore.toString(),
            "Advice": advice
        };     
        callback({status: 'Success', content: responseContent});    // call the callback with the success response
    });
};

exports.reportOutcome = function(outcome, callback) {
    setImmediate(() => {
        const validOutcomes = ['won', 'lost', 'push'];
        if (!validOutcomes.includes(outcome.toLowerCase())) {       // check if outcome is valid
            callback({status: 'Error', message: 'Invalid outcome parameter. Must be "won", "lost", or "push".'});
            return;
        }

        // read the existing outcomes from the file or initialize them
        fs.readFile(outcomesFilePath, 'utf8', (err, data) => {
            if (err) {          // call the callback if there is an error response
                callback({status: 'Error', message: 'Failed to read outcomes file. Try again.'});
                return;
            }
            let outcomes = {
                wins: 0,
                losses: 0,
                pushes: 0
            };
            outcomes = JSON.parse(data);        // parse the outcomes from the file
            if (outcome.toLowerCase() === 'won') {      // increment the count based on the outcome
                outcomes.wins += 1;
            } else if (outcome.toLowerCase() === 'lost') {
                outcomes.losses += 1;
            } else if (outcome.toLowerCase() === 'push') {
                outcomes.pushes += 1;
            }

            // write the updated outcomes back to the file
            fs.writeFile(outcomesFilePath, JSON.stringify(outcomes, null, 4), 'utf8', (writeErr) => {
                if (writeErr) {                         // call the callback with the error response
                    callback({status: 'Error', message: 'Failed to update outcomes. Try again.'});
                    return;
                }
                const responseContent = {               // set the response content with total counts
                    wins: outcomes.wins.toString(),
                    losses: outcomes.losses.toString(),
                    pushes: outcomes.pushes.toString()
                };
                // call the callback with the successful response
                callback({status: 'Success', content: responseContent});
            });
        });
    });
};

// resets the outcomes to the default values of 0 
exports.resetOutcomes = function(callback) {
    const defaultOutcomes = {       // sets the default outcomes
        won: 0,
        lost: 0,
        push: 0
    };
    // writes to the outcomes file and calls the callback if it was successful or not
    fs.writeFile(outcomesFilePath, JSON.stringify(defaultOutcomes, null, 2), (err) => {     
        if (err) {
            callback({status: 'Error', message: 'Failed to reset outcomes.'});
        } else {
            callback({status: 'Success', message: 'Outcomes have been reset.'});
        }
    });
};