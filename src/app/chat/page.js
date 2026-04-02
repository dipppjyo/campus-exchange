"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { 
  collection, query, where, orderBy, onSnapshot, 
  addDoc, serverTimestamp, doc, updateDoc 
} from "firebase/firestore";

// Mock chats removed - using Firestore

export default function ChatInbox() {
  const { user } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch all chats involving the current user
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadingTimeout = setTimeout(() => setLoading(false), 5000);

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.id),
      orderBy("lastActivity", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
      clearTimeout(loadingTimeout);
      setLoading(false);
    }, (error) => {
      console.error("Chat snapshot error:", error);
      clearTimeout(loadingTimeout);
      setLoading(false);
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch messages for the active chat
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, "chats", activeChat.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgList);
    }, (error) => {
      console.error("Messages snapshot error:", error);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat || !user) return;

    const textPayload = message;
    setMessage("");

    try {
      const messageData = {
        text: textPayload,
        senderId: user.id,
        senderName: user.name,
        createdAt: serverTimestamp(),
      };

      // Add to sub-collection
      await addDoc(collection(db, "chats", activeChat.id, "messages"), messageData);

      // Update last message in parent doc
      await updateDoc(doc(db, "chats", activeChat.id), {
        lastMessage: textPayload,
        lastActivity: serverTimestamp(),
        [`unread.${activeChat.participants.find(p => p !== user.id)}`]: true
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
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
            {chats.length > 0 ? (
              chats.map(chat => {
                const otherParticipantName = chat.participantNames?.find(n => n !== user.name) || "User";
                const isUnread = chat.unread?.[user.id];
                
                return (
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
                      {otherParticipantName.charAt(0)}
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold truncate">{otherParticipantName}</h3>
                        <span className="text-xs text-muted whitespace-nowrap">
                          {chat.lastActivity?.toDate() ? new Date(chat.lastActivity.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-bold truncate mb-1">Re: {chat.listingTitle}</p>
                      <p className={`text-sm truncate ${isUnread ? 'font-bold text-main' : 'text-muted'}`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    {isUnread && <div className="absolute right-4 top-1/2 w-3 h-3 bg-primary rounded-full mt-2"></div>}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted text-sm">No messages yet.</div>
            )}
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
              <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
                {messages.length > 0 ? (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex max-w-[70%] ${msg.senderId === user.id ? "self-end" : "self-start"}`}>
                      <div className="flex flex-col">
                        <div 
                          className={`p-3 rounded-2xl ${msg.senderId === user.id ? "bg-primary text-white rounded-tr-sm" : "bg-white border rounded-tl-sm"}`}
                          style={{ borderColor: msg.senderId !== user.id ? 'var(--border)' : 'transparent' }}
                        >
                          {msg.text}
                        </div>
                        <span className={`text-[10px] text-muted mt-1 ${msg.senderId === user.id ? "text-right" : "text-left"}`}>
                          {msg.createdAt?.toDate() ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Sending..."}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-grow flex items-center justify-center text-muted text-sm">No messages yet. Start the conversation!</div>
                )}
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
