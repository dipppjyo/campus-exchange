"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && user) {
      router.push("/");
    }
  }, [user, loading, router, mounted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError("");
      await login(email, password);
      // Redirect happens via useEffect once auth context recognizes user
    } catch (err) {
      setError("Invalid email or password.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      await loginWithGoogle();
      // Redirect happens via useEffect
    } catch (err) {
      setError(err.message || "Google sign-in failed. Please try again.");
      setIsSubmitting(false);
    }
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

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="btn-google"
          id="google-login-btn"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="divider-or">or</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              required
              className="input-field" 
              placeholder="you@example.com"
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

          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full mt-2 py-3 text-lg">
            {isSubmitting ? "Logging in..." : "Login"}
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
