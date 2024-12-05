require("dotenv").config(); 


// const client = require("./client");
const express = require("express")
const cookieParser=require("cookie-parser")
const path = require("path")

//Building httpServer + Real-Time Communication Server with WebScoket
const app = express()
const http = require("http")
const server = http.createServer(app)
const socketIo = require("socket.io")

// Connect MongoDB with NodeJS server
const connectDB = require("./Connection");

// MongoDB Schema
const User= require("./models/user")
const Message = require("./models/messages")
const Conversation = require("./models/conversationSchema")

// API endpoint UserRoutes
const userRoute = require("./routes/user")

//
const{validateToken} = require("./services/authenticationJWT")
const{checkForAuthenticationCookie}= require("./authentication")


const PORT=8000

//  Build CROS-ORIGIN between the frontend->3000 and Backend-> 8000 
const cors = require("cors")
app.use(cors({
    origin: "http://localhost:3000",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

const io = socketIo(server,{
    cors:{
        origin:["http://localhost:3000"],
        methods:["GET","POST","PATCH","DELETE"],
        credentials:true
    }
})

// Server and MongoDB Connection
connectDB()


// Socket Connection


// MiddleWares for Handling All Request, Authentication, URL-parser
app.use(express.json())   
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))
app.use(express.json({limit:"10mb"}))





app.get("/api",(req,res)=>{
    res.json({message:"Hello from the NodeJS"})
})

app.post('/register', async (req, res) => {
    const { firstname, email, password } = req.body;
    try {
        const newUser = new User({ firstname, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/user_detail",async(req,res)=>{
    try{
      const user = await User.find({})
      res.status(201).json(user)
    }catch(error){
      res.status(404).json({Error:error.message})
    }
})

//Route 
app.use("/user", userRoute)

//Communicating with WebScoket Connection for Real-Time Communication





// //Communicating with WebScoket Connection for Real-Time Communication
io.on("connection", (socket) => {
  // Emit a welcome message
  socket.emit("message", { message: "Hello from the Server of Node.js" });

  // Listen for the New User Connected event from the client
  socket.on("Connect", ({ token, userId }) => {
    console.log("Received token from client:", token);
    console.log("User is Connected", userId);
  });

  socket.on("CurrentMessages", async ({ currentMessages }) => {
    const { message, messageBy, conversationId } = currentMessages;

    // Check if a conversation ID is provided
    let conversation;
    if (!conversationId) {
      // If no conversationId, find or create a conversation
      conversation = await Conversation.findOne({
        participants: { $all: [messageBy] },
      });

      if (!conversation) {
        // Create a new conversation if it doesn't exist
        conversation = new Conversation({
          participants: [messageBy], // Initialize with the current user
        });
        await conversation.save();
      }
    } else {
      // If conversationId is provided, find the existing conversation
      conversation = await Conversation.findById(conversationId);
    }

    // Create and save the new message
    const currentMessage = new Message({
      message: message,
      messageBy: messageBy,
      conversationId: conversation._id, // Use the conversation ID
    });
    await currentMessage.save();

    // Emit the message to all participants in the conversation

    const newMessage = await Message.findById(currentMessage._id);
    console.log(newMessage)
    io.emit("NewMessage",{newMessage})
  });

//   const newMessage =await Message.find({});
//   socket.emit("NewMessage", {newMessage })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(PORT,()=>{
    console.log(`Server Running on PORT at http://localhost:${PORT}/`)
})





// Redis
// app.get("/", async(req,res)=>{
//     try{
//         await client.set("msg:1","Hi how a")
//         const results1= await client.get("msg:1")
//         res.json({redis_data:results1})
//     } catch (err) {
//         console.error("Error connecting to Redis:", err.message); // Log the error for debugging
//         res.status(500).json({ errormessage: "Redis is not connected to the frontend." }); // Return a consistent error format
//     }
// })