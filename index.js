require('dotenv').config()
const express = require('express')
const socketIO = require('socket.io')
const server = express().listen( process.env.PORT || 8900, () =>console.log('listening socket'))

//connect to socket.io at port 8900 and accept requests at port 3000 
const io = socketIO(server 
  ,{
    cors:{
        origin:['http://localhost:3000','https://muse-dev.herokuapp.com']
    },

})

let users = []

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
    console.log('line 14 => ',users)
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

//find the users object that has the same userId
const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}



io.on("connection", (socket) => {
    console.log("New user connected")
    //use emit when wanting to send to all users connected to socket.
    io.emit("welcome", "Hello new user, this is socket server.")
      //take userId and socketId from user and add to users array. Then update users array for all clients connected to socket.
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id)
    io.emit("getUsers", users)
  })

  //When sendMessage, find user using getUser() and send that message to that user
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    // console.log('this is recieverId =>',receiverId)
    const user = getUser(receiverId);
    if (user){
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
    
  }
  else{
    console.log("Other user not logged")
  }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!")
    removeUser(socket.id)
    io.emit("getUsers", users)
  })
})