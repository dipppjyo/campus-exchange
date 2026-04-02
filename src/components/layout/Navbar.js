"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCampus } from "@/context/CampusContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { selectedCampus } = useCampus();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', sticky: 'top', zIndex: 100 }}>
      <div className="container flex justify-between items-center" style={{ height: '70px' }}>
        <Link href="/" className="flex items-center gap-2">
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}>CE</div>
          <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>Campus Exchange</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="flex items-center gap-6 md-flex" style={{ display: 'none' }}>
          <Link href="/marketplace" className="font-bold">Marketplace</Link>
          <Link href="/free-items">Free Items</Link>
          <Link href="/rentals">Rentals</Link>
          <Link href="/how-it-works">How It Works</Link>
          
          {selectedCampus ? (
            <Link href="/campus" className="badge badge-primary">
              {selectedCampus.name.split(',')[0]}
            </Link>
          ) : (
            <Link href="/campus" className="badge badge-primary">Select Campus</Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/post-item" className="btn btn-primary">Post Item</Link>
              <Link href="/chat">💬 Inbox</Link>
              <Link href="/profile">👤 {user.name.split(' ')[0]}</Link>
              <button onClick={logout} className="text-muted text-sm">Logout</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" className="btn btn-outline">Login</Link>
              <Link href="/auth/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle would go here */}
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
