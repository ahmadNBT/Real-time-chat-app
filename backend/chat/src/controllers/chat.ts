import axios from "axios";
import TryCatch from "../config/TryCatch.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/messages.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({ message: "Please provide otherUserId" });
      return;
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    }); // TODO: check if chat already exists between userId and otherUserId

    if (existingChat) {
      res
        .status(200)
        .json({ message: "Chat already exists", chatId: existingChat._id });
      return;
    }

    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });

    res.status(201).json({ message: "Created new chat", chatId: newChat._id });
  }
);

export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

  const chatWithUserData = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find(
        (id) => id.toString() !== userId.toString()
      );

      const unseenCount = await Message.countDocuments({
        chatId: chat._id,
        seen: false,
        sender: { $ne: userId },
      });
      try {
        const { data } = await axios.get(
          `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`
        );
        return {
          user: data.user,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      } catch (error) {
        console.log(error);
        return {
          user: {
            _id: otherUserId,
            name: "Unknown User",
          },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      }
    })
  );


    res.status(200).json({ chats: chatWithUserData });

});



export const sendMessage = TryCatch(async (req: AuthenticatedRequest, res) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;
    const imageFile = req.file;

    if(!senderId) {
        res.status(400).json({ message: "User not found" });
        return;
    }

    if(!chatId){
        res.status(400).json({ message: "Please provide chatId" });
        return;
    }

    if(!text && !imageFile) {
        res.status(400).json({ message: "Please provide text or image" });
        return;
    }

    const chat = await Chat.findById(chatId);

    if(!chat) {
        res.status(404).json({ message: "Chat not found" });
        return;
    }

    const isUserInChat = await chat.users.some((userId) => {
      userId.toString() === senderId.toString();
    })

    if(!isUserInChat){
        res.status(403).json({ message: "You are not a member of this chat" });
        return;
    }

    const otherUserId = chat.users.find(
        (id) => id.toString() !== senderId.toString()
    );

    if(!otherUserId) {
        res.status(400).json({ message: "User otherUser not found" });
        return;
    }


    // socket io setup 


    let messageData:any = {
      chatId: chatId,
      sender: senderId,
      seen: false,
      seenAt: undefined,
    };

    if(imageFile){
      messageData.image = {
        url: imageFile.path,
        public_id: imageFile.filename,
      };
      messageData.messageType = "image";
      messageData.text = text || "";
    }
    else{
      messageData.messageType = "text";
      messageData.text = text;
    }

    const message = new Message(messageData);
    const savedMessage = await message.save();

    const latestMessageText = imageFile ? "📷 image" : text;

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: {
        text: latestMessageText,
        sender: senderId,
      },
      updatedAt: new Date(),
    }, { new: true});


    // Emit the message to the other user via Socket.io

    res.status(201).json({ sender: senderId, message: savedMessage })
});