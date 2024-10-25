//------------------------------------------
//Santiago Ramirez
//listeners.js
//provides the listners and event handling
//------------------------------------------

document.addEventListener("DOMContentLoaded", function() {      // waits for DOM to be loaded
    if (window.location.pathname.endsWith('index.html')) {  
        document.getElementById("loginform").addEventListener("submit", function() {        // listens for the submit button on the login form
            this.submit();                  // submits the form if valid
        });
        
    } else {        
        document.getElementById("hit").addEventListener("click", function() {
            blackjack.hit();            // calls the hit function to deal a card to the user
        });

        document.getElementById("stand").addEventListener("click", function() {
            blackjack.stand();          // calls the stand function to switch to the dealers turn
        });

        $("#xhrbutton").on("click", function() {
            blackjack.getXHR('https://convers-e.com/blackjackadvice.php?userscore='+blackjack.player.userhand.getScore()+'&dealerscore='+blackjack.dealer.getDealerShownScore());
        });

        $("#jquerybutton").on("click", function() {
            blackjack.getjQueryGET('https://convers-e.com/blackjackadvice.php?userscore='+blackjack.player.userhand.getScore()+'&dealerscore='+blackjack.dealer.getDealerShownScore());
        });

        $("#fetchbutton").on("click", function() {
            blackjack.getFetch('https://convers-e.com/blackjackadvice.php?userscore='+blackjack.player.userhand.getScore()+'&dealerscore='+blackjack.dealer.getDealerShownScore());
        });

        document.getElementById("deal").addEventListener("click", function() {
            blackjack.deal();           // starts a new game and deals the cards
            
        });

        document.getElementById("reset").addEventListener("click", function() {
            gamePlay.reset();           // resets the game completely
        });

        document.getElementById("betIncrement").addEventListener("click", function() {
            if (!document.getElementById("deal").disabled) {                    // if the game is not ongoing, incriment the bet by default amount
                blackjack.player.userBet += blackjack.betIncrementValue;
                updateBet();
            }
        });

        document.getElementById("betDecrement").addEventListener("click", function() {
            if (!document.getElementById("deal").disabled && blackjack.player.userBet > 0) {        // if the game isnt ongoing and the bet isnt negative, decrement bet by default
                blackjack.player.userBet -= blackjack.betIncrementValue;
                updateBet();
            }
        });
    }
});

