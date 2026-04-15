"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { mockCategories } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";

import { db } from "@/lib/firebase";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [urgentListings, setUrgentListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router, mounted]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const recentQuery = query(
          listingsRef,
          orderBy("createdAt", "desc"),
          limit(20)
        );

        const snapshot = await getDocs(recentQuery);
        const allListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setUrgentListings(allListings.filter(l => l.isUrgent).slice(0, 4));
        setFeaturedListings(allListings.slice(0, 8));
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };

    fetchHomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (loading) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-muted">Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {/* Categories */}
      <section className="container my-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Categories</h2>
          <Link href="/marketplace" className="text-primary text-sm font-bold">View All →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4 gap-3">
          {mockCategories.slice(0, 10).map((cat, i) => (
            <Link href={`/marketplace?category=${encodeURIComponent(cat)}`} key={i} className="card flex items-center justify-center text-center" style={{ padding: 'var(--space-2)', minHeight: '60px', backgroundColor: 'var(--surface)' }}>
              <span className="font-semibold text-sm">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Urgent Sales */}
      {urgentListings.length > 0 && (
        <section className="container my-6 py-8" style={{ backgroundColor: 'var(--danger-light)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)' }}>
          <div className="flex items-center gap-2 mb-6 text-danger">
            <h2 className="text-2xl font-bold">🚨 Leaving Campus Soon</h2>
            <span className="text-muted text-sm ml-auto">Urgent sales by seniors</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {urgentListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
