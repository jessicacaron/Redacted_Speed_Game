import './Game.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";

function GameClassic() {
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

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
    navigate(`/lobby`);
  };

  return (
    <main className="board">
      {connected ? (
        <div>
          {/* Render the game board when the connection is established */}
          <h1>Classic Speed Game</h1>
          {/* rest of game components here */}
          <button onClick={handleExitClick}>Exit</button>
        </div>
      ) : (
        <div>
          {/* Display a loading message */}
          <h1>Connecting...</h1>
        </div>
      )}
    </main>
  );
}

export default GameClassic;