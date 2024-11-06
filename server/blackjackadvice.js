//-------------------------------------------------------------------------------
//Santiago Ramirez
//blackjackadvice.js
//gives advice based on the scores paresed from the URL on the local server
//-------------------------------------------------------------------------------

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
        callback({
            status: 'Success',
            content: responseContent
        });
    });
};