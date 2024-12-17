const Message = require("../models/messages")
const Conversation = require("../models/conversationSchema")
const {createRedisClient} = require('../database/RedisConnect')



module.exports= (io,socket)=>{
    const redis  = createRedisClient()
    socket.on("FetchMessage", async ({ initialConvoId }) => {
        console.log("Fetching messages for user:", initialConvoId);
      
        if (initialConvoId) {
          try {
            // Fetch messages from the database where 'messageBy' matches 'userId'
            const messages = await Message.find({ conversationId: initialConvoId });
      
            // Map through the messages and log each one
            messages.forEach((item) => console.log(item));
      
            // Emit all messages back to the client
            socket.emit("AllMessages", { messages });
          } catch (error) {
            console.error("Error fetching messages:", error.message);
          }
        } else {
          console.warn("User ID not provided");
        }
      });

      
    socket.on("CurrentMessages", async ({ NewMessage }) => {
        console.log("Messaging")
        const { message, messageBy,messageTo, conversationId } = NewMessage;
        console.log(conversationId, message)

        let conversation;

        if(conversationId){
          conversation = await Conversation.findById(conversationId)
        }

        if(!conversationId){
          conversation  = new Conversation({
            participants: [messageBy, messageTo]
          })
          await conversation.save();
        }

        const currentMessage =  new Message({
          message:message,
          messageBy:messageBy,
          messageTo:messageTo,
          conversationId: conversation._id
        })
        await currentMessage.save()

        const newMessage = await Message.findById(currentMessage._id);
        io.emit("NewMessage",({ currentMessage }))
    });

    // // Typing Indicators Feature
    socket.on("startTyping", async({initialConvoId, localUserId})=>{
      // const key = `typing: ${initialConvoId}`;
      const userTyping = localUserId
      await redis.sadd("UserTyping", userTyping)
      
      //User which are Typing
      const typingUsers = await redis.smembers("UserTyping");
      
      console.log("Typing",typingUsers)
      
      const CurrentlyTyping = typingUsers.map((item)=>({
        _id: item,
        conversationId:initialConvoId
      }))

      io.emit("updateTyping", {CurrentlyTyping})

      // const typingUsers = await client.smembers(key)
      console.log(`User ${localUserId} is Start-Typing with ${initialConvoId}`)
    })

    socket.on("stopTyping", async({initialConvoId, localUserId})=>{
      if(localUserId){
        await redis.srem("UserTyping",localUserId)

        const typingUsers= await redis.smembers("UserTyping")
        const CurrentlyTyping = typingUsers.map((item)=>({
          _id:item,
          conversationId : initialConvoId
        }))
        io.emit("updateTyping", {CurrentlyTyping})
      }
      console.log(`User ${localUserId} is Stop-Typing with ${initialConvoId}`)
    })
}