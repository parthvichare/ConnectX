const socketIo = require("socket.io");
const userEvent = require("./users")
const conversationEvent = require("./conversation")
const messageEvent = require("./message")

function initSocket(server) {
    const io = socketIo(server,{
        cors:{
            origin:["http://localhost:3000"],
            methods:["GET","POST","PATCH","DELETE"],
            credentials:true
        }
    })

    io.on("connection", async (socket) => {  // Changed to lowercase "connection"
        socket.on("Connect", async ({ token, userId }) => {
            console.log("User is Connected", userId);
        });

        //Initialize All SocketEvents
        userEvent(io,socket)
        conversationEvent(io,socket)
        messageEvent(io,socket)
    
        // socket.on("disconnect", () => {
        //     console.log("User Disconnected", socket.id);
        // });
    });
}

module.exports = initSocket;
