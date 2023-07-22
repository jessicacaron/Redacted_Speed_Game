const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const PORT = 6969;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow requests from any origin
        methods: ['GET', 'POST'],
    }, // Handle Cross-Origin Resource Sharing requests
}); // Create a Socket.IO instance

// Middleware
app.use(cors());
app.use(express.json());

// Load environment variables
const mongodbAtlasConnectionString = process.env.ATLAS_URI;

// Connect to MongoDB Atlas
mongoose
    .connect(mongodbAtlasConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
      console.error('Failed to connect to MongoDB Atlas', error);
    });

io.on('connection', (socket) => {
    console.log('A user connected');

    // Chat feature
    socket.on('joinChat', (username) => {
        // Join a chat room or perform any necessary chat-related logic
        socket.join('chatRoom');

        // Broadcast a message to all users in the chat room
        socket.to('chatRoom').emit('chatMessage', {
            user: 'System',
            message: `${username} joined the chat`,
        });
    });

    socket.on('chatMessage', (message) => {
        // Handle the received chat message and broadcast it to all users in the chat room
        socket.to('chatRoom').emit('chatMessage', {
            user: message.user,
            message: message.message,
        });
    });

    // Speed card game feature
    socket.on('joinGame', (gameId) => {
        // Join the specific game room or perform any necessary game-related logic
        socket.join(gameId);

        // Emit a message or perform any necessary actions related to joining a game
        socket.emit('gameJoined', gameId);
    });

    // Game Data stuff for testing
    socket.on('gameData', (data) => {
        // Handle the received game data
        console.log('Received game data:', data);

        // Broadcast the game data to all users in the game room
        io.emit('gameData', data);
    })

    socket.on('startGame', (gameId) => {
        // Handle the start game event and emit it to all users in the game room
        io.to(gameId).emit('gameStarted');
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected');

        // Perform any necessary cleanup or logic when a user disconnects
    });
});




server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}!`);
});