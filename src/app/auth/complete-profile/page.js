"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCampus } from "@/context/CampusContext";
import { mockDepartments } from "@/lib/data";

export default function CompleteProfile() {
  const router = useRouter();
  const { user, updateProfile, loading } = useAuth();
  const { availableCampuses } = useCampus();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    campus: "",
    department: "",
    year: "1st Year",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not logged in or if profile is already complete
  useEffect(() => {
    if (mounted && !loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.campus && user.department && user.campus !== "" && user.department !== "") {
        // Only redirect if they actually have these fields set
        // Note: isNewGoogleUser flag might be helpful here if we want to be strict
        router.push("/");
      }
    }
  }, [user, loading, router, mounted]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.campus || !formData.department) {
      setError("Please select both your campus and department.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      await updateProfile({
        campus: formData.campus,
        department: formData.department,
        year: formData.year,
        isNewGoogleUser: false // Clear the flag
      });

      router.push("/");
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading || !mounted) {
    return (
      <div className="container py-16 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-muted">Loading...</h2>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container py-16 flex justify-center animate-fade-in">
      <div className="card p-8 w-full max-w-xl" style={{ padding: 'var(--space-8)' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to ScholarMart!</h1>
          <p className="text-muted text-lg">Just a few more details to set up your student profile.</p>
        </div>

        {error && (
          <div className="bg-danger-light text-danger p-4 rounded-md mb-6 text-sm font-bold" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-6">
            
            <div className="input-group">
              <label className="input-label text-base font-bold mb-2 block">Which Campus are you from?</label>
              <select 
                name="campus" 
                required 
                className="input-field py-3 text-lg" 
                value={formData.campus} 
                onChange={handleChange}
              >
                <option value="">Select Campus...</option>
                {(availableCampuses || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <p className="text-xs text-muted mt-2">This helps us show you items available near you.</p>
            </div>

            <div className="input-group">
              <label className="input-label text-base font-bold mb-2 block">Your Department / Major</label>
              <select 
                name="department" 
                required 
                className="input-field py-3 text-lg" 
                value={formData.department} 
                onChange={handleChange}
              >
                <option value="">Select Department...</option>
                {mockDepartments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label text-base font-bold mb-2 block">Current Academic Year</label>
              <select 
                name="year" 
                required 
                className="input-field py-3 text-lg" 
                value={formData.year} 
                onChange={handleChange}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn btn-primary w-full mt-4 py-4 text-xl font-bold shadow-lg transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? "Saving Profile..." : "Complete Setup →"}
          </button>
        </form>
      </div>
    </div>
  );
}
