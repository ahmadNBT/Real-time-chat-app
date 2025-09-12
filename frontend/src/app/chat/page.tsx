"use client";

import ChatSidebar from "@/components/chatSidebar";
import Loading from "@/components/Loading";
import { chat_service, useAppData, User, user_service } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import ChatHeader from "@/components/chatHeader";

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
      const { data } = await axios.get(`${chat_service}/api/v1/message/${selectedUser}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMessages(data.messages)
      setUser(data.user)
      await fetchChats();
    } catch (error) {
      console.log(error);
      toast.error("failed to load messages");
    }

  }

  async function createChat(u: User) {
      try {

        const token = Cookies.get("token");

        const {data} = await axios.post(`${chat_service}/api/v1/chat/new`, {
          otherUserId: u._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setSelectedUser(data?.chatId)
        setShowAllUsers(false)

        await fetchChats();

      } catch (error) {
        console.log(error);
        toast.error("failed to create chat");
      }
  }

  useEffect(() => {
    if(selectedUser) {
      fetchChat()
    }
  }, [selectedUser])

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
      />

    <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10 ">
      <ChatHeader />
    </div>

    </div>
  );
};

export default Chat;
