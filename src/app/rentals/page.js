"use client";

import { useState, useEffect } from "react";
import { useCampus } from "@/context/CampusContext";
import ListingCard from "@/components/listings/ListingCard";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function Rentals() {
  const { selectedCampus } = useCampus();
  const [rentalListings, setRentalListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setLoading(false), 8000);

    try {
      const q = query(
        collection(db, "listings"),
        where("listingType", "==", "rent"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRentalListings(items);
        clearTimeout(loadingTimeout);
        setLoading(false);
      }, (error) => {
        console.error("Rentals snapshot error:", error);
        clearTimeout(loadingTimeout);
        setLoading(false);
      });

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch (err) {
      console.error("Rentals init error:", err);
      setLoading(false);
    }
  }, []);

  const filtered = selectedCampus
    ? rentalListings.filter(l => l.campus === selectedCampus.id)
    : rentalListings;

  if (loading) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-muted">Loading rentals...</h2>
      </div>
    );
  }

  return (
    <div className="container py-16 animate-fade-in">
      <div className="card p-12 text-center mb-12" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent)' }}>
        <h1 className="text-4xl font-bold text-accent mb-4">Campus Rentals</h1>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: '#B45309' }}>
          Don&apos;t want to buy? Rent calculators, drafters, lab coats, and heavy equipment for a day, week, or the entire semester.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {selectedCampus ? `Rentals at ${selectedCampus.name}` : 'All Rentals'}
        </h2>
        <span className="badge badge-accent">{filtered.length} available</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface border rounded-xl" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-xl font-bold mb-2">No rentals currently available</h3>
          <p className="text-muted">Have a calculator you aren't using? List it for rent!</p>
        </div>
      )}
    </div>
  );
}
