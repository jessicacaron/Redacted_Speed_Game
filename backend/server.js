const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretKey = "secret"; // Replace with your own secret key

const PORT = 6969;
const app = express();
const server = http.createServer(app);

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

// Connect to socket
io.on("connection", (socket) => {
  console.log("A user connected");

  // Chat feature
  socket.on("joinChat", (username) => {
    // Join a chat room or perform any necessary chat-related logic
    socket.join("chatRoom");

    // Broadcast a message to all users in the chat room
    socket.to("chatRoom").emit("chatMessage", {
      user: "System",
      message: `${username} joined the chat`,
    });
  });

  socket.on("chatMessage", (message) => {
    // Handle the received chat message and broadcast it to all users in the chat room
    socket.to("chatRoom").emit("chatMessage", {
      user: message.user,
      message: message.message,
    });
  });

  // Speed card game feature
  socket.on("joinGame", (gameId) => {
    // Join the specific game room or perform any necessary game-related logic
    socket.join(gameId);

    // Emit a message or perform any necessary actions related to joining a game
    socket.emit("gameJoined", gameId);
  });

  // Game Data stuff for testing
  socket.on("gameData", (data) => {
    // Handle the received game data
    console.log("Received game data:", data);

    // Broadcast the game data to all users in the game room
    io.emit("gameData", data);
  });

  socket.on("startGame", (gameId) => {
    // Handle the start game event and emit it to all users in the game room
    io.to(gameId).emit("gameStarted");
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");

    // Perform any necessary cleanup or logic when a user disconnects
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
    console.log("Username received from client: " + { username });

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
