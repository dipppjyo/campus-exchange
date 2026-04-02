"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { mockCategories, mockDepartments } from "@/lib/data";

export default function PostItem() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    department: "",
    condition: "good",
    listingType: "sell",
    isUrgent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally this would be a fetch call to an API route
    // For now, just alert and redirect back to marketplace
    alert("Item posted successfully! (Mocked)");
    router.push("/marketplace");
  };

  // If not logged in, show warning
  if (!user) {
    return (
      <div className="container py-16 text-center animate-fade-in">
        <div className="card p-8 max-w-md mx-auto" style={{ padding: 'var(--space-8)' }}>
          <h2 className="text-2xl font-bold mb-4">Verification Required</h2>
          <p className="text-muted mb-6">You must be logged in as a verified student to post items on your campus exchange.</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => router.push("/auth/login")} className="btn btn-primary">Login Now</button>
            <button onClick={() => router.push("/auth/signup")} className="btn btn-outline">Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Post an Item</h1>
      
      <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-6" style={{ padding: 'var(--space-8)' }}>
        
        {/* Basic Info */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold border-b pb-2" style={{ borderBottom: '1px solid var(--border)' }}>Basic Detail</h3>
          
          <div className="input-group">
            <label className="input-label">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required type="text" className="input-field" placeholder="What are you selling/sharing?" />
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="input-field" rows="4" placeholder="Describe the item condition, history, etc."></textarea>
          </div>
        </div>

        {/* Categorization */}
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-xl font-bold border-b pb-2" style={{ borderBottom: '1px solid var(--border)' }}>Categorization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                <option value="">Select Category...</option>
                {mockCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Target Department</label>
              <select name="department" value={formData.department} onChange={handleChange} required className="input-field">
                <option value="">Select Department...</option>
                {mockDepartments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div className="input-group">
              <label className="input-label">Type</label>
              <select name="listingType" value={formData.listingType} onChange={handleChange} required className="input-field">
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
                <option value="donate">Donate (Free)</option>
                <option value="exchange">Exchange</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange} required className="input-field">
                <option value="new">Like New</option>
                <option value="good">Good</option>
                <option value="used">Used / Fair</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-xl font-bold border-b pb-2" style={{ borderBottom: '1px solid var(--border)' }}>Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="input-group">
              <label className="input-label">Price ($)</label>
              <input 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required={formData.listingType !== "donate"} 
                disabled={formData.listingType === "donate"}
                type="number" 
                min="0"
                className="input-field" 
                placeholder={formData.listingType === "donate" ? "Free" : "0.00"} 
              />
            </div>
            
            <label className="flex items-center gap-2 mt-6 cursor-pointer">
              <input name="isUrgent" checked={formData.isUrgent} onChange={handleChange} type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--danger)' }} />
              <span className="font-bold text-danger">🚨 Urgent Sale (Highlight item)</span>
            </label>
          </div>
        </div>

        {/* Image Upload placeholder */}
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-xl font-bold border-b pb-2" style={{ borderBottom: '1px solid var(--border)' }}>Images</h3>
          <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <span className="text-4xl mb-2">📸</span>
            <p className="font-bold">Click to upload images</p>
            <p className="text-sm text-muted">Supports JPG, PNG (Max 5MB)</p>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full text-lg mt-6 py-4">
          Post Listing
        </button>
      </form>
    </div>
  );
}
