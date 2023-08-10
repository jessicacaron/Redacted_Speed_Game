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
  
  const [playerUsername, setPlayerUsername] = useState('');

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io.connect('http://localhost:6969');

    // Listen for 'connect' event, which indicates successful connection
    socket.on('connect', () => {
      console.log('Connected to the server');
      setConnected(true);
    });

    socket.on('playerJoined', (username) => {
        setPlayerUsername(username);
        console.log(`User ${username} is connected to the GameClassic`);
      });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

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


        </div>
      ) : (
        <div>
          {/* Display a loading message */}
          <h1>Connecting...</h1>
        </div>
      )}
      <div>{ClassicGameBoard()}</div>
    </main>
  );
}

export default GameClassic;