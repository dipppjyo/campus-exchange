"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

import { useState } from "react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* ... */}
      <div className="container flex justify-between items-center" style={{ height: '70px' }}>
        <Link href="/" className="flex items-center gap-2">
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}>CS</div>
          <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>CampusSwap</span>
        </Link>
        
        {/* Desktop & Mobile Nav */}
        <div className="flex items-center gap-6 md-flex nav-links" style={{ display: 'none' }}>
          {user && (
            <>
              <Link href="/marketplace" className="font-bold" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
              <Link href="/free-items" onClick={() => setIsMenuOpen(false)}>Free Items</Link>
              <Link href="/rentals" onClick={() => setIsMenuOpen(false)}>Rentals</Link>
            </>
          )}
          <Link href="/how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</Link>


          {!loading && (
            user ? (
              <div className="flex items-center gap-4">
                <Link href="/post-item" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Post Item</Link>
                <Link href="/chat" onClick={() => setIsMenuOpen(false)}>💬 Inbox</Link>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>👤 {user.name.split(' ')[0]}</Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-muted text-sm">Logout</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link href="/auth/signup" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </div>
            )
          )}
          {loading && (
            <div className="w-24 h-8 bg-background animate-pulse rounded-full"></div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button 
          className="md-hidden text-2xl" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
          .md-hidden { display: none !important; }
        }
        @media (max-width: 767px) {
          .md-hidden { display: block !important; }
          .nav-links {
            display: ${isMenuOpen ? 'flex' : 'none'} !important;
            flex-direction: column;
            position: absolute;
            top: 70px;
            left: 0;
            width: 100%;
            background-color: var(--surface);
            padding: var(--space-4);
            border-bottom: 1px solid var(--border);
            box-shadow: var(--shadow-md);
            align-items: flex-start !important;
            gap: var(--space-4) !important;
          }
        }
      `}</style>
    </nav>
  );
}
