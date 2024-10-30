//-------------------------------------------------------------------------------
//Santiago Ramirez
//blackjackadvice.js
//gives advice based on the scores paresed from the URL on the local server
//-------------------------------------------------------------------------------

function generateAdvice(callback) {
    
    if (userScore >= 17 && userScore <= 21) {
        if (dealerScore >= 2 && dealerScore <= 5) {
            var advice = "Stay";
        } else if (dealerScore >= 6 && dealerScore <= 11) {
            var advice = "Stay";
        }
    } else if (userScore >= 13 && userScore <= 16) {
        if (dealerScore >= 2 && dealerScore <= 5) {
            var advice = "Stay";
        } else if (dealerScore >= 6 && dealerScore <= 11) {
            var advice = "Hit";
        }
    } else if (userScore >= 4 && userScore <= 12) {
        if (dealerScore >= 2 && dealerScore <= 5) {
            var advice = "Hit";
        } else if (dealerScore >= 6 && dealerScore <= 11) {
            var advice = "Hit";
        }
    }

    // Execute the callback function with the selected advice
    callback(advice);
}