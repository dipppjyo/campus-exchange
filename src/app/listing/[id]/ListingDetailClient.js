"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

export default function ListingDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "listings", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleContact = async () => {
    if (!user) {
      alert("Please login to contact the seller.");
      router.push("/auth/login");
      return;
    }
    
    if (user.id === listing.sellerId) {
      alert("This is your own listing!");
      return;
    }

    try {
      // Check if chat already exists
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef, 
        where("participants", "array-contains", user.id),
        where("listingId", "==", listing.id)
      );
      
      const querySnapshot = await getDocs(q);
      let chatId = "";

      if (!querySnapshot.empty) {
        chatId = querySnapshot.docs[0].id;
      } else {
        // Create new chat room
        const newChat = {
          participants: [user.id, listing.sellerId],
          participantNames: [user.name, listing.sellerName],
          listingId: listing.id,
          listingTitle: listing.title,
          lastMessage: "Interested in your item!",
          lastActivity: serverTimestamp(),
          unread: { [listing.sellerId]: true }
        };
        const docRef = await addDoc(collection(db, "chats"), newChat);
        chatId = docRef.id;
        
        // Add initial message
        await addDoc(collection(db, "chats", chatId, "messages"), {
          text: "Hi, I am interested in your item!",
          senderId: user.id,
          senderName: user.name,
          createdAt: serverTimestamp()
        });
      }

      router.push("/chat");
    } catch (err) {
      console.error("Error starting chat:", err);
      alert("Failed to start chat.");
    }
  };

  if (loading) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-2xl font-bold text-muted">Curating details...</h2>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-16 text-center">
        <div className="card p-12 inline-block max-w-md">
          <span className="text-6xl mb-4 block">🔍</span>
          <h2 className="text-3xl font-bold mb-2">Listing not found</h2>
          <p className="text-muted mb-6">The item might have been sold or removed by the seller.</p>
          <button onClick={() => router.push("/marketplace")} className="btn btn-primary px-8">Return to Marketplace</button>
        </div>
      </div>
    );
  }

  const badgeConfig = {
    sell: { class: "badge-primary", label: "For Sale" },
    rent: { class: "badge-accent", label: "For Rent" },
    donate: { class: "badge-secondary", label: "GIVING AWAY" },
    exchange: { class: "badge-primary", label: "Exchanging" }
  };

  const config = badgeConfig[listing.listingType] || badgeConfig.sell;

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-muted font-medium animate-fade-in">
        <button onClick={() => router.push("/marketplace")} className="hover:text-primary transition-colors">Marketplace</button>
        <span>/</span>
        <span className="text-text-main line-clamp-1">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Visuals (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 animate-slide-up">
          <div className="relative group rounded-3xl overflow-hidden card border-0 shadow-lg aspect-square bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={listing.images[activeImage]} 
              alt={listing.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            {listing.isUrgent && (
              <div className="absolute top-6 left-6 badge badge-danger py-2 px-4 shadow-lg text-sm">
                🚨 Urgent Sale
              </div>
            )}
          </div>

          {listing.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {listing.images.map((src, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all shadow-sm
                    ${activeImage === idx ? 'border-primary scale-95 shadow-md' : 'border-transparent hover:border-text-light opacity-70 hover:opacity-100'}
                  `}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Contact Information (Large Cards) */}
          <div className="card px-6 py-8 md:px-10 md:py-10 border border-border shadow-lg mt-6 bg-surface rounded-[2rem] h-auto min-h-0 flex flex-col gap-8 overflow-hidden">
            <h3 className="text-xl md:text-2xl font-bold border-b border-border pb-5 w-full">
              <span className="whitespace-normal break-words leading-tight text-text-main">Contact Information</span>
            </h3>
            
            <div className="bg-primary-light/10 rounded-xl py-4 pr-4 pl-10 border border-primary/20 shadow-sm w-full">
              <p className="text-base leading-relaxed text-text-main whitespace-pre-wrap break-words font-medium">
                {listing.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-2">
              <div className="flex flex-col gap-2 p-5 bg-background/50 rounded-2xl border border-border/60 shadow-sm h-auto min-h-0 transition-all hover:border-primary/20">
                <span className="text-[10px] text-muted font-black uppercase tracking-[0.15em] leading-none opacity-60">Condition</span>
                <span className="font-bold text-text-main text-sm md:text-base capitalize whitespace-normal break-words">{listing.condition}</span>
              </div>
              <div className="flex flex-col gap-2 p-5 bg-background/50 rounded-2xl border border-border/60 shadow-sm h-auto min-h-0 transition-all hover:border-primary/20">
                <span className="text-[10px] text-muted font-black uppercase tracking-[0.15em] leading-none opacity-60">Department</span>
                <span className="font-bold text-text-main text-sm md:text-base whitespace-normal break-words">{listing.department}</span>
              </div>
              <div className="flex flex-col gap-2 p-5 bg-background/50 rounded-2xl border border-border/60 shadow-sm h-auto min-h-0 transition-all hover:border-primary/20">
                <span className="text-[10px] text-muted font-black uppercase tracking-[0.15em] leading-none opacity-60">Category</span>
                <span className="font-bold text-text-main text-sm md:text-base whitespace-normal break-words">{listing.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction & Seller (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8 animate-fade-in h-auto min-h-0" style={{ animationDelay: '0.2s' }}>
          
          {/* Main Pricing Card */}
          <div className="card px-6 py-8 md:px-10 md:py-10 border border-border shadow-xl bg-surface relative overflow-visible rounded-[2rem] h-auto min-h-0">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary opacity-[0.05] rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-border pb-8 w-full">
              <span className={`badge ${config.class} py-2.5 px-6 text-xs font-black shadow-sm uppercase tracking-[0.15em] whitespace-normal break-words text-center rounded-xl`}>
                {config.label}
              </span>
              <span className="text-[10px] md:text-xs text-muted font-bold bg-background px-4 py-2 rounded-full border border-border whitespace-normal break-words text-center shadow-sm">
                Added {listing.createdAt?.toDate ? listing.createdAt.toDate().toLocaleDateString() : 'recently'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black mb-8 leading-tight text-text-main whitespace-normal break-words tracking-tight">
              {listing.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-10 bg-primary-light/40 p-6 md:p-8 rounded-3xl border border-primary/10 h-auto min-h-0 w-full overflow-hidden shadow-inner">
              <span className="text-5xl md:text-6xl font-black text-primary leading-none whitespace-normal break-all">
                {listing.price === 0 ? "FREE" : `₹${listing.price}`}
              </span>
              {listing.listingType === "rent" && <span className="text-base md:text-2xl text-primary/60 font-black uppercase tracking-widest">/ {listing.rentalPeriod || 'month'}</span>}
            </div>

            <div className="flex flex-col gap-5 w-full h-auto min-h-0">
              <button 
                onClick={handleContact} 
                className="btn btn-primary w-full py-5 px-8 text-lg md:text-2xl font-black shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] rounded-2xl flex items-center justify-center gap-4 h-auto min-h-0 text-center whitespace-normal break-words"
              >
                <span className="text-3xl flex-shrink-0">💬</span>
                <span>Chat with Seller</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


