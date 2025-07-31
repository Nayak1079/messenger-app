const redisClient = require("../redis"); // Import the Redis client from the specified file

module.exports.rateLimiter = // Export the rateLimiter function as middleware
  (secondsLimit, limitAmount) => async (req, res, next) => { // Define the rateLimiter function that takes in time limit (secondsLimit) and request limit (limitAmount)

    const ip = req.connection.remoteAddress; // Get the IP address of the client making the request

    
    [response] = await redisClient // Use Redis client to execute multiple commands in a transaction
      .multi() // Start a Redis multi command to perform multiple actions atomically
      .incr(ip) // Increment the request count for the client's IP address in Redis
      .expire(ip, secondsLimit) // Set the expiration time for this IP's key in Redis, so it resets after the specified secondsLimit
      .exec(); // Execute the transaction and retrieve the response

    if (response[1] > limitAmount) // Check if the number of requests has exceeded the limit
      res.json({ // If the limit is exceeded, send a JSON response indicating rate-limiting
        loggedIn: false, // Indicate that the user is rate-limited
        status: "Slow down!! Try again in a minute.", // Inform the user to slow down and retry later
      });
    else next(); // If the limit is not exceeded, pass control to the next middleware or route handler
  };
