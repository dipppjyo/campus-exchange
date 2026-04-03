"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { mockCategories } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";
import { useCampus } from "@/context/CampusContext";
import { db } from "@/lib/firebase";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";

export default function Home() {
  const { selectedCampus } = useCampus();
  const [urgentListings, setUrgentListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);

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


  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, #6366F1 50%, #8B5CF6 100%)', 
        color: 'white', 
        padding: 'var(--space-12) 0',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
        boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background decoration */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: '250px', height: '250px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }}></div>
        
        <div className="container flex flex-col items-center text-center gap-4" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="text-2xl md:text-4xl" style={{ maxWidth: '800px', lineHeight: '1.4' }}>
            Buy, Sell, and Exchange on your Campus.
          </h1>
          <p className="text-base md:text-lg" style={{ maxWidth: '500px', opacity: 0.9, lineHeight: '1.6' }}>
            Join your college community marketplace to find books, notes, and more.
          </p>
          
          <div className="flex gap-3 mt-2" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/marketplace" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              Browse Items
            </Link>
            {!selectedCampus && (
              <Link href="/campus" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                Select Campus
              </Link>
            )}
          </div>
        </div>
      </section>

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

      {/* Trending / Featured */}
      <section className="container my-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Trending Near You</h2>
        {featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredListings.map(listing => (
              <ListingCard key={`featured-${listing.id}`} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface border rounded-xl" style={{ borderColor: 'var(--border)' }}>
            <p className="text-muted text-lg">No listings yet. Be the first to post an item!</p>
          </div>
        )}
      </section>
    </div>
  );
}
