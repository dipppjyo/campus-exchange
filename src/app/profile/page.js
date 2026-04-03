"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ListingCard from "@/components/listings/ListingCard";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function ProfileDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadingTimeout = setTimeout(() => setLoading(false), 8000);

    try {
      const q = query(
        collection(db, "listings"),
        where("sellerId", "==", user.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyListings(items);
        clearTimeout(loadingTimeout);
        setLoading(false);
      }, (error) => {
        console.error("Profile listings snapshot error:", error);
        clearTimeout(loadingTimeout);
        setLoading(false);
      });

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch (err) {
      console.error("Profile init error:", err);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // If loading or not logged in
  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold">Please login to view your profile</h2>
        <button onClick={() => router.push("/auth/login")} className="btn btn-primary mt-4">Login</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-muted">Loading your dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Profile Card */}
        <aside className="w-full md:w-1/3 flex-shrink-0 mb-12 md:mb-0">
          <div className="card p-6 text-center flex flex-col items-center gap-4" style={{ padding: 'var(--space-6)' }}>
            <div className="w-32 h-32 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-5xl">
              {user.name.charAt(0)}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted">{user.email}</p>
            </div>
            
            <div className="w-full flex justify-between bg-surface border px-4 py-3 rounded-lg" style={{ borderColor: 'var(--border)' }}>
              <div className="text-center">
                <div className="font-bold text-lg text-primary">⭐ {user.rating?.average || 5.0}</div>
                <div className="text-xs text-muted">Trust Score</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-primary">{user.exchanges || 0}</div>
                <div className="text-xs text-muted">Exchanges</div>
              </div>
            </div>

            <div className="w-full text-left mt-4 text-sm flex flex-col gap-2">
              <div className="flex justify-between border-b pb-1" style={{ borderColor: 'var(--border)' }}>
                <span className="text-muted">Campus</span>
                <span className="font-bold">{user.campus}</span>
              </div>
              <div className="flex justify-between border-b pb-1" style={{ borderColor: 'var(--border)' }}>
                <span className="text-muted">Department</span>
                <span className="font-bold">{user.department}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted">Year</span>
                <span className="font-bold">{user.year}</span>
              </div>
            </div>
            
            <button className="btn btn-outline w-full mt-4">Edit Profile</button>
          </div>
        </aside>

        {/* Main Content Dashboard */}
        <main className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <button onClick={() => router.push("/post-item")} className="btn btn-primary">
              + New Listing
            </button>
          </div>

          <div className="card p-6 mb-6" style={{ padding: 'var(--space-6)' }}>
            <h3 className="text-xl font-bold mb-4">Active Listings ({myListings.length})</h3>
            {myListings.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
               </div>
            ) : (
              <div className="text-center py-8 bg-surface border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                <p className="text-muted mb-4">You have no active listings.</p>
                <button onClick={() => router.push("/post-item")} className="btn btn-outline text-sm">Post your first item</button>
              </div>
            )}
          </div>


        </main>

      </div>
    </div>
  );
}
