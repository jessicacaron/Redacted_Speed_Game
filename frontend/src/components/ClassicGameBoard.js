import React from 'react';
import Card from './Card'
import { useState, useContext } from "react";


const ClassicGameBoard = () => {



    const [player1DeckSize, setPlayer1DeckSize] = useState(20);
    const [player2DeckSize, setPlayer2DeckSize] = useState(20);
    const [reshufflePileSize, setReshufflePileSize] = useState(5);


    return (
        <div class="grid-container">
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}{player1DeckSize}</div>
        <div class="grid-item"></div>
        <div class="grid-item">{Card(5,'SPADE',true)}{reshufflePileSize}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}{reshufflePileSize}</div>
        <div class="grid-item"></div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}</div>
        <div class="grid-item">{Card(5,'SPADE',true)}{player2DeckSize}</div>
        </div>
    )
}

export default ClassicGameBoard;