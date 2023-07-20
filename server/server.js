const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { WebSocket } = require('ws');
require('dotenv').config();

const PORT = 6969;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  })
})



server.listen(PORT, function() {
  console.log(`Server is listening on ${PORT}!`)
})