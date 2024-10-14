//-------------------------------------
//Santiago Ramirez
//view.js
//handles visual elements of the game
//-------------------------------------


function addMessage(msg) {                                      // adds given text to the message div
    var messageDiv = document.getElementById("messagediv");
    if (messageDiv !== null)
        messageDiv.innerHTML += msg + "<br>";
    messageDiv.scrollTop = messageDiv.scrollHeight;             // scroll the message div to see new messages
}

function clearMessages() {              // removes all messages from the message div.
    var messageDiv = document.getElementById("messagediv");
    if (messageDiv !== null)
        messageDiv.innerHTML = "";
}


function showDiv(divID) {               // show a div given the div's ID
    document.getElementById(divID).style.display = "block";
}

function hideDiv(divID) {               //hide a div given the div's ID
    document.getElementById(divID).style.display = "none";
}

function setUsername(username) {        // displays the username in the stats div                                    
    document.getElementById('displayUsername').innerText += username;   
}

function hasClass(element, className) {         // check if a class has a given class
    return element.classList.contains(className);
}

function addClass(element, className) {         // adds a given class to an element if it does not have the class
    if (element.classList)	
        element.classList.add(className);	
    else if (!hasClass(element, className))	
        element.className += " " + className;
}

function removeClass(element, className) {      // removes a given class from an element if the class has it
    if (element.classList)
        element.classList.remove(className);
}

function showDealtCard(player, facedown) {      // shows a dealt card for a given player (user or dealer) 
    var handDiv = document.getElementById(player + "Hand");
    var cardDiv = document.createElement("div");
    cardDiv.className = "card_deck";
    var card;
    if (facedown == true) {                 // checks if card should be facedown
        cardDiv.id = "facedown";
    } else if (player === "player") {       // checks if the card is from the player or dealer
        card = blackjack.player.userhand.cards[blackjack.player.userhand.cards.length - 1];
        cardDiv.id = card.getSuit().charAt(0) + card.getRank();     // gets the cards id with the suit and the rank
    } else if (player === "dealer") {
        card = blackjack.dealer.cards[blackjack.dealer.cards.length - 1];
        cardDiv.id = card.getSuit().charAt(0) + card.getRank();
    }
    handDiv.appendChild(cardDiv);           // appends the card
    $(cardDiv).hide().slideDown("slow");    // jQuery animation for the card
    updateCardsLeft();
}

function updateBet() {                      // updates the bet by calling setBet
    blackjack.setBet(blackjack.player.userBet);
}

function updateWallet() {                   // updates the display for the players wallet
    document.getElementById("walletAmount").innerText = blackjack.player.userWallet.getValue();
}

function updateCardsLeft() {                // updates the display for the cards left counter
    document.getElementById("cardsLeft").innerHTML = blackjack.carddeck.getNumCardsLeft();
}

function enablePlayButtons(enable) {        // switches between which buttons are avaiable
    document.getElementById("hit").disabled = !enable;          // hit and stand are only enabled when game is ongoing
    document.getElementById("stand").disabled = !enable;
    document.getElementById("deal").disabled = enable;          // once game has ended, deal and bet buttons should be enabled
    document.getElementById("betDecrement").disabled = enable;
    document.getElementById("betIncrement").disabled = enable;
}

function resetView() {                      // resets the game board
    document.getElementById("playerHand").innerHTML = "";
    document.getElementById("dealerHand").innerHTML = "";
    blackjack.player.userhand.setScore(0);
    blackjack.dealer.setScore(0);
    clearMessages();
    updateBet(0);
}