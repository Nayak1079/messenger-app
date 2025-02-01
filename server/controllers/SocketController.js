// Importing the Redis client to interact with the Redis database
const { parse } = require("dotenv");
const redisClient = require("../redis");

// Middleware to authorize users connecting through the socket
module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad request!");
    next(new Error("Not authorized"));
  } else {
    next();
  }
};

// Function to initialize the user after connection
module.exports.initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  socket.join(socket.user.userid);

  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid,
    "connected",
    true
  );

  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);
  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map(friend => friend.userid);
  
  if (friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", true, socket.user.username);
  }
  
  console.log(`${socket.user.username} friends:`, parsedFriendList);
  socket.emit("friends", parsedFriendList);

  const msgQuery = await redisClient.lrange(`chat:${socket.user.userid}`, 0, -1);
  const messages = msgQuery.map(msgStr => {
    const parsedStr = msgStr.split(".");
    return { to: parsedStr[0], from: parsedStr[1], content: parsedStr[2] };
  });
  
  if (messages.length > 0) {
    socket.emit("messages", messages);
  }
};

// Function to handle adding a friend
module.exports.addFriend = async (socket, friendName, cb) => {
  if (friendName === socket.user.username) {
    cb({ done: false, errorMsg: "Cannot add self!" });
    return;
  }

  const friend = await redisClient.hgetall(`userid:${friendName}`);
  const currentFriendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);

  if (!friend) {
    cb({ done: false, errorMsg: "User doesn't exist!" });
    return;
  }

  if (currentFriendList.includes(friendName)) {
    cb({ done: false, errorMsg: "Friend already added!" });
    return;
  }

  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [friendName, friend.userid].join(".")
  );

  const newFriend = {
    username: friendName,
    userid: friend.userid,
    connected: friend.connected,
  };
  cb({ done: true, newFriend });
};

// Handling user disconnection
module.exports.onDisconnect = async (socket) => {
  await redisClient.hset(`userid:${socket.user.username}`, "connected", false);
  
  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);
  const friendRooms = await parseFriendList(friendList).then(friends => friends.map(friend => friend.userid));
  
  socket.to(friendRooms).emit("connected", false, socket.user.username);
};

// Parsing friend list efficiently
const parseFriendList = async (friendList) => {
  return await Promise.all(
    friendList.map(async (friend) => {
      const [username, userid] = friend.split(".");
      const connected = await redisClient.hget(`userid:${username}`, "connected");
      return { username, userid, connected: connected === "true" };
    })
  );
};

// Direct messaging
module.exports.dm = async (socket, message) => {
  message.from = socket.user.userid;
  const messageString = [message.to, message.from, message.content].join(".");
  
  await redisClient.lpush(`chat:${message.to}`, messageString);
  await redisClient.lpush(`chat:${message.from}`, messageString);
  
  socket.to(message.to).emit("dm", message);
};