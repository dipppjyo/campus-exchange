"use client";

import Link from "next/link";
import { mockListings, mockCategories } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";
import { useCampus } from "@/context/CampusContext";

export default function Home() {
  const { selectedCampus } = useCampus();
  
  // Filter for urgent items and a few generic ones for demo
  const urgentListings = mockListings.filter(l => l.isUrgent);
  const featuredListings = mockListings.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: 'var(--space-16) 0' }}>
        <div className="container flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl" style={{ maxWidth: '800px' }}>
            Buy, Sell, and Exchange on your Campus.
          </h1>
          <p className="text-xl" style={{ maxWidth: '600px', opacity: 0.9 }}>
            Join your college community marketplace to find cheap books, free notes, and more.
          </p>
          
          <div className="flex gap-4 mt-4">
            <Link href="/marketplace" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Browse Items
            </Link>
            {!selectedCampus && (
              <Link href="/campus" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Select Campus
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container my-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Link href="/marketplace" className="text-primary font-bold">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mockCategories.slice(0, 10).map((cat, i) => (
            <Link href={`/marketplace?category=${encodeURIComponent(cat)}`} key={i} className="card flex items-center justify-center text-center" style={{ padding: 'var(--space-4)', minHeight: '100px', backgroundColor: 'var(--surface)' }}>
              <span className="font-bold">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Urgent Sales */}
      {urgentListings.length > 0 && (
        <section className="container my-8 py-8" style={{ backgroundColor: 'var(--danger-light)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)' }}>
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
      <section className="container my-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Trending Near You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredListings.map(listing => (
            <ListingCard key={`featured-${listing.id}`} listing={listing} />
          ))}
        </div>
      </section>
      
      {/* Semester Kits Banner */}
      <section className="container my-8 py-8">
        <div className="card flex flex-col items-center text-center justify-center" style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: 'var(--space-12)', backgroundImage: 'linear-gradient(45deg, var(--secondary) 0%, var(--primary) 100%)' }}>
          <h2 className="text-3xl font-bold mb-4">Semester Starter Kits</h2>
          <p className="text-lg mb-6" style={{ maxWidth: '600px', opacity: 0.9 }}>
            First year? Get complete bundles of textbooks, drafters, and lab coats curated by seniors from your department.
          </p>
          <button className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '0.75rem 1.5rem', fontWeight: 'bold' }}>
            Coming Soon!
          </button>
        </div>
      </section>

    </div>
  );
}
