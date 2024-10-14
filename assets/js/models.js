//-------------------------------------------------------------------------------
//Santiago Ramirez
//modules.js
//main game logic. handles gameplay, deck of cards, and player and dealer hands
//-------------------------------------------------------------------------------

const suits = ["H","S","C","D"];	// array of given suits
const maxCardsPerSuit = 13;		    // max number of cards in each suit

var card = {            // card object defining getters and setters for suit, rank, and value
    suit: "",
    rank:0,
    value:0,
    setRank: function (value) { this.rank = value; },

    getRank: function () { return this.rank; },

    setSuit: function (value) { this.suit = value; },

    getSuit: function () { return this.suit; },

    setValue: function (value) { this.value = value; },
 
    getValue: function () { return this.value; },

    checkFaceCard: function () {                    // checks if card is a facecard
        if (this.getRank() > 10) { return true;
        } else return false; }
};

var card_deck = {       // defines the card deck
    deck: [],
    discarded: [],
    cardsleft: 52,
    DeckSize: 52,       // amount of cards in the deck
    
    initialize: function () {       // initializes the card deck and sets all the cards' values
        this.deck = [];
        this.discarded = [];
        for (let suit of suits) {                                   // nested for loop to go through each rank in each suit
            for (let rank = 1; rank <= maxCardsPerSuit; rank++) {
                let newCard = Object.create(card);
                newCard.setSuit(suit);
                newCard.setRank(rank);
                if (newCard.checkFaceCard() == true) {
                    newCard.setValue(10);                           // sets all face cards to a value of 10
                } else if(newCard.getRank() == 1) {
                    newCard.setValue(11);                           // sets all ace's to a default value of 11
                } else {
                    newCard.setValue(rank);                         // sets all other cards value to equal their rank
                }
                this.deck.push(newCard);                            // push the card into the deck array
            }
        }
        this.cardsleft = this.DeckSize;                             // set the counter for how many cards are left
    },

    shuffle: function () {              // shuffles the card deck
        let currentIndex = this.deck.length, randomIndex;
        while (currentIndex != 0) {                         // while there are still more elements left,
            randomIndex = Math.floor(Math.random() * currentIndex);     // pick a random element
            currentIndex--;
            [this.deck[currentIndex], this.deck[randomIndex]] = [this.deck[randomIndex], this.deck[currentIndex]];      // swap elements
        }
    },
    
    dealCard: function () {
        if (this.cardsleft < 16) {
            this.addBackDiscard();      // if there are less than 16 cards left, add back used cards
        }
        this.cardsleft--;               // decrement counter for how many cards are left
        return this.deck.pop();         // pops card from the deck and returns it
    },

    

    addBackDiscard: function () {       // adds the discarded cards from the discarded array back into the deck
        this.deck = this.deck.concat(this.discarded);
        this.discarded = [];
        this.cardsleft = this.deck.length;
        this.shuffle();
        addMessage("Adding back discarded cards and shuffling...");
    },

    getNumCardsLeft: function () {
        return this.cardsleft;
    }
};


var hand = {        // object defining a hand
    cards: [],
    score: 0,
    
    addCard: function (card) {      // adds a card to the hand
        this.cards.push(card);
        this.setScore(this.getScore() + card.getValue());       // set the score of the hand
        this.adjustForAces();       // check if ace value needs to be changed
    },
    
    setScore: function (value) {    // setter for the score of the hand
        this.score = value;
    },
    
    getScore: function () {         // getter for the score of the hand
        return this.score;
    },
    
    reset: function () {            // resets the hand
        this.cards = [];
        this.score = 0;
    },
    
    
    adjustForAces: function () {       // adjusts the score for aces if necessary
        let aces = this.cards.filter(card => card.getRank() === 1).length;      // only pick out the aces in the hand
        while (aces > 0 && this.score > 21) {       // while the score is over 21, subtract 10 to make the ace's value be 1
            this.score -= 10;
            aces--;                                 // go through all the ace's
        }
    }
};


var wallet = {          // object defining the players wallet
    value: 0,
    startingValue: 1000,
    
    setValue: function (amount) {           // setter for the value of the wallet
        this.value = amount;
    },
    
    getValue: function () {                 // getter for the value of the wallet
        return this.value;
    },
    
    addValue: function (amount) {           // add an amount to the value of the wallet
        this.value += amount;
    },
    
    decrementValue: function (amount) {     // removes an amount from the value of the wallet
        this.value -= amount;
    }
};

var user = {                            // user object for the player
    userhand: Object.create(hand),
    userBet: 0,
    userWallet: Object.create(wallet),

    setUserBet: function (amount) {          // setter for the users bet
        this.userBet = amount;
    },

    getUserBet: function (){                 // getter for the users bet
        return this.userBet;
    },
    
    resetUserBet: function () {             // resets the bet back to 0
        this.setUserBet(0);
        updateBet();
    },

    initialize: function () {               // initializes wallet to the given starting value
        this.userWallet.setValue(this.userWallet.startingValue);
    }
};

//blackjack game model
var blackjack = {
    carddeck: Object.create(card_deck),
    dealer: Object.create(hand),
    player: Object.create(user),
    betIncrementValue: 10,
    dealersHitLimit: 16,
    betMultiplier: 2,
    
    initialize: function () {               // initializes the blackjack game. creates a deck, shuffles the deck, sets the users's wallet
        this.carddeck.initialize();
        this.carddeck.shuffle();
        this.player.initialize();
        this.dealer.reset();
        this.player.userhand.reset();
    },
    
    deal: function () {                     // deals the starting hand
        if (blackjack.player.userBet > 0 && blackjack.player.userWallet.getValue() >= blackjack.player.userBet) {       // if bet is invalid, dont allow to play
            resetView();
            this.player.userWallet.setValue(this.player.userWallet.getValue() - this.player.getUserBet());      // gets the bet from the wallet
            updateWallet();
            this.player.userhand.addCard(this.carddeck.dealCard());         // deals the two starting cards for the player
            showDealtCard("player", false);
            this.player.userhand.addCard(this.carddeck.dealCard());
            showDealtCard("player", false);
            this.dealer.addCard(this.carddeck.dealCard());                  // deals the starting hand to the dealer, one card is facedown
            showDealtCard("dealer", true);
            this.dealer.addCard(this.carddeck.dealCard());
            showDealtCard("dealer", false);
            addMessage("Game Started!");
            enablePlayButtons(true);                                    // enables hit and stand buttons for the next turn, disabled deal and bets
        } else if (blackjack.player.userWallet.getValue() == 0){        // checks if player is out of money 
            addMessage("You are out of money.");                    
        } else {
            addMessage("Please place a valid bet.")
        }
    },
    
    hit: function () {                      // hits and deals a card
        this.player.userhand.addCard(this.carddeck.dealCard());     
        showDealtCard("player", false);
        if (!gamePlay.isGameOver()) {       // checks if game is over
            return;
        } else if (this.didPlayerBust()) {
            addMessage("Player Busts!");
            this.payBet(false, false);      // lost the bet
        } else if (this.didPlayerGetTwentyOne()) {
            addMessage("Player gets 21!");
            this.payBet(true, false);       // won the bet, will be paid
        }   
        enablePlayButtons(false);           // disables hit and stand buttons, reenables deal and bet buttons
    },

    stand: function () {                    // stands and switches to dealers turn
        var dealer = document.getElementById("dealerHand");
        var facedown = dealer.querySelector("#facedown");       // find the facedown dealer card
        if (facedown) {
            var unflipped = blackjack.dealer.cards[0];
            facedown.id = unflipped.getSuit().charAt(0) + unflipped.getRank();      // flips the facedown card, index 0 in the dealers hand
        }
        while (this.dealer.getScore() < this.dealersHitLimit) {         // as long as the dealers score isnt over given hit limit, the dealer will draw another card
            this.dealer.addCard(this.carddeck.dealCard());
            showDealtCard("dealer", false);
        }
        if (this.dealer.getScore() > 21) {                      // checks win / loss states
            addMessage("Dealer Busts! Player Wins!");
            this.payBet(true, false);           // won the bet, will be paid
        } else if (this.dealer.getScore() >= this.dealersHitLimit) {
            if (this.dealer.getScore() > this.player.userhand.getScore()) {         // checks who was closer to 21
                addMessage("Dealer Wins!");
                this.payBet(false, false);      // lost the bet
            } else if (this.dealer.getScore() == this.player.userhand.getScore()) {
                addMessage("Game Tied!");
                this.payBet(true, true);        // tied the bet, refunded

            } else if (this.didPlayerGetTwentyOne()) {
                addMessage("Player gets 21!");
                this.payBet(true, false);
            } else {
                addMessage("Player Wins!");         // player was closer to 21 than dealer
                this.payBet(true, false);
            }
        }
        enablePlayButtons(false);           // reenables deal and bet buttons, match has ended
    },

    discardCard: function () {              // discards all the cards into the discarded array
        while (this.player.userhand.cards.length > 0) {
            this.carddeck.discarded.push(this.player.userhand.cards.pop());
        }
    
        while (this.dealer.cards.length > 0) {          // discards all the dealers cards 
            this.carddeck.discarded.push(this.dealer.cards.pop());
        }
    },

    payBet: function (won, tied) {          // handles the bet and hands at the end of a round
        this.discardCard();                 // clears both hands, discards the cards
        let betIfWon = this.player.getUserBet() * this.betMultiplier;       // sets the possible payout with the given multiplier
        let betValue = this.player.userWallet.getValue()
        if (tied == true) {
            betIfWon = this.player.getUserBet();        // doesnt use the multiplier, refunds the bet if tied
        }  
        if (won == true){
            this.player.userWallet.setValue(betValue + (betIfWon));     // pays the bet if won
        }
        this.player.resetUserBet();         // sets bet back to 0
        updateWallet();
    },

    
    setBet: function (amount) {             // sets the bet amount before the round starts
        document.getElementById("betAmount").innerText = amount;
    },
    
    didPlayerBust: function () {            // checks to see if a player's score is over 21
        return this.player.userhand.getScore() > 21;
    },
    
    didPlayerGetTwentyOne: function () {    // checks to see if a player's score is 21
        return this.player.userhand.getScore() === 21;
    }
};

