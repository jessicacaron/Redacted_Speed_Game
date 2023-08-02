import './Game.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function GameClassic () {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Connect to the Socket.IO server
        const socket = io.connect('http://localhost:6969');

        // Listen for 'connect' event, which indicates successful connection
        socket.on('connect', () => {
            console.log('Connected to the server');
            setConnected(true);
        });

        // Clean up the socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    return(
        <main className="board">
            {connected ? (
                <div>
                    {/* Render the game board when the connection is established */}
                    <h1>Classic Speed Game</h1>
                    {/* rest of game components here */}
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