"use client";

import { useAuth } from "@/context/AuthContext";
import { useCampus } from "@/context/CampusContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ListingCard from "@/components/listings/ListingCard";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { mockDepartments } from "@/lib/data";

export default function ProfileDashboard() {
  const { user, updateProfile } = useAuth();
  const { availableCampuses } = useCampus();
  const router = useRouter();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: "", campus: "", department: "", year: "" });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Delete listing state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadingTimeout = setTimeout(() => setLoading(false), 8000);

    try {
      const q = query(
        collection(db, "listings"),
        where("sellerId", "==", user.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyListings(items);
        clearTimeout(loadingTimeout);
        setLoading(false);
      }, (error) => {
        console.error("Profile listings snapshot error:", error);
        clearTimeout(loadingTimeout);
        setLoading(false);
      });

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch (err) {
      console.error("Profile init error:", err);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Open Edit Modal pre-filled
  const openEditModal = () => {
    setEditData({
      name: user.name || "",
      campus: user.campus || "",
      department: user.department || "",
      year: user.year || "1st Year",
    });
    setEditError("");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.name.trim()) {
      setEditError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setEditError("");
      await updateProfile({
        name: editData.name.trim(),
        campus: editData.campus,
        department: editData.department,
        year: editData.year,
      });
      setShowEditModal(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setEditError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Delete a listing
  const handleDeleteListing = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteDoc(doc(db, "listings", deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert("Failed to delete listing.");
    } finally {
      setDeleting(false);
    }
  };

  // If loading or not logged in
  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-bold">Please login to view your profile</h2>
        <button onClick={() => router.push("/auth/login")} className="btn btn-primary mt-4">Login</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-muted">Loading your dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto animate-fade-in">

      {/* Success Toast */}
      {showToast && (
        <div className="toast-success">✅ Profile updated successfully!</div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: 'var(--space-8)' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{ fontSize: '1.5rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {editError && (
                <div style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: '0.875rem', fontWeight: 600 }}>
                  {editError}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your Name"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Campus</label>
                  <select
                    className="input-field"
                    value={editData.campus}
                    onChange={(e) => setEditData(prev => ({ ...prev, campus: e.target.value }))}
                  >
                    <option value="">Select Campus...</option>
                    {(availableCampuses || []).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    {/* Fallback if user's campus isn't in the list */}
                    {editData.campus && !(availableCampuses || []).find(c => c.id === editData.campus) && (
                      <option value={editData.campus}>{editData.campus}</option>
                    )}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Department</label>
                  <select
                    className="input-field"
                    value={editData.department}
                    onChange={(e) => setEditData(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <option value="">Select Department...</option>
                    {mockDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Year</label>
                  <select
                    className="input-field"
                    value={editData.year}
                    onChange={(e) => setEditData(prev => ({ ...prev, year: e.target.value }))}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                <div className="flex gap-4" style={{ marginTop: 'var(--space-4)' }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Listing Confirmation */}
      {deleteTarget && (
        <div className="confirm-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 'var(--space-4)' }}>🗑️</span>
            <h3 className="text-xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>Delete listing?</h3>
            <p className="text-muted" style={{ marginBottom: 'var(--space-6)', fontSize: '0.875rem' }}>
              &ldquo;{deleteTarget.title}&rdquo; will be permanently removed.
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setDeleteTarget(null)} className="btn btn-outline" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={handleDeleteListing} disabled={deleting} className="btn btn-danger" style={{ flex: 1 }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Profile Card */}
        <aside className="w-full md:w-1/3 flex-shrink-0 mb-12 md:mb-0">
          <div className="card p-6 text-center flex flex-col items-center gap-4" style={{ padding: 'var(--space-6)' }}>
            <div className="w-32 h-32 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-5xl">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user.name.charAt(0)
              )}
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
                <div className="font-bold text-lg text-primary">{user.exchanges || 0}</div>
                <div className="text-xs text-muted">Exchanges</div>
              </div>
            </div>

            <div className="w-full text-left mt-4 text-sm flex flex-col gap-2">
              <div className="flex justify-between border-b pb-1" style={{ borderColor: 'var(--border)' }}>
                <span className="text-muted">Campus</span>
                <span className="font-bold">
                  {availableCampuses?.find(c => c.id === user.campus)?.name || user.campus}
                </span>
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
            
            <button
              onClick={openEditModal}
              className="btn btn-outline w-full mt-4"
              id="edit-profile-btn"
            >
              Edit Profile
            </button>
          </div>
        </aside>

        {/* Main Content Dashboard */}
        <main className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <button onClick={() => router.push("/post-item")} className="btn btn-primary">
              + New Listing
            </button>
          </div>

          <div className="card p-6 mb-6" style={{ padding: 'var(--space-6)' }}>
            <h3 className="text-xl font-bold mb-4">Active Listings ({myListings.length})</h3>
            {myListings.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myListings.map(listing => (
                    <div key={listing.id} style={{ position: 'relative' }}>
                      <ListingCard listing={listing} />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteTarget(listing);
                        }}
                        className="btn btn-danger-outline"
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          zIndex: 10,
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                        title="Delete this listing"
                        id={`delete-listing-${listing.id}`}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
               </div>
            ) : (
              <div className="text-center py-8 bg-surface border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                <p className="text-muted mb-4">You have no active listings.</p>
                <button onClick={() => router.push("/post-item")} className="btn btn-outline text-sm">Post your first item</button>
              </div>
            )}
          </div>


        </main>

      </div>
    </div>
  );
}
