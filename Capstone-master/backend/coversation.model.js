import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum:{
        values: ["user", "assistant"],
        message: "Role must be either 'user' or 'assistant'",
      },
      required: [true,"Role is required"],
    },
    content: {
      type: String,
      required: [true,"Content is required"],
      trim: true,
    },
  },
  {
     timestamps: true,
     versionKey: false,
  },
);

const conversationSchema = new Schema(
    {
        eventId: {
            type: Types.ObjectId,
            ref: "Event",
            required: [true, "Event ID is required"],
            index: true,
        },
        messages:{
            type: [messageSchema],
            default: [],
        },
    },
     {
        timestamps: true,
        versionKey: false,
        strict: "throw",
     },
);
 
export const ConversationModel = model("Conversation", conversationSchema);