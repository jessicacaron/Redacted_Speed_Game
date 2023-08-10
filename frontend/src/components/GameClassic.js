import './Game.css';
import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import ClassicGameBoard from './ClassicGameBoard';
import './ClassicGameBoard.css'
import { AppContext } from '../App'



function GameClassic() {
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();
  let { loggedInUser, gameSelected } = useContext(AppContext);
  const [tempCard, setTempCard] = useState([])
  
  const [playerUsername, setPlayerUsername] = useState('');

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io.connect('http://localhost:6969');

    // Listen for 'connect' event, which indicates successful connection
    socket.on('connect', () => {
      console.log('Connected to the server');
      setConnected(true);
      socket.emit('send-room-number', gameSelected)
      console.log(`gameSelected ${gameSelected}`)
      
      socket.on('recieve-card-data', (cardData) => {
        setTempCard(cardData);
        console.log("whhhooooooooooo")
        console.log(cardData)
        console.log(tempCard)
        console.log(cardData.shuffledDeck)
        
        console.log(cardData.shuffledDeck[0])
        console.log(cardData.shuffledDeck[0].rank)
      })

    });
    



    socket.on('playerJoined', (username) => {
        setPlayerUsername(username);
        console.log(`User ${username} is connected to the GameClassic`);
        
      });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [io.socket, gameSelected]);

  const handleExitClick = () => {
    
    navigate(`/lobby?username=${loggedInUser}`);
  };

  return (
    <main className="board">
      {connected ? (
        <div>
          {/* Render the game board when the connection is established */}
          <h1>Classic Speed Game</h1>
          {/* rest of game components here */}
          <button onClick={handleExitClick}>Exit</button>
          <h5>User:</h5>
          <h2 className='gameboard-username'>{loggedInUser}</h2>
          <h1>TESTING: {gameSelected}</h1>
          {/* <h3>cards: {JSON.stringify(tempCard)}</h3> */}


        </div>
      ) : (
        <div>
          {/* Display a loading message */}
          <h1>Connecting...</h1>
        </div>
      )}
      <div>{ClassicGameBoard(tempCard)}</div>
    </main>
  );
}

export default GameClassic;