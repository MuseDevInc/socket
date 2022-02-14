//connect to socket.io at port 8900 and accept requests at port 3000 
const io = require('socket.io')(8900,{
    cors:{
        origin:"http://localhost:3000",
    },

})

let users = []

io.on("connection", (socket) => {
    console.log("New user connected")
    //use emit when wanting to send to all users connected to socket.
    io.emit("welcome", "Hello new user, this is socket server.")
})