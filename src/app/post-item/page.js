"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { mockCategories, mockDepartments } from "@/lib/data";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    setImageFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError("");
      
      let imageUrls = ["https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Item+Image"];
      
      if (imageFiles.length > 0) {
        imageUrls = [];
        for (const file of imageFiles) {
          const imageRef = ref(storage, `listings/${Date.now()}_${file.name}`);
          const uploadResult = await uploadBytes(imageRef, file);
          const downloadUrl = await getDownloadURL(uploadResult.ref);
          imageUrls.push(downloadUrl);
        }
      }

      const listingData = {
        ...formData,
        price: formData.listingType === "donate" ? 0 : parseFloat(formData.price),
        seller: { name: user.name, id: user.id, rating: user.rating?.average || 5.0 },
        sellerId: user.id,
        sellerName: user.name,
        campus: user.campus || "c1",
        createdAt: serverTimestamp(),
        images: imageUrls
      };

      await addDoc(collection(db, "listings"), listingData);
      
      alert("Item posted successfully!");
      router.push("/marketplace");
    } catch (error) {
      console.error("Error posting item:", error);
      setError(error.message || "Failed to post item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If not logged in, show warning
  if (!user) {
    return (
      <div className="container py-16 text-center animate-fade-in">
        <div className="card p-8 max-w-md mx-auto" style={{ padding: 'var(--space-8)' }}>
          <h2 className="text-2xl font-bold mb-4">Verification Required</h2>
          <p className="text-muted mb-6">You must be logged in as a verified student to post items on CampusSwap.</p>
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
      
      {error && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

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
              <label className="input-label">Price (₹)</label>
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
          <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center relative hover:bg-gray-50 transition" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImageChange}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              title="Click to upload images"
            />
            <span className="text-4xl mb-2">📸</span>
            <p className="font-bold">Click or drag to upload images</p>
            <p className="text-sm text-muted">Supports JPG, PNG (Max 5 images)</p>
          </div>
          
          {imagePreviews.length > 0 && (
            <div className="flex gap-4 overflow-x-auto py-2">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt="Preview" className="h-24 w-24 object-cover rounded-lg border" style={{ borderColor: 'var(--border)' }} />
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full text-lg mt-6 py-4">
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </form>
    </div>
  );
}
