"use client";

import { useState, useEffect } from "react";
import { mockCategories, mockDepartments } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";
import { useCampus } from "@/context/CampusContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

export default function Marketplace() {
  const { selectedCampus } = useCampus();
  
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
    if (selectedCampus && listing.campus !== selectedCampus.id) return false;
    if (search && !listing.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && listing.category !== category) return false;
    if (department && listing.department !== department) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-muted">Loading campus items...</h2>
      </div>
    );
  }

  return (
    <div className="container py-6 flex flex-col md:flex-row gap-8 animate-fade-in" style={{ display: 'flex', gap: 'var(--space-8)' }}>
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0" style={{ width: '100%', maxWidth: '240px' }}>
        <div className="card p-4" style={{ padding: 'var(--space-4)' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3">Filters</h2>
          
          <div className="input-group mb-3">
            <label className="text-xs font-semibold text-muted">Search</label>
            <input 
              type="text" 
              className="input-field py-1.5 px-3 text-sm" 
              placeholder="Items..." 
              style={{ fontSize: '0.875rem', padding: '0.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="input-group mb-3">
            <label className="text-xs font-semibold text-muted">Category</label>
            <select 
              className="input-field py-1.5 px-3 text-sm"
              style={{ fontSize: '0.875rem', padding: '0.5rem' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All</option>
              {mockCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="input-group mb-4">
            <label className="text-xs font-semibold text-muted">Department</label>
            <select 
              className="input-field py-1.5 px-3 text-sm"
              style={{ fontSize: '0.875rem', padding: '0.5rem' }}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All</option>
              {mockDepartments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <button 
            className="btn btn-outline w-full py-1.5 text-xs font-bold"
            onClick={() => { setSearch(""); setCategory(""); setDepartment(""); }}
          >
            Clear Filters
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {selectedCampus ? `${selectedCampus.name} Marketplace` : "Global Marketplace"}
          </h1>
          <span className="text-muted">{filteredListings.length} results</span>
        </div>

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
      
      <style jsx>{`
        @media (max-width: 768px) {
          .container { flex-direction: column !important; }
          aside { max-width: 100% !important; }
        }
      `}
      </style>
    </div>
  );
}
