import React from 'react';

const Card = ({ rank, suit, isFaceUp }) => {
    let cardImagePath;

    // Define path to card assets based on the rank and suit
    if (rank === '11' || rank === '12' || rank === '13') {
        cardImagePath = `/assets/cards/${suit}-${rank}-${
            rank === '11' ? 'JACK' : rank === '12' ? 'QUEEN' : 'KING'
        }.svg`;
    } else {
        cardImagePath = `/assets/cards/${suit}-${rank}.svg`;
    }

    //style for back card to not be huge
    const cardBackStyle = {
        width: '238.117px', // Adjust the width to desired size
        height: 'auto', // Automatically adjust the height to maintain aspect ratio
    };

    return (
        <div className="card">
            {isFaceUp ? (
                <img src={cardImagePath} alt={`${rank} of ${suit}`} />
            ) : (
                <img src="/assets/cards/backRedDarkWHC.png" alt="Card back" style={cardBackStyle}/>
            )}
        </div>
    );
};

export default Card;