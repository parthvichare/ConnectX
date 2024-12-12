const Conversation = require("../models/conversationSchema")

module.exports= (io, socket)=>{
    //Listening for GetConversatioId based on the participants
    socket.on("GetConversationId", async ({ AdminId, messageTo }) => {
            try {
              if (AdminId && messageTo) {
                const conversation = await Conversation.findOne({
                  participants: { $all: [AdminId, messageTo] },
                });
          
              if (conversation) {
                  socket.emit("Conversation", { convoId: conversation._id });
              } else {
                  socket.emit("Conversation", { convoId: null });
              }
              }
            } catch (error) {
              console.error("Error getting conversation ID:", error.message);
            }
    });
}