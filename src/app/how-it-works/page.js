"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function HowItWorks() {
  const { user } = useAuth();
  return (
    <div className="container py-16 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">How ScholarMart Works</h1>
        <p className="text-xl text-muted">A safe, verified marketplace exclusively for students.</p>
      </div>

      <div className="flex flex-col gap-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">1</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Verify Your Student Status</h3>
            <p className="text-lg text-muted">Sign up using your email address. We verify that you are an active student, ensuring a safe community with no outsiders.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">2</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Post or Find Items</h3>
            <p className="text-lg text-muted">Seniors can post used textbooks, lab equipment, or free notes. Juniors can easily search by department or category to find cheap resources they need for the semester.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">3</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Connect & Meet on Campus</h3>
            <p className="text-lg text-muted">Use the secure in-app chat to negotiate prices and arrange a safe meeting spot right on your college campus—like the library or cafeteria.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 rounded-full bg-danger text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">4</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Rate & Build Trust</h3>
            <p className="text-lg text-muted">After the exchange, leave a review. This builds a trust score for every student, encouraging honest and reliable interactions within your college.</p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center card p-12 bg-primary-light">
        <h2 className="text-3xl font-bold mb-6 text-primary">Ready to declutter or save money?</h2>
        <div className="flex justify-center gap-4">
          <Link href={user ? "/post-item" : "/auth/signup"} className="btn btn-primary text-lg px-8">
            {user ? "Post an Item" : "Join Your Campus"}
          </Link>
          {user && (
            <Link href="/marketplace" className="btn btn-outline text-lg px-8 bg-white">Browse Now</Link>
          )}
        </div>
      </div>
    </div>
  );
}
