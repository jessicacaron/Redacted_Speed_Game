const deck = require('./deck');
const shuffleDeck = require('./deck');


/*
FOR TESTING RUN TERMINAL
cd backend
node californiaSpeedGame.js
 */

// Piles of cards
const player1Pile = [];
const player2Pile = [];

// Discard Piles for player 1
const p1Deck1Pile = [];
const p1Deck2Pile = [];
const p1Deck3Pile = [];
const p1Deck4Pile = [];
const p1DiscardedUnionPile = []; // To join p1Deck1, 2, 3, and 4 piles for shuffling.

// Discard Piles for player 2
const p2Deck1Pile = [];
const p2Deck2Pile = [];
const p2Deck3Pile = [];
const p2Deck4Pile = [];
const p2DiscardedUnionPile = []; // To join p2Deck1, 2, 3, and 4 piles for shuffling.





// Deal cards to player1Pile and player2Pile
for (let i = 0; i < 52; i++) {
    const card = deck.pop();

    if (i % 2 === 0) {
        player1Pile.push(card);
    } else {
        player2Pile.push(card);
    }
}


console.log("Player 1 Hand: ", player1Pile.length, " cards");
console.log(player1Pile); // Display Player 1's pile in the console

console.log("Player 2 Hand: ", player2Pile.length, " cards");
console.log(player2Pile); // Display Player 2's pile in the console