"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Campus selection is no longer needed — users are automatically
// assigned to their campus's marketplace based on their profile.
// This page redirects to the marketplace in case of stale bookmarks.
export default function CampusSelection() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/marketplace");
  }, [router]);

  return (
    <div className="container py-16 text-center animate-fade-in">
      <p className="text-muted">Redirecting to your marketplace...</p>
    </div>
  );
}
