const deck = require('./deck');
const shuffleDeck = require('./deck');
/*
FOR TESTING RUN TERMINAL
cd backend
node classicSpeedGame.js
 */

// Initialize hands for player1 and player2
const player1Hand = [];
const player2Hand = [];

// Piles of cards
const player1Pile = [];
const player2Pile = [];
const centerLeftPile = [];
const centerRightPile = [];

// Discard Piles
const discardedLeftPile = [];
const discardedRightPile = [];
const discardedUnionPile = []; // To join left and right discarded piles for shuffling

// Variable to keep track of the number of cards drawn by each player
let numCardsDrawnPlayer1 = 5;
let numCardsDrawnPlayer2 = 5;


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

console.log("Player 1 Pile: ", player1Pile.length, " cards");
console.log(player1Pile); // Display Player 1's pile in the console

console.log("Player 2 Pile: ", player2Pile.length, " cards");
console.log(player2Pile); // Display Player 2's pile in the console

console.log("Center Left Pile: ", centerLeftPile.length, " cards");
console.log(centerLeftPile); // Display the left center pile in the console

console.log("Center Right Pile: ", centerRightPile.length, " cards");
console.log(centerRightPile); // Display the right center pile in the console

// Draw initial cards for each player's hand (assuming they have 5 cards in their pile to start)
drawCards(player1Pile, player1Hand, 5);
drawCards(player2Pile, player2Hand, 5);

console.log("Player 1 Hand: ", player1Hand.length, " cards");
console.log(player1Hand); // Display Player 1's pile in the console

console.log("Player 2 Hand: ", player2Hand.length, " cards");
console.log(player2Hand); // Display Player 2's pile in the console


// Function checks valid move on central pile
function isValidMove(card, centralPile) {
    if (centralPile.length === 0) {
        return true; // If the central pile is empty, any card can be played
    }

    const topCard = centralPile[centralPile.length - 1];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'];

    // Convert rank to numerical value to perform comparisons
    const cardRankValue = ranks.indexOf(card.rank);
    const topCardRankValue = ranks.indexOf(topCard.rank);

    // Check for special cases of playing "1" on "13" and vice versa
    if ((cardRankValue === 0 && topCardRankValue === 12) || (cardRankValue === 12 && topCardRankValue === 0)) {
        return true;
    }

    // Check if the card's rank is one higher or one lower than the top card on the central pile
    return (
        (cardRankValue === topCardRankValue + 1) ||
        (cardRankValue === topCardRankValue - 1)
    );
}

// Function to play a card from a player's pile onto the central pile
function playCard(playerHand, centerLeftPile, centerRightPile, playedCard) {
    const cardIndex = playerHand.findIndex((card) => card.id === playedCard.id);

    if (playerHand.length === 0) {
        return false; // If the player's hand is empty, they cannot play a card
    }

    if (cardIndex !== -1 && (isValidMove(playedCard, centerLeftPile) || isValidMove(playedCard, centerRightPile))) {
        playerHand.splice(cardIndex, 1);

        if (isValidMove(playedCard, centerLeftPile)) {
            centerLeftPile.push(playedCard);
        } else {
            centerRightPile.push(playedCard);
        }
    }
}


// Function to draw cards from the player's pile and add them to their hand
function drawCards(playerPile, hand) {
    let cardsToDraw = 5 - hand.length;
    while (hand.length < 5 && playerPile.length > 0 && cardsToDraw > 0) {
        const card = playerPile.pop();
        hand.push(card);
        cardsToDraw--;
    }
}