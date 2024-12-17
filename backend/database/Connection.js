const mongoose= require("mongoose");
require("dotenv").config(); 

const connectDB = async()=>{
    mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(async()=>{
            console.log("Connect To MongoDb")
        })
        .catch((err)=>console.log("Error is", err))
}

module.exports = connectDB