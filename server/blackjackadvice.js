//-------------------------------------------------------------------------------
//Santiago Ramirez
//blackjackadvice.js
//gives advice based on the scores paresed from the URL on the local server
//-------------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const outcomesFilePath = path.join(__dirname, 'outcomes.json');     // the path to the outcomes file


exports.generateAdvice = function(userScore, dealerScore, callback) {
    // Ensure asynchronous execution
    setImmediate(() => {
        // Helper function to validate scores
        const isValidScore = (score) => Number.isInteger(score) && score >= 1 && score <= 21;

        let validUserScore = isValidScore(userScore);
        let validDealerScore = isValidScore(dealerScore);

        // Assign default scores if necessary
        if (validUserScore && !validDealerScore) {
            dealerScore = 6;
            validDealerScore = true;
        }
        if (!validUserScore && validDealerScore) {
            userScore = 14;
            validUserScore = true;
        }
        // If both scores are invalid or missing
        if (!validUserScore && !validDealerScore) {
            callback({
                status: 'Error',
                message: 'Invalid or missing userScore and dealerScore.'
            });
            return;
        }

        // Generate advice based on the scores
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
        } else {
            // For any other unexpected scenarios
            advice = 'Stay';
        }

        // Prepare the response content
        const responseContent = {
            "User's Score": userScore.toString(),
            "Dealer's Score": dealerScore.toString(),
            "Advice": advice
        };

        // Invoke the callback with the success response
        callback({status: 'Success', content: responseContent});
    });
};

exports.reportOutcome = function(outcome, callback) {
    // Ensure asynchronous execution
    setImmediate(() => {
        // Validate the outcome parameter
        const validOutcomes = ['won', 'lost', 'push'];
        if (!validOutcomes.includes(outcome.toLowerCase())) {
            callback({
                status: 'Error',
                message: 'Invalid outcome parameter. Must be "won", "lost", or "push".'
            });
            return;
        }

        // Read the existing outcomes from the file or initialize them
        fs.readFile(outcomesFilePath, 'utf8', (err, data) => {
            let outcomes = {
                wins: 0,
                losses: 0,
                pushes: 0
            };
            outcomes = JSON.parse(data);
               
            // Increment the appropriate count based on the outcome
            switch (outcome.toLowerCase()) {
                case 'won':
                    outcomes.wins += 1;
                    break;
                case 'lost':
                    outcomes.losses += 1;
                    break;
                case 'push':
                    outcomes.pushes += 1;
                    break;

            }
            // Write the updated outcomes back to the file
            fs.writeFile(outcomesFilePath, JSON.stringify(outcomes, null, 4), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to outcomes.json:', writeErr);
                    callback({
                        status: 'Error',
                        message: 'Failed to update outcomes.'
                    });
                    return;
                }
                // Prepare the response content with total counts
                const responseContent = {
                    wins: outcomes.wins.toString(),
                    losses: outcomes.losses.toString(),
                    pushes: outcomes.pushes.toString()
                };
                // Invoke the callback with the success response
                callback({
                    status: 'Success',
                    content: responseContent
                });
            });
        });
    });
};