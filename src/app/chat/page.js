"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Mock chat data
const mockChats = [
  {
    id: "chat1",
    user: { name: "Jane Smith", id: "u3", avatar: "J" },
    listing: { title: "Drafting Table & T-Square", price: 40 },
    lastMessage: "Is it still available?",
    time: "2 hours ago",
    unread: true
  },
  {
    id: "chat2",
    user: { name: "Senior Sam", id: "u5", avatar: "S" },
    listing: { title: "First Year CS Notes", price: 0 },
    lastMessage: "Meet me at the CS block at 2PM.",
    time: "yesterday",
    unread: false
  }
];

export default function ChatInbox() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "them", text: "Hey! I saw your listing for the Drafting Table.", time: "10:00 AM" },
    { id: 2, sender: "me", text: "Yes, it's still available.", time: "10:05 AM" },
    { id: 3, sender: "them", text: "Is it still available? I can pick it up today.", time: "11:30 AM" }
  ]);

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold">Please login to view your messages</h2>
        <button onClick={() => router.push("/auth/login")} className="btn btn-primary mt-4">Login</button>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([...messages, { 
      id: Date.now(), 
      sender: "me", 
      text: message, 
      time: "Just now" 
    }]);
    setMessage("");
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto h-[80vh] flex flex-col animate-fade-in" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="card flex overflow-hidden w-full h-full border" style={{ borderColor: 'var(--border)' }}>
        
        {/* Sidebar / Inbox List */}
        <aside className="w-1/3 border-r flex flex-col bg-surface" style={{ borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <h2 className="text-xl font-bold">Inbox</h2>
          </div>
          
          <div className="overflow-y-auto flex-grow flex flex-col">
            {mockChats.map(chat => (
              <button 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className="w-full p-4 text-left border-b hover:bg-primary-light transition flex gap-3 relative"
                style={{ 
                  borderColor: 'var(--border)',
                  backgroundColor: activeChat?.id === chat.id ? 'var(--primary-light)' : 'transparent'
                }}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ backgroundColor: 'var(--border)' }}>
                  {chat.user.avatar}
                </div>
                <div className="flex-grow overflow-hidden">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold truncate">{chat.user.name}</h3>
                    <span className="text-xs text-muted whitespace-nowrap">{chat.time}</span>
                  </div>
                  <p className="text-xs text-primary font-bold truncate mb-1">Re: {chat.listing.title}</p>
                  <p className={`text-sm truncate ${chat.unread ? 'font-bold text-main' : 'text-muted'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread && <div className="absolute right-4 top-1/2 w-3 h-3 bg-primary rounded-full mt-2"></div>}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="w-2/3 flex flex-col bg-gray-50 relative" style={{ backgroundColor: '#F9FAFB' }}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-surface flex justify-between items-center z-10" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                    {activeChat.user.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold">{activeChat.user.name}</h3>
                    <p className="text-xs text-muted">Viewing: <span className="font-bold text-primary">{activeChat.listing.title}</span> (${activeChat.listing.price})</p>
                  </div>
                </div>
                <button className="btn btn-outline text-sm py-1 px-3">Mark Sold</button>
              </div>

              {/* Messages Area */}
              <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
                <div className="text-center my-4">
                  <span className="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full border">Today</span>
                </div>
                
                {messages.map(msg => (
                  <div key={msg.id} className={`flex max-w-[70%] ${msg.sender === "me" ? "self-end" : "self-start"}`}>
                    <div className="flex flex-col">
                      <div 
                        className={`p-3 rounded-2xl ${msg.sender === "me" ? "bg-primary text-white rounded-tr-sm" : "bg-white border rounded-tl-sm"}`}
                        style={{ borderColor: msg.sender !== "me" ? 'var(--border)' : 'transparent' }}
                      >
                        {msg.text}
                      </div>
                      <span className={`text-[10px] text-muted mt-1 ${msg.sender === "me" ? "text-right" : "text-left"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-surface border-t" style={{ borderColor: 'var(--border)' }}>
                <form onSubmit={handleSend} className="flex gap-2">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="input-field flex-grow"
                    style={{ borderRadius: 'var(--radius-pill)', padding: '0.75rem 1.5rem' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)' }}>
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-muted">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
              <p>Select a chat from the sidebar to start messaging.</p>
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
}
