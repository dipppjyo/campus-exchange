"use client";

import { mockListings } from "@/lib/data";

const STORAGE_KEY = "campusswap_listings";

// Initialize localStorage with mock data if empty
function getStoredListings() {
  if (typeof window === "undefined") return [...mockListings];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // First time: seed with mock data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockListings));
    return [...mockListings];
  } catch (e) {
    console.warn("localStorage error, using mock data:", e);
    return [...mockListings];
  }
}

function saveListings(listings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  } catch (e) {
    console.warn("Failed to save to localStorage:", e);
  }
}

// Get all listings
export function getAllListings() {
  return getStoredListings();
}

// Add a new listing
export function addListing(listingData) {
  const listings = getStoredListings();
  const newListing = {
    ...listingData,
    id: "l_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    images: listingData.images || ["https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Item+Image"],
  };
  listings.unshift(newListing); // Add to beginning (newest first)
  saveListings(listings);
  return newListing;
}

// Delete a listing
export function deleteListing(listingId) {
  const listings = getStoredListings();
  const filtered = listings.filter(l => l.id !== listingId);
  saveListings(filtered);
  return filtered;
}

// Subscribe to listing changes (poll-based for simplicity)
// Returns an unsubscribe function
export function onListingsChange(callback) {
  // Initial call
  callback(getStoredListings());
  
  // Listen for storage events (cross-tab sync)
  const handler = (e) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredListings());
    }
  };
  
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handler);
  }
  
  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handler);
    }
  };
}
