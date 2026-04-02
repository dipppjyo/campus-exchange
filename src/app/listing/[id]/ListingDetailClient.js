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
        <h2 className="text-2xl font-bold text-muted">Loading listing details...</h2>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold">Listing not found</h2>
        <button onClick={() => router.push("/marketplace")} className="btn btn-primary mt-4">Back to Marketplace</button>
      </div>
    );
  }

  let badgeClass = "badge-primary";
  if (listing.listingType === "donate") badgeClass = "badge-secondary";
  if (listing.listingType === "rent") badgeClass = "badge-accent";

  return (
    <div className="container py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Images */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden bg-surface border" style={{ borderColor: 'var(--border)', height: '400px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {listing.isUrgent && <span className="badge badge-danger">Urgent Sale</span>}
              <span className={`badge ${badgeClass} capitalize`}>{listing.listingType}</span>
              <span className="badge badge-outline">{listing.department}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-Sm text-muted mb-4">Posted on {new Date(listing.createdAt).toLocaleDateString()}</p>
            
            <div className="text-4xl font-bold text-primary mb-6">
              {listing.price === 0 ? "FREE" : `$${listing.price}`}
              {listing.listingType === "rent" && <span className="text-xl text-muted">/{listing.rentalPeriod}</span>}
            </div>
          </div>
          
          <div className="card p-6" style={{ padding: 'var(--space-6)' }}>
            <h3 className="font-bold mb-4 border-b pb-2" style={{ borderBottom: '1px solid var(--border)' }}>Description</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{listing.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <span className="block text-sm text-muted">Condition</span>
                <span className="font-bold capitalize">{listing.condition}</span>
              </div>
              <div>
                <span className="block text-sm text-muted">Category</span>
                <span className="font-bold capitalize">{listing.category}</span>
              </div>
            </div>
          </div>

          <div className="card p-6" style={{ padding: 'var(--space-6)' }}>
            <h3 className="font-bold mb-4 border-b pb-2" style={{ borderBottom: '1px solid var(--border)' }}>Seller Information</h3>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-xl">
                  {listing.sellerName?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-bold">{listing.sellerName}</div>
                  <div className="text-sm text-yellow-600">⭐ {listing.sellerRating || 5.0} / 5.0</div>
                </div>
              </div>
            </div>
            <button onClick={handleContact} className="btn btn-primary w-full py-3 text-lg">
              💬 Message Seller
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
