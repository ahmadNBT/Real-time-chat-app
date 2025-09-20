import {Server, Socket} from 'socket.io'
import http from 'http'
import expres from 'express'


const app = expres()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const userSocketMap: Record<string, string> = {};


export const getRecieverSocketId = (recieverId: string): string | undefined => {
    return userSocketMap[recieverId]
} 

 
io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.handshake.query.userId as string | undefined;

    if(userId && userId!=="undefined") {
        userSocketMap[userId] = socket.id
        console.log(`User ${userId}  Mapped to Socket: ${socket.id}`);
        
    }


    io.emit("getOnlineUser", Object.keys(userSocketMap))
    
    if(userId){
        socket.join(userId)
    }


    socket.on("typing", (data) => {
        console.log(`User ${data.userId} Typing in Chat: ${data.chatId}`);
        
        socket.to(data.chatId).emit("userTyping", {
            userId: data.userId,
            chatId: data.chatId
        })
    })


    socket.on("stopTyping", (data) => {
        console.log(`User ${data.userId} Stop Typing in Chat: ${data.chatId}`);
        
        socket.to(data.chatId).emit("userStoppedTyping", {
            userId: data.userId,
            chatId: data.chatId
        })
    })


    socket.on("joinChat", (chatId) => {
        console.log(`User ${userId} Joined Chat: ${chatId}`);
        
        socket.join(chatId)
    })


    socket.on("leaveChat", (chatId) => {
        console.log(`User ${userId} Left Chat: ${chatId}`);
        
        socket.leave(chatId)
    })


    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);

        if(userId) {
            delete userSocketMap[userId]
            console.log(`User ${userId} removed from Socket: ${socket.id}`);
            
            io.emit("getOnlineUser", Object.keys(userSocketMap))
        }

    })

    socket.on("connet_error", (error) => {
        console.log("Socket connection error", error);
    })
    
    // socket.on("join", (data) => {
    //     userSocketMap[data.id] = socket.id
    // })
})

export {app, server, io}

