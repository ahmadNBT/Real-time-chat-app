"use client";

import ChatSidebar from "@/components/chatSidebar";
import Loading from "@/components/Loading";
import { useAppData, User } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
      />
    </div>
  );
};

export default Chat;
