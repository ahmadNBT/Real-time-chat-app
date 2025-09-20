"use client";

import ChatSidebar from "@/components/chatSidebar";
import Loading from "@/components/Loading";
import {
  chat_service,
  useAppData,
  User,
  user_service,
} from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import ChatHeader from "@/components/chatHeader";
import ChatMessages from "@/components/ChatMessages";
import MessageInput from "@/components/MessageInput";
import { SocketData } from "@/context/SocketContext";
import { text } from "stream/consumers";

export interface Message {
  _id: string;
  text?: string;
  image?: {
    url: string;
    public_id: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seetAt?: string;
  chatId: string;
  senderId: string;
  createdAt: string;
  updatedAt: string;
}

const Chat = () => {
  const {
    loading,
    isAuth,
    logoutUser,
    chats,
    user: loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();

  const { onlineUsers, socket } = SocketData();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [loading, router, isAuth]);

  const handleLogout = () => logoutUser();

  async function fetchChat() {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(
        `${chat_service}/api/v1/message/${selectedUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages([...data.messages]);
      setUser(data.user);
      await fetchChats();
    } catch (error) {
      console.log(error);
      toast.error("failed to load messages");
    }
  }

  const moveChatToTop = (
    chatId: string,
    newMessage: any,
    updatedUnseenCount = true
  ) => {
    setChats((prevChats) => {
      if (!prevChats) return null;

      const updatedChats = [...prevChats];
      console.log(newMessage, "newMessage");

      const chatIndex = updatedChats.findIndex((chat) => chat.chat._id === chatId);

      if (chatIndex !== -1) {
        const [moveChat] = updatedChats.splice(chatIndex, 1);
        const updatedChat: any = {
          ...moveChat,
          chat: {
            ...moveChat.chat,
            latestMessage: {
              text: newMessage.text,
              sender: newMessage.sender,
            },
            updatedAt: new Date().toString(),
            unseenCount:
              updatedUnseenCount && newMessage.sender !== loggedInUser?._id
                ? (moveChat.chat.unseenCount || 0) + 1
                : moveChat.chat.unseenCount || 0,
          },
        };

        updatedChats.unshift(updatedChat);
      }

      return updatedChats;
    });
  };

  const resetUnseenCount = (chatId: string) => {
    setChats((prevChats) => {
      if (!prevChats) return null;

      return prevChats.map((chat) => {
        if (chat.chat._id === chatId) {
          return {
            ...chat,
            chat: {
              ...chat.chat,
              unseenCount: 0,
            },
          };
        }
        return chat;
      });
    });
  };

  async function createChat(u: User) {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${chat_service}/api/v1/chat/new`,
        {
          otherUserId: u._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedUser(data?.chatId);
      setShowAllUsers(false);

      await fetchChats();
    } catch (error) {
      console.log(error);
      toast.error("failed to create chat");
    }
  }

  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault();

    if ((!message.trim() && !imageFile) || !selectedUser) return;

    //socket work
    if (typingTimout) {
      clearTimeout(typingTimout);
      setTypingTimeout(null);
    }

    socket?.emit("stopTyping", {
      userId: loggedInUser?._id,
      chatId: selectedUser,
    });

    const token = Cookies.get("token");

    try {
      const formData = new FormData();

      formData.append("chatId", selectedUser);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (message.trim()) {
        formData.append("text", message);
      }

      const { data } = await axios.post(
        `${chat_service}/api/v1/message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("");
      setMessages((prev) => {
        const currentMessages = prev ? [...prev] : [];
        const messageExists = currentMessages.some(
          (message) => message._id === data.message._id
        );

        if (!messageExists) {
          return [...currentMessages, data.message];
        }
        return currentMessages;
      });

      const displayText = imageFile ? "📷 image" : message.trim();

      moveChatToTop(
        selectedUser!,
        {
          text: displayText,
          sender: data?.sender,
        },
        false
      );

      await fetchChat();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);

    if (!selectedUser || !socket) return;

    // socket setup
    if (value.trim()) {
      socket.emit("typing", {
        userId: loggedInUser?._id,
        chatId: selectedUser,
      });
    }

    if (typingTimout) {
      clearTimeout(typingTimout);
    }

    const timeOut = setTimeout(() => {
      socket?.emit("stopTyping", {
        userId: loggedInUser?._id,
        chatId: selectedUser,
      });
      setTypingTimeout(null);
    }, 1000);

    setTypingTimeout(timeOut);
  };

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      // console.log("Received new message:", message);
      
      if (message.chatId === selectedUser) {
        setMessages((prev) => {
          const currentMessages = prev || [];
          const messageExists = currentMessages.some(
            (msg) => msg._id === message._id
          );

          if (!messageExists) {
            return [...currentMessages, message];
          }
          return currentMessages;
        });

        moveChatToTop(message.chatId, message, false);
      }else{
        moveChatToTop(message.chatId, message, true);
      }


    });


    socket?.on("messagesSeen", (data) => {
      console.log("Message senBy", data);

      if(selectedUser === data.chatId){
        setMessages((prev) => {
          if(!prev) return null;

          return prev.map((msg:any) => {
            if(msg?.sender === loggedInUser?._id && data.messageIds && data.messageIds.includes(msg?._id)){
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString()
              }
            }
            else if(msg?.sender === loggedInUser?._id && !data.messageIds) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString()
              }
            }
            return msg;
          })

        })
      }
      
    })


    socket?.on("userTyping", (data) => {
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(true);
      }
    });

    socket?.on("userStoppedTyping", (data) => {
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("messagesSeen");
      socket?.off("userTyping");
      socket?.off("userStoppedTyping");
    };
  }, [selectedUser, socket, setChats, loggedInUser?._id]);

  useEffect(() => {
    if (selectedUser) {
      fetchChat();
      setIsTyping(false);

      resetUnseenCount(selectedUser);

      socket?.emit("joinChat", selectedUser);

      return () => {
        socket?.emit("leaveChat", selectedUser);
        setMessages(null);
      };
    }
  }, [selectedUser, socket]);

  useEffect(() => {
    return () => {
      if (typingTimout) {
        clearTimeout(typingTimout);
      }
    };
  }, [typingTimout]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        setShowAllUsers={setShowAllUsers}
        setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUsers}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={handleLogout}
        createChat={createChat}
        onlineUsers={onlineUsers}
      />

      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10 ">
        <ChatHeader
          onlineUsers={onlineUsers}
          user={user}
          setSidebarOpen={setSidebarOpen}
          isTyping={isTyping}
        />
        <ChatMessages
          selectedUser={selectedUser}
          messages={messages}
          loggedInUser={loggedInUser}
        />
        <MessageInput
          selectedUser={selectedUser}
          message={message}
          handleMessageSend={handleMessageSend}
          setMessage={handleTyping}
        />
      </div>
    </div>
  );
};

export default Chat;
