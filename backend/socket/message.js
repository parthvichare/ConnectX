const Message = require("../models/messages")
const Conversation = require("../models/conversationSchema")

module.exports= (io,socket)=>{
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
        console.log(messageBy,messageTo)
    
        let conversation;
        if(!conversationId){
          conversation = await Conversation.findById(conversationId)
        }else{
        // If no conversationId, look for a conversation where the new user is involved
        conversation = await Conversation.findOne({
          participants: { $all: [messageBy] }, // Ensure the user is part of the conversation
        });
        console.log(conversation)
        await conversation.save()
      }
    
        if (!conversation) {
          // If no existing conversation found, create a new one with the current user
          conversation = new Conversation({
            participants: [messageBy,messageTo], // Initialize with the current user
          });
          console.log("ConversationId",conversation)
          await conversation.save();
        } 
    
        // Create and save the new message
        const currentMessage = new Message({
          message: message,
          messageBy: messageBy,
          messageTo:messageTo,
          conversationId: conversation._id
        });
        await currentMessage.save();
        console.log("Current Message",currentMessage)
    
        // Emit the message to all participants in the conversation
    
        const newMessage = await Message.findById(currentMessage._id);
        // console.log("MessageCreated")
        io.emit("NewMessage",({currentMessage}))
    });



    
}