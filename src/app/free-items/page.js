"use client";

import { useCampus } from "@/context/CampusContext";
import { mockListings } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";

export default function FreeItems() {
  const { selectedCampus } = useCampus();
  
  // Filter for only 'donate' listingType
  let freeListings = mockListings.filter(l => l.listingType === "donate");
  
  if (selectedCampus) {
    freeListings = freeListings.filter(l => l.campus === selectedCampus.id);
  }

  return (
    <div className="container py-16 animate-fade-in">
      <div className="card p-12 text-center mb-12" style={{ backgroundColor: 'var(--secondary-light)', border: '1px solid var(--secondary)' }}>
        <h1 className="text-4xl font-bold text-secondary mb-4">Free & Donation Section</h1>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--secondary-hover)' }}>
          Help out your juniors! This section is dedicated to textbooks, old notes, lab files, and other items being given away for free on your campus.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {selectedCampus ? `Free items at ${selectedCampus.name}` : 'All Free Items'}
        </h2>
        <span className="badge badge-secondary">{freeListings.length} available</span>
      </div>

      {freeListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {freeListings.map(listing => (
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
