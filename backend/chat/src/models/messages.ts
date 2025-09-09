import mongoose, {Document, Schema, Types} from "mongoose";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: String;
    text?: string;
    image?:{
        url: string;
        public_id: string;
    },
    messageType: "text" | "image";
    seen: boolean;
    seetAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema<IMessage>({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: String, required: true }, 
    text: { type: String },
    image: {
        url: { type: String },
        public_id: { type: String },
    },
    messageType: { type: String, enum: ["text", "image"], default: "text", required: true },
    seen: { type: Boolean, default: false },
    seetAt: { type: Date, default: null },
}, { timestamps: true });


export const Message = mongoose.model<IMessage>("Message", schema);