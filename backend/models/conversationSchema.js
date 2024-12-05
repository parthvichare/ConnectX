const{Schema,model}= require("mongoose")


const conversationSchema= new Schema(
    {
        participants:[
            {
                type:Schema.Types.ObjectId,
                ref:"User",
            }
        ],
        createdAt: { type: Date, default: Date.now },
    },
    {timestamps:true}
)

const Conversation =model("Conversation", conversationSchema)

module.exports = Conversation