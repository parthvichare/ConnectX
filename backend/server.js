require("dotenv").config(); 

// const client = require("./client");
const express = require("express")
const cookieParser=require("cookie-parser")
const path = require("path")
const initSocket = require("./socket/index");
const Redis = require('ioredis');


//Building httpServer + Real-Time Communication Server with WebScoket
const app = express()
const http = require("http")
const server = http.createServer(app)
const socketIo = require("socket.io")

//Redis-Connection Route
const {createRedisClient} = require("./database/RedisConnect")


// Connect MongoDB with NodeJS server
const connectDB = require("./database/Connection");


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
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));



// MiddleWares for Handling All Request, Authentication, URL-parser
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))
app.use(express.json({limit:"10mb"}))


// AWS Elasticache for Testing the connection
// redis.ping()
//     .then(result => {
//         console.log('Connected to Redis:', result);
//         return redis.set('testKey', 'Hello, Redis!');
//     })
//     .then(() => {
//         return redis.get('testKey');
//     })
//     .then(result => {
//         console.log('Retrieved from Redis:', result);
//     })
//     .catch(err => {
//         console.error('Error connecting to Redis:', err);
//     })
//     .finally(() => {
//         redis.quit();
//     });



// Server and MongoDB Connection
connectDB()


// Socket Connection
initSocket(server)





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

app.get("/api/:convoId", async (req, res) => {
  // console.log(convoId)
  const { convoId } = req.params; // Get convoId from request params
  try {
    const messages = await Message.find({ conversationId: convoId }); // Adjust according to your schema
    res.status(200).json(messages);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/allusers", async (req, res) => {
  try {
    const allUsers = await User.find({});
    return res.status(200).json({ users: allUsers }); // Standard HTTP status for success
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/message/:convoId", async(req,res)=>{
  const{conversationId} = req.body
  const messages = await Conversation.findById({_id:conversationId})
  return res.json({message:messages})
})


app.post("/api/getConversationId",async(req,res)=>{
  const{userId, messageTo}= await req.params
  console.log(userId, messageTo)
})


app.get("/message", async(req,res)=>{
  res.json({message:"Hello from Nodejs"})
})


// Redis
app.get('/test-redis', async (req, res) => {
    try {
        // Set a value in Redis
        const redis = createRedisClient()
        await redis.set('testKey', 'Hello from Redis!');
        
        // Get the value from Redis
        const value = await redis.get('testKey');
        
        // Respond with the value
        res.status(200).json({ message: 'Value set and retrieved successfully', value });
    } catch (error) {
        console.error('Error interacting with Redis:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


server.listen(PORT, () => {
    console.log(`Server Running on PORT at http://localhost:${PORT}/`);
});


