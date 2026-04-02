"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { mockCampuses, mockDepartments } from "@/lib/data";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    campus: "",
    department: "",
    year: "Freshman",
  });
  
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.endsWith(".edu")) {
      setError("You must use a valid .edu college email to join.");
      return;
    }
    
    try {
      await signup(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.campus, 
        formData.department, 
        formData.year
      );
      router.push("/marketplace");
    } catch (err) {
      setError(err.message || "Failed to create an account.");
    }
  };

  return (
    <div className="container py-16 flex justify-center animate-fade-in">
      <div className="card p-8 w-full max-w-xl" style={{ padding: 'var(--space-8)' }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Create Student Profile</h1>
          <p className="text-muted">Join your campus community today.</p>
        </div>

        {error && (
          <div className="bg-danger-light text-danger p-4 rounded-md mb-6 text-sm font-bold" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input name="name" type="text" required className="input-field" placeholder="Alex Doe" value={formData.name} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">College Email (.edu)</label>
              <input name="email" type="email" required className="input-field" placeholder="alex@college.edu" value={formData.email} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input name="password" type="password" required className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label className="input-label">Campus</label>
              <select name="campus" required className="input-field" value={formData.campus} onChange={handleChange}>
                <option value="">Select Campus...</option>
                {mockCampuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Department</label>
              <select name="department" required className="input-field" value={formData.department} onChange={handleChange}>
                <option value="">Select Department...</option>
                {mockDepartments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Year</label>
              <select name="year" required className="input-field" value={formData.year} onChange={handleChange}>
                <option value="Freshman">Freshman (1st Year)</option>
                <option value="Sophomore">Sophomore (2nd Year)</option>
                <option value="Junior">Junior (3rd Year)</option>
                <option value="Senior">Senior (4th Year)</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

          </div>

          {/* Verification Warning */}
          <div className="p-4 bg-primary-light border border-primary rounded-md text-sm mt-2" style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary)', borderWidth: '1px', borderStyle: 'solid', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
            <strong>Note:</strong> We will send a verification link to your .edu email. Only verified students are allowed to post items.
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2 py-3 text-lg">
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-muted">Already have an account? </span>
          <Link href="/auth/login" className="text-primary font-bold">Login</Link>
        </div>
      </div>
    </div>
  );
}
