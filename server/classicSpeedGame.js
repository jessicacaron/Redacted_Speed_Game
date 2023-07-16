const deck = require('./deck');
const shuffleDeck = require('./deck');
/*
FOR TESTING RUN TERMINAL
cd server
node classicSpeedGame.js
 */

// Piles of cards
const player1Pile = [];
const player2Pile = [];
const centerLeftPile = [];
const centerRightPile = [];

// Discard Piles
const discardedLeftPile = [];
const discardedRightPile = [];
const discardedUnionPile = []; // To join left and right discarded piles for shuffling


// Deal cards to player1Pile and player2Pile
for (let i = 0; i < 40; i++) {
    const card = deck.pop();

    if (i % 2 === 0) {
        player1Pile.push(card);
    } else {
        player2Pile.push(card);
    }
}

// Deal cards to centerLeftPile and centerRightPile
for (let i = 0; i < 6; i++) {
    const card1 = deck.pop();
    const card2 = deck.pop();

    centerLeftPile.push(card1);
    centerRightPile.push(card2);
}


console.log("Player 1 Hand: ", player1Pile.length, " cards");
console.log(player1Pile); // Display Player 1's pile in the console

console.log("Player 2 Hand: ", player2Pile.length, " cards");
console.log(player2Pile); // Display Player 2's pile in the console

console.log("Center Left Pile: ", centerLeftPile.length, " cards");
console.log(centerLeftPile); // Display the left center pile in the console

console.log("Center Right Pile: ", centerRightPile.length, " cards");
console.log(centerRightPile); // Display the right center pile in the console