const User = require("../models/user")


module.exports =(io,socket)=>{
    socket.on("FetchUserDetail", async ({ AdminId }) => {
        if (!AdminId) return; // Handle cases where userId is not provided
      
        try {
          const users = await User.find({});
          socket.emit("AllUsers", { users });
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      });

    socket.on("UserInfo", async({ messageTo })=>{
      console.log("MessageTo", messageTo)
      const userdetail = await  User.findById({_id:messageTo})
      socket.emit("userDetail", { firstname: userdetail.firstname });
    })
}