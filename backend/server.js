const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretKey = "secret"; // Replace with your own secret key
const { v4: uuidv4 } = require('uuid');
const { log } = require("console");
//const {Deck, shuffleDeck} = require("./deck.js")
let deck = require('./deck.js')
//import Deck from './deck.js'

const PORT = 6969;
const app = express();
const server = http.createServer(app);
const REQUIRED_PLAYERS = 2;
const COUNTDOWN_DURATION = 5; // in seconds

const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"],
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
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB Atlas", error);
  });


// Define rooms array to store created rooms
const rooms = [];


// Define a function to start the game countdown for a room
function startGameCountdown(room) {
  console.log("startGameCountdown triggered");
  console.log("room data received: ", room);
  console.log("room users length: ", room.users.length);
  console.log("room name to emit: ", room.name);

  if (room.users.length >= REQUIRED_PLAYERS) {
    console.log("if statement triggered\n ########");
    io.to(room.name).emit("startCountdown");
    setTimeout(() => {
      io.to(room.name).emit("countdownEnd");
    }, COUNTDOWN_DURATION * 1000);
  }
}

// Connect to a socket, socket represents a user
io.on("connection", (socket) => {
  //variable holder for a connected name.
  let connectedName;

  // Chat feature
  socket.on("joinChat", (username) => {

    

    // Join a chat room or perform any necessary chat-related logic
    socket.join("chatRoom");

    console.log(`A user ${username} connected`);
    // Storing connected user's name into a variable
    connectedName = username;
    // Send "System: joined the chat" message to other users in the chat room
    socket.to("chatRoom").emit("chatMessage", {
      user: "System",
      message: `${username} joined the chat`,
    });
  });

  socket.on("chatMessage", (message) => {
    // Handle the received chat message
    const formattedMessage = {
      user: message.user,
      message: message.message,
    };

    // Broadcast the new message to all users in the chat room
    io.to("chatRoom").emit("chatMessage", formattedMessage);
  });

  // ROOMS
  // Send the list of rooms to the newly connected user
  socket.emit('roomList', rooms.map((room) => room.name));

  // Send the list of waiting rooms to the newly connected user
  socket.emit('waitingRooms', rooms.filter((room) => room.users.length > 0));

  socket.on('createRoom', ({ username, roomType }) => {
    // Generate a random room ID
    const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
    const roomName = `${roomType} - ${roomId}`;

    // Add the new room to the rooms array
    const newRoom = {
      name: roomName,
      type: roomType,
      users: [username],
      usersReady: [],
      shuffledDeck: deck
      
    };
    console.log('this is the deck that shuffled')
    console.log(newRoom.shuffledDeck)
    rooms.push(newRoom);

    // Join user that created room
    socket.join(roomName);
    //console.log(`Client ${socket.id} joined room ${roomName}`);
    console.log(`User ${username} joined room ${roomName}`);

    // Broadcast the new room to all users
    io.emit('roomList', rooms.map((room) => room.name));

    // Notify the user that they joined the room
    socket.emit('userJoinedRoom', newRoom);

    // Notify other users that a room was created (except the creator)
    socket.broadcast.emit('userJoinedRoom', newRoom);

    // Notify the creator that they joined their own room
    //socket.emit('userJoinedRoom', newRoom);

    // Broadcast the updated list of waiting rooms to all users
    io.emit('waitingRooms', rooms.filter((room) => room.users.length > 0));
  });


  socket.on('send-room-number', ({gameSelected}) => {
    const targetRoom = [rooms.find((room) => room.shuffledDeck)];
    console.log('purple dinosaurs')
    console.log(targetRoom)
    console.log(rooms.find((room) => room.shuffledDeck))
    console.log(rooms[0])
    //console.log(targetRoom)
    //console.log(rooms.find(gameSelected))
    console.log(rooms.shuffledDeck);
    if (rooms.find((room) => room.name)) {
      socket.emit('recieve-card-data', rooms.find((room) => room.shuffledDeck))
      console.log('pink dinosaurs')
    }
    
    
    //io.sockets.in(gameSelected).emit(roomId.shuffledDeck)
  });

  // JOINING ROOMS
  socket.on('joinRoom', ({ username, roomId }) => {
    console.log("room name received from frontend: ", roomId);
    // Find the room with the given roomId
    const targetRoom = rooms.find((room) => room.name === roomId);
    console.log("targetRoom name: ", targetRoom.name);
    console.log("######## \n");

    if (targetRoom) {
      // Add the user to the room's user list
      targetRoom.users.push(username);

      // Join the user to the room
      socket.join(targetRoom.name);
      console.log(`Client ${socket.id} joined room ${targetRoom.name}`);

      // Notify the user that they joined the room
      socket.emit('userJoinedRoom', targetRoom);

      // Notify other users in the room that a new user joined
      socket.to(roomId).emit('userJoinedRoom', targetRoom);

      // Notify the creator that a new user joined their room
      socket.broadcast.emit('userJoinedRoom', targetRoom);

      // Broadcast the updated user list to all users
      io.emit('roomList', rooms.map((r) => r.name));

      // Broadcast the updated list of waiting rooms to all users
      io.emit('waitingRooms', rooms.filter((room) => room.users.length > 0));
    }
  });

  // READY UP
  socket.on("readyUp", ({ username, room }) => {
    // Find the room with the given name
    const targetRoom = rooms.find((r) => r.name === room);
    console.log("found room from targetRoom.name: ", targetRoom.name);
    console.log("room name received from front end: ", room);

    if (targetRoom) {
      // Add the user to the room's usersReady list if they're not already added
      if (!targetRoom.usersReady.includes(username)) {
        targetRoom.usersReady.push(username);
      }

      // Broadcast the updated usersReady list to all users in the room
      io.to(room).emit("readyUp", targetRoom);

      // Start the countdown if all players are ready
      console.log("target room users ready length: ", targetRoom.usersReady.length);
      if (targetRoom.usersReady.length >= REQUIRED_PLAYERS){
        startGameCountdown(targetRoom);
      }
      console.log("\n ############# \n");
    }
  });

  // Handle the actual disconnect event
  socket.on("disconnect", () => {
    console.log(`A user ${connectedName} disconnected`);
    socket.disconnect();
  });
  
});

// Define user schema and model using Mongoose
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  salt: String,
});

const User = mongoose.model("User", userSchema);

// Routes
// Generate Salt to return to client
app.post("/auth/salt", async (req, res) => {
  try {
    const { username } = req.body;

    // Generate a unique salt
    const salt = generateSalt();

    // Send the salt back to the client
    res.status(200).json({ salt });
  } catch (error) {
    console.error("Error generating salt", error);
    res.status(500).json({ error: "An error occurred while generating salt" });
  }
});

// Add user to server
app.post("/auth/users", async (req, res) => {
  try {
    const { username, email, password, salt } = req.body;

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      salt,
    });

    // Save the user to the database
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ error: "An error occurred while registering user" });
  }
});

//LOGIN
app.post("/auth/ULogin", async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user in the collection based on the provided username
    const user = await User.findOne({ username });

    //testing
    console.log("Username received from client: " + username );

    if (!user) {
      // User not found
      return res.status(401).json({ error: "Invalid username" });
    }

    // Send the salt back to the client
    const userSalt = user.salt;
    res.status(200).json({ userSalt });
  } catch (error) {
    console.error("Error during username login", error);
    res.status(500).json({ error: "An error occurred during username login" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the collection based on the provided username
    const user = await User.findOne({ username });

    if (!user) {
      // User not found
      return res.status(401).json({ error: "Invalid username" });
    }

    // Compare the hashed passwords
    if (password !== user.password) {
      // Passwords don't match
      return res.status(401).json({ error: "Invalid password" });
    }

    // At this point, the login was successful
    // Generate a session token or JWT and send it back to the client
    const token = generateToken(username); // Implement your token generation logic

    res.cookie("sessionToken", token, { httpOnly: true }); // Set the token in a secure HTTP-only cookie

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Utility function for generating salt
function generateSalt() {
  const saltLength = 16; // Adjust the length of the salt to your preference

  // Generate a random salt using a cryptographically secure PRNG
  const salt = crypto.randomBytes(saltLength).toString("hex");

  return salt;
}

// Tokens
function generateToken(payload) {
  // Generate a token with the provided payload and secret key
  const token = jwt.sign({ username: payload }, secretKey, { expiresIn: "1h" });
  return token;
}

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}!`);
});
