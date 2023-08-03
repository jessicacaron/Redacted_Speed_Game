import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io.connect('http://localhost:6969')

const GameList = () => {
    let [gameList, setGameList] = useState([]);
    let [gameNumber, setGameNumber] = useState(0)

    function addNewGame() {
        //gameList[gameNumber] = <Room/>;
        console.log('got here')
        //console.log(gameList);
        
        setGameNumber = gameNumber++;
        //Room.setPlayer1Name(localStorage.getItem('user'));
        //console.log(Room.player1Name);

    }


    return (
        <div>
            <h1>Games Avaible</h1>
            <button onClick={()=>addNewGame()}>Create Game</button>
            <div>{gameList}</div>
            <div><Room></Room></div>
        </div>
    )
}

const Room = () => {
    const [gameType, setGameType] = useState('none');
    const [player1Name, setPlayer1Name] = useState('Player1');
    const [player2Name, setPlayer2Name] = useState('Player2');
    const [player1Status, setPlayer1Status] = useState('...waiting');
    const [player2Status, setPlayer2Status] = useState('...waiting');

    const [room, setRoom] = useState("");
    

    const joinRoom = () => {
        if (room !== "") {
          socket.emit("join_room", room);
                    
        }
      }

    return (
        <div>
            <header>{gameType}</header>
            <rt>
                <rd>{player1Name}</rd>
                <rd>{player1Status}</rd>
            </rt>
            <rt>
                <rd>{player2Name}</rd>
                <td>{player2Status}</td>
            </rt>
            <button>Join Game</button>
        </div>
    )
}


export default GameList;