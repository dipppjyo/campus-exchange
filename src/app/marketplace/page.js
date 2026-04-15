"use client";

import { useState, useEffect } from "react";
import { mockCategories, mockDepartments } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";
import { useCampus } from "@/context/CampusContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

export default function Marketplace() {
  const { userCampus } = useCampus();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router, mounted]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  // Real-time fetch from Firestore
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    try {
      const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListings(items);
        setError("");
        clearTimeout(loadingTimeout);
        setLoading(false);
      }, (err) => {
        console.error("Marketplace snapshot error:", err);
        setError("Could not load listings. Make sure Firestore is set up in your Firebase Console.");
        clearTimeout(loadingTimeout);
        setLoading(false);
      });
      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch (err) {
      console.error("Marketplace init error:", err);
      setError("Failed to connect to database.");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Filter logic
  const filteredListings = listings.filter(listing => {
    if (userCampus && listing.campus !== userCampus.id) return false;
    if (search && !listing.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && listing.category !== category) return false;
    if (department && listing.department !== department) return false;
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-muted">Loading...</h2>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container py-6 flex flex-col gap-6 animate-fade-in">
      <div className="flex gap-4 items-center bg-surface p-4 rounded-xl border shadow-sm" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <input
          type="text"
          className="input-field flex-grow py-2 px-4"
          placeholder="Search items by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full">

        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
            <strong>⚠️ Connection Error:</strong> {error}
          </div>
        )}

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border rounded-xl" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-xl font-bold mb-2">No listings found</h3>
            <p className="text-muted">Try adjusting your filters or post the first item!</p>
          </div>
        )}
      </main>
    </div>
  );
}
