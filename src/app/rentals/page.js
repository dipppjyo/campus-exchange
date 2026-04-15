"use client";

import { useState, useEffect } from "react";
import { useCampus } from "@/context/CampusContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ListingCard from "@/components/listings/ListingCard";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function Rentals() {
  const { userCampus } = useCampus();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const [rentalListings, setRentalListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setLoading(false), 8000);

    try {
      const q = query(
        collection(db, "listings"),
        where("listingType", "==", "rent")
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

  const filtered = userCampus
    ? rentalListings.filter(l => l.campus === userCampus.id)
    : rentalListings;

  if (authLoading || loading) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-muted">Loading...</h2>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container py-16 animate-fade-in">


      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {userCampus ? `Rentals at ${userCampus.name}` : 'All Rentals'}
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
