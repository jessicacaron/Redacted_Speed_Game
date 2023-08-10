import React from 'react';
import Card from './Card'
import { useState, useContext } from "react";
import io from 'socket.io-client';


const ClassicGameBoard = () => {
    const [player1DeckSize, setPlayer1DeckSize] = useState(15);
    const [player2DeckSize, setPlayer2DeckSize] = useState(15);
    const [reshufflePileSize, setReshufflePileSize] = useState(5);
    const [player1Hand, setPlayer1hand] = useState([])
    const num = 2;
    
    const socket = io("http://localhost6969")

    socket.on("connect", () => {
        socket.emit('get-game-board', player1Hand)

        socket.on('return-game-board', setPlayer1hand)
    })
    return (
        <div class="grid-container">
        <div class="grid-item"><Card rank="2" suit="SPADE" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="13" suit="HEART" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="3" suit="HEART" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="4" suit="CLUB" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="8" suit="SPADE" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="5" suit="CLUB" isFaceUp={false}></Card>{player1DeckSize}</div>
        <div class="grid-item">{player1Hand}</div>
        <div class="grid-item"><Card rank="5" suit="DIAMOND" isFaceUp={false}></Card>{reshufflePileSize}</div>
        <div class="grid-item"><Card rank="9" suit="DIAMOND" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="7" suit="HEART" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="5" suit="SPADE" isFaceUp={false}></Card>{reshufflePileSize}</div>
        <div class="grid-item"></div>
        <div class="grid-item"><Card rank="10" suit="CLUB" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="11" suit="CLUB" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="5" suit="DIAMOND" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="6" suit="HEART" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="5" suit="SPADE" isFaceUp={true}></Card></div>
        <div class="grid-item"><Card rank="5" suit="SPADE" isFaceUp={false}></Card>{player2DeckSize}</div>
        </div>
    )
}

export default ClassicGameBoard;