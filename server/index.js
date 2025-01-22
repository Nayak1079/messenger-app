// Import necessary modules
const express = require("express"); // Framework for building web applications
const { Server } = require("socket.io"); // Library for real-time bidirectional communication
const helmet = require("helmet"); // Middleware for securing Express apps by setting HTTP headers
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const session = require("express-session"); // Middleware for managing user sessions
const authRouter = require("./routers/authRouters"); // Custom router for authentication-related routes
const dotenv = require("dotenv"); // For loading environment variables from a .env file
const http = require("http"); // Core Node.js module for creating an HTTP server
const Redis = require("ioredis"); // Library for connecting to a Redis database
const { RedisStore } = require("connect-redis"); // Library for using Redis as a session store
const { sessionMiddleware, wrap } = require("./controllers/ServerController"); // Custom middleware functions

// Load environment variables from a .env file into process.env
dotenv.config();

const app = express(); // Create an Express application instance
const server = http.createServer(app); // Create an HTTP server for the Express app

// Initialize a Socket.IO server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this frontend origin
    credentials: true, // Allow cookies to be sent with requests
  },
});

// Create a Redis client to connect to the Redis server
const redisClient = new Redis();

// Security Middleware
app.use(helmet()); // Adds security-related HTTP headers to the responses
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from the frontend running on localhost:3000
    credentials: true, // Allow credentials like cookies to be included in requests
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use session middleware to handle user sessions
app.use(sessionMiddleware);

// Define the routes for authentication
app.use("/auth", authRouter); // Mount the authRouter on the '/auth' endpoint

// Attach the session middleware to WebSocket connections
io.use(wrap(sessionMiddleware)); // Wrap the session middleware for use with Socket.IO

// Set up a WebSocket connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id); // Log the socket ID when a user connects

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id); // Log the socket ID when a user disconnects
  });
});

// Global Error Handler (optional)
// Handles errors that occur in the app and sends a 500 response
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ error: "Something went wrong!" }); // Send a generic error response
});

// Start the HTTP server and listen for requests on port 4000
server.listen(4000, () => {
  console.log("Server listening on port 4000"); // Log that the server has started
});

