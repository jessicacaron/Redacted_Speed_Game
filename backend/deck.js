const suits = ['SPADE', 'HEART', 'DIAMOND', 'CLUB'];
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'];

function createDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            const card = { rank, suit };
            deck.push(card);
        }
    }

    console.log("Initial Deck " + deck.length);
    console.log(deck); // Display deck to console for testing purposes

    return deck;
}

//Knuth shuffle
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap cards at indices i and j
    }
    console.log("Shuffled Deck " + deck.length);
    console.log(deck);
}

const deck = createDeck();
shuffleDeck(deck);

module.exports = deck; // exports shuffled deck
module.exports.shuffleDeck = shuffleDeck; // exports the shuffle function

