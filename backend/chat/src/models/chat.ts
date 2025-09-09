import mongoose, {Document, Schema} from "mongoose";

export interface IChat extends Document {
    users: string[];
    latestMessage: {
        text: string;
        sender: string;
    };
    cratedAt: Date;
    updatedAt: Date;
}

const schema: Schema<IChat> = new Schema({
    users: [{type: String, required: true}],
    latestMessage: {
        text: {type: String, default: ""},
        sender: {type: String, default: ""},
    }
}   , {timestamps: true});

export const Chat = mongoose.model<IChat>("Chat", schema);