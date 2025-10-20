import { useEffect, useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sent: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unread: number;
}

const mockChats: Chat[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/images/user/user-01.png",
    online: true,
    lastMessage: "Hi, how are you?",
    lastMessageTime: "2025-10-14T10:00:00",
    unread: 2,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/images/user/user-02.png",
    online: false,
    lastMessage: "Project meeting tomorrow",
    lastMessageTime: "2025-10-14T09:45:00",
    unread: 0,
  },
  {
    id: 3,
    name: "Mike Johnson",
    avatar: "/images/user/user-03.png",
    online: true,
    lastMessage: "Thanks for your help!",
    lastMessageTime: "2025-10-14T09:30:00",
    unread: 1,
  },
];

const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Hi, how are you?", timestamp: "2025-10-14T10:00:00", sent: false },
    { id: 2, text: "I'm good, thanks! How about you?", timestamp: "2025-10-14T10:01:00", sent: true },
    { id: 3, text: "Great! Do you have time for a quick chat?", timestamp: "2025-10-14T10:02:00", sent: false },
  ],
};

export default function Inbox() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messagesByChat, setMessagesByChat] = useState<Record<number, Message[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedChat = selectedChatId ? mockChats.find((c) => c.id === selectedChatId) ?? null : null;
  const messages = selectedChatId ? messagesByChat[selectedChatId] ?? [] : [];

  useEffect(() => {
    // auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChatId) return;

    const msg: Message = {
      id: Date.now(),
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      sent: true,
    };

    setMessagesByChat((prev) => {
      const copy = { ...prev };
      copy[selectedChatId] = [...(copy[selectedChatId] ?? []), msg];
      return copy;
    });

    setNewMessage("");
  };

  return (
    <>
      <PageMeta title="Messages" description="Chat with other users" />
      <PageBreadcrumb pageTitle="Messages" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex h-[calc(100vh-200px)] min-h-[500px] overflow-hidden">
        {/* Chat list */}
        <aside className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  selectedChatId === chat.id ? "bg-brand-50 dark:bg-brand-500/10" : ""
                }`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <div className="relative">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full" />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    {chat.lastMessageTime && (
                      <span className="text-xs text-gray-500">
                        {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    {chat.lastMessage && <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>}
                    {chat.unread > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-brand-500 text-white text-xs rounded-full">{chat.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <div className="relative">
                  <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full" />
                  {selectedChat.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-500">{selectedChat.online ? "Active now" : "Offline"}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${message.sent ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
                      <p>{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-brand-500 text-white rounded-full font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation to start messaging</div>
          )}
        </main>
      </div>
    </>
  );
}

