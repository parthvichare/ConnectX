const socketIo = require("socket.io");
const userEvent = require("./users")
const conversationEvent = require("./conversation")
const messageEvent = require("./message")
const {createRedisClient} = require("../database/RedisConnect")

function initSocket(server) {
    const redis =  createRedisClient()
    const io = socketIo(server,{
        cors:{
            origin:["http://localhost:3000"],
            methods:["GET","POST","PATCH","DELETE"],
            credentials:true
        }
    })

    io.on("connection", async (socket) => {  // Changed to lowercase "connection"
        socket.on("Connect", async ({ token, userId, status }) => {
            if(userId===null){
                console.log("Null User")
            }else{
                socket.userId= userId
                await redis.sadd("online_users", userId);
            }
            console.log(`User ${userId} is Online`);
        
            // // Remove user from the offline_users set if present
            // await redis.srem("offline_users", userId);
            
            // Log current online users
            const onlineUsers = await redis.smembers("online_users");
            const Users=onlineUsers.map((item)=>({
                _id: item,
                status:"Online"
            }))
            io.emit("OnlineUsers", {Users})
            console.log("Currently Online Users:", onlineUsers);
        
            // Initialize All SocketEvents
            userEvent(io, socket);
            conversationEvent(io, socket);
            messageEvent(io, socket);
        });
        
        socket.on("disconnect", async () => {
            // Extract userId from socket or pass it on connect (consider storing userId in socket data)
            const userId = socket.userId; // This needs to be set when connecting
            if (userId) {
                // Remove user who is Online
                await redis.srem("online_users", userId);
                console.log(`User ${userId} is Offline`);
        
        
                // Log current online users
                const onlineUsers = await redis.smembers("online_users");
                const Users=onlineUsers.map((item)=>({
                    _id: item,
                }))

                io.emit("OnlineUsers", {Users})
                console.log("Currently Online Users:", onlineUsers);
        
                // Log current offline users
                // const offlineUsers = await redis.smembers("offline_users");
                // console.log("Currently Offline Users:", offlineUsers);
            }
        });

        return ()=>{
            socket.off()
        } 
    });

    // Cleanup function to remove all online users
    const cleanupOnlineUsers = async () => {
        await redis.del("online_users"); // Remove the online_users set
        await redis.del("UserTyping");
        console.log("All online users removed from Redis.");
    };

    // Listen for server shutdown events
    process.on("SIGINT", async () => {
        await cleanupOnlineUsers();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        await cleanupOnlineUsers();
        process.exit(0);
    });
}

module.exports = initSocket;
