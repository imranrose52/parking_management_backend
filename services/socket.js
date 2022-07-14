import { io } from "../server";

// this file is responsible for handle all web socket related function

let onlineUsers = [];
// add user to array
const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

// remove user from array
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

// get socket id by user id.
const getUserSoketId = (userId) => {
  const user = onlineUsers.find((user) => user.userId === userId);
  // console.log("getUser func->>", user);
  if (!user) {
    return false;
  }
  return user.socketId;
};

// get a array of online user id
export const getOnlineUserId = () => {
  const user = onlineUsers.map((user) => user.userId);
  // console.log("getUser func->>", user);
  if (!user) {
    return false;
  }
  return user;
};

// send socket action to device using socket id ||
// pass argument : null to send action  to all online devices
const webShoketSender = (id, action, data = {}) => {
  if (id) {
    let targetUser = getUserSoketId(id);
    if (targetUser) {
      io.to(targetUser).emit(action, data);
    }
  } else {
    io.emit(action, data);
  }
};

const webSocket = () => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("newUser", (userId) => {
      addNewUser(userId, socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log(`disconnect ${socket.id} due to ${reason}`);
      removeUser(socket.id);
    });
  });
};

export { webSocket, getUserSoketId, webShoketSender };
