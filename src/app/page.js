"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCampus } from "@/context/CampusContext";
import { useRouter } from "next/navigation";
import { mockCategories } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";

import { db } from "@/lib/firebase";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";

export default function Home() {
  const { user, loading } = useAuth();
  const { userCampus } = useCampus();
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
      if (!userCampus) return;
      
      try {
        const listingsRef = collection(db, "listings");
        const recentQuery = query(
          listingsRef,
          orderBy("createdAt", "desc"),
          limit(50) // Fetch a larger set to filter by campus safely
        );

        const snapshot = await getDocs(recentQuery);
        const allListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter by the user's specific campus
        const campusListings = allListings.filter(l => l.campus === userCampus.id);
        
        setUrgentListings(campusListings.filter(l => l.isUrgent).slice(0, 4));
        setFeaturedListings(campusListings.slice(0, 8));
      } catch (err) {
        console.error("Error fetching home data:", err);
      }
    };

    if (mounted && userCampus) {
      fetchHomeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, userCampus]);


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

      {/* Urgent Sales (Filtered by Campus) */}
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

      {/* Trending / Featured (Filtered by Campus) */}
      <section className="container my-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Trending at {userCampus?.name || 'Your Campus'}</h2>
        {featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredListings.map(listing => (
              <ListingCard key={`featured-${listing.id}`} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface border rounded-xl" style={{ borderColor: 'var(--border)' }}>
            <p className="text-muted text-lg">No trending items in your campus yet. Be the first to post!</p>
          </div>
        )}
      </section>
    </div>
  );
}
