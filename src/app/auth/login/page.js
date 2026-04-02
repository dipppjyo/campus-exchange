"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@") || !email.endsWith(".edu")) {
      setError("Please use a valid college .edu email address.");
      return;
    }
    
    // Call mock login
    login(email, password);
    router.push("/marketplace");
  };

  return (
    <div className="container py-16 flex justify-center animate-fade-in">
      <div className="card p-8 w-full max-w-md" style={{ padding: 'var(--space-8)' }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted">Login to your campus marketplace</p>
        </div>

        {error && (
          <div className="bg-danger-light text-danger p-4 rounded-md mb-6 text-sm font-bold" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="input-group">
            <label className="input-label">College Email (.edu)</label>
            <input 
              type="email" 
              required
              className="input-field" 
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <div className="flex justify-between">
              <label className="input-label">Password</label>
              <a href="#" className="text-sm text-primary">Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2 py-3 text-lg">
            Login
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-muted">Don&apos;t have an account? </span>
          <Link href="/auth/signup" className="text-primary font-bold">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
