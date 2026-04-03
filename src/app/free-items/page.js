"use client";

import { useState, useEffect } from "react";
import { useCampus } from "@/context/CampusContext";
import ListingCard from "@/components/listings/ListingCard";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function FreeItems() {
  const { selectedCampus } = useCampus();
  const [freeListings, setFreeListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setLoading(false), 8000);

    try {
      const q = query(
        collection(db, "listings"),
        where("listingType", "==", "donate")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFreeListings(items);
        clearTimeout(loadingTimeout);
        setLoading(false);
      }, (error) => {
        console.error("Free items snapshot error:", error);
        clearTimeout(loadingTimeout);
        setLoading(false);
      });

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch (err) {
      console.error("Free items init error:", err);
      setLoading(false);
    }
  }, []);

  const filtered = selectedCampus 
    ? freeListings.filter(l => l.campus === selectedCampus.id)
    : freeListings;

  if (loading) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-muted">Loading free items...</h2>
      </div>
    );
  }

  return (
    <div className="container py-16 animate-fade-in">


      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {selectedCampus ? `Free items at ${selectedCampus.name}` : 'All Free Items'}
        </h2>
        <span className="badge badge-secondary">{filtered.length} available</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface border rounded-xl" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-xl font-bold mb-2">No free items currently available</h3>
          <p className="text-muted">Check back later or be the first to donate something!</p>
        </div>
      )}
    </div>
  );
}
