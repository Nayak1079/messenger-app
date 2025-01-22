// Import necessary modules
const session = require("express-session"); // Middleware for managing user sessions
const { RedisStore } = require("connect-redis"); // Library to use Redis as a session store
const redisClient = require("../redis"); // Import the Redis client configuration from a custom module
const e = require("express"); // Import Express (not used here but included, likely for future use)

// Configure the session middleware
const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET || "defaultSecretKey", // Secret key used to sign the session ID cookie; fallback for development
  name: "sid", // Custom name for the session ID cookie (default is 'connect.sid')
  store: new RedisStore({ client: redisClient }), // Use Redis as the session store
  resave: false, // Prevent resaving the session if it hasn't been modified
  saveUninitialized: false, // Don't create sessions for unauthenticated users unless necessary
  cookie: {
    secure: process.env.NODE_ENV === "production", // Ensure cookies are transmitted over HTTPS in production
    httpOnly: true, // Prevent client-side JavaScript from accessing the session cookie
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set 'none' for cross-origin cookies in production, otherwise 'lax'
    maxAge: 1000 * 60 * 60 * 24, // Set the cookie's expiration to 1 day
  },
});

// Helper function to wrap an Express middleware for use with Socket.IO
const wrap = ( ) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);

// Export the configured session middleware and wrapper function
module.exports = { sessionMiddleware, wrap };
