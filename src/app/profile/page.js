"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { mockListings } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";

export default function ProfileDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // If loading or not logged in, show redirect or message
  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold">Please login to view your profile</h2>
        <button onClick={() => router.push("/auth/login")} className="btn btn-primary mt-4">Login</button>
      </div>
    );
  }

  // Get user's active listings (mocked by matching u2 to John Doe for example, but here we'll just mock 2 items)
  const myActiveListings = mockListings.slice(0, 2); 
  const myCompletedExchanges = 5;

  return (
    <div className="container py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Profile Card */}
        <aside className="w-full md:w-1/3 flex-shrink-0">
          <div className="card p-6 text-center flex flex-col items-center gap-4" style={{ padding: 'var(--space-6)' }}>
            <div className="w-32 h-32 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-5xl">
              {user.name.charAt(0)}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted">{user.email}</p>
            </div>
            
            <div className="w-full flex justify-between bg-surface border px-4 py-3 rounded-lg" style={{ borderColor: 'var(--border)' }}>
              <div className="text-center">
                <div className="font-bold text-lg text-primary">⭐ {user.rating?.average || 5.0}</div>
                <div className="text-xs text-muted">Trust Score</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-primary">{myCompletedExchanges}</div>
                <div className="text-xs text-muted">Exchanges</div>
              </div>
            </div>

            <div className="w-full text-left mt-4 text-sm flex flex-col gap-2">
              <div className="flex justify-between border-b pb-1" style={{ borderColor: 'var(--border)' }}>
                <span className="text-muted">Campus</span>
                <span className="font-bold">{user.campus}</span>
              </div>
              <div className="flex justify-between border-b pb-1" style={{ borderColor: 'var(--border)' }}>
                <span className="text-muted">Department</span>
                <span className="font-bold">{user.department}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted">Year</span>
                <span className="font-bold">{user.year}</span>
              </div>
            </div>
            
            <button className="btn btn-outline w-full mt-4">Edit Profile</button>
          </div>
        </aside>

        {/* Main Content Dashboard */}
        <main className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <button onClick={() => router.push("/post-item")} className="btn btn-primary">
              + New Listing
            </button>
          </div>

          <div className="card p-6 mb-8" style={{ padding: 'var(--space-6)' }}>
            <h3 className="text-xl font-bold mb-4">Active Listings ({myActiveListings.length})</h3>
            {myActiveListings.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myActiveListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
               </div>
            ) : (
              <div className="text-center py-8 bg-surface border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                <p className="text-muted mb-4">You have no active listings.</p>
                <button onClick={() => router.push("/post-item")} className="btn btn-outline text-sm">Post your first item</button>
              </div>
            )}
          </div>

          <div className="card p-6" style={{ padding: 'var(--space-6)' }}>
            <h3 className="text-xl font-bold mb-4">Recent Activity & Reviews</h3>
            <div className="flex flex-col gap-4">
              <div className="p-4 border rounded-md" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Sold "Casio FX-991EX"</span>
                  <span className="text-sm text-yellow-600">⭐ 5.0</span>
                </div>
                <p className="text-sm text-muted">"Great seller, item was exactly as described and met near the library on time." - Freshman Tom</p>
              </div>
              <div className="p-4 border rounded-md" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Bought "Engineering Drawing Board"</span>
                  <span className="text-sm text-yellow-600">⭐ 5.0</span>
                </div>
                <p className="text-sm text-muted">"Thanks for negotiating on the price!" - Senior Amanda</p>
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
