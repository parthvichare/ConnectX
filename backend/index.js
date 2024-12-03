require("dotenv").config(); 
const http = require("http");
const client = require("./client");
const express = require("express")
const app = express()



PORT=8000

const cors = require("cors")
app.use(cors({
    origin: "http://localhost:3000",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

app.use(express.json())      //Data In JSON format

app.get("/api",(req,res)=>{
    res.json({message:"Hello from the NodeJS"})
})

app.get("/", async(req,res)=>{
    try{
        await client.set("msg:1","Hi how a")
        const results1= await client.get("msg:1")
        res.json({redis_data:results1})
    } catch (err) {
        console.error("Error connecting to Redis:", err.message); // Log the error for debugging
        res.status(500).json({ errormessage: "Redis is not connected to the frontend." }); // Return a consistent error format
    }
})


app.listen(PORT,()=>{
    console.log(`Server Running on PORT at http://localhost:${PORT}/`)
})