const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    messageBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messageTo:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "videos", "system"],
      default: "text", // Default value should be one of the enum options
    },
    readBY: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

module.exports = Message;
