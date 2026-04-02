"use client";

import { useState } from "react";
import { mockListings, mockCategories, mockDepartments } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";
import { useCampus } from "@/context/CampusContext";

export default function Marketplace() {
  const { selectedCampus } = useCampus();
  
  // States for filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  
  // Filter logic
  const filteredListings = mockListings.filter(listing => {
    // If a campus is selected globally, technically we should only show items from that campus.
    // For demo purposes, if they haven't selected one, show all. 
    if (selectedCampus && listing.campus !== selectedCampus.id) return false;
    
    if (search && !listing.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && listing.category !== category) return false;
    if (department && listing.department !== department) return false;
    
    return true;
  });

  return (
    <div className="container py-8 flex flex-col md:flex-row gap-8 animate-fade-in" style={{ display: 'flex', gap: 'var(--space-8)' }}>
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0" style={{ width: '100%', maxWidth: '250px' }}>
        <div className="card p-6" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          
          <div className="input-group mb-4">
            <label className="input-label">Search</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search items..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="input-group mb-4">
            <label className="input-label">Category</label>
            <select 
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {mockCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="input-group mb-6">
            <label className="input-label">Department</label>
            <select 
              className="input-field"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {mockDepartments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <button 
            className="btn btn-outline w-full"
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

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border rounded-xl" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
            <h3 className="text-xl font-bold mb-2">No listings found</h3>
            <p className="text-muted">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .container { flex-direction: column !important; }
          aside { max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
