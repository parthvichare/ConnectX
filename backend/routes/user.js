const express= require("express");
const router = express.Router();
const User = require("../models/user");


//SignUp the New User
router.post("/api/signUp", async(req,res)=>{
    try{
        const {firstname,email,password}=req.body
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({userexist:"User already exists"})
        }
        const newUser= await User.create({
            firstname,
            email,
            password
        })
        return res.json({message:"Account is Created"})

    }catch(error){
        return res.status(500).json({Error:"Server Error"})
    }
})


//SignIn the existing User
router.post("/api/signIn", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate user and generate token
      const token = await User.matchPasswordAndGenerateToken(email, password);
      const user = await User.findOne({email})
      if (!token) {
        return res.status(400).json({ Loginfailed: "Invalid Email & Password" });
      }
  
      // Successful login response
      return res.status(200).json({
        LoginSuccessful: "User Login Successfully",
        usertoken:{token},
        userId:user._id
      });

    } catch (error) {
      console.error("Server Error:", error.message);
      return res.status(500).json({ Error: "Invalid Email & Password" });
    }
  });
  
module.exports= router


    //   const token = await User.matchPasswordAndGenerateToken(email,password)
    //   const user= await User.findOne({email})
    //     return res.json({
    //         LoginSuccessful:"User LogIn Successfully",
    //         userdetails:{
    //             id:user._id,
    //             email:user.email,
    //             name: user.firstname,
    //             token:token
    //         }
    //       })