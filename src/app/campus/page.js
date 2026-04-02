"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockCampuses } from "@/lib/data";
import { useCampus } from "@/context/CampusContext";

export default function CampusSelection() {
  const router = useRouter();
  const { selectedCampus, setSelectedCampus } = useCampus();
  const [search, setSearch] = useState("");

  const filteredCampuses = mockCampuses.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (campus) => {
    setSelectedCampus(campus);
    router.push("/marketplace");
  };

  return (
    <div className="container py-16 max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Campus</h1>
        <p className="text-lg text-muted">Join your specific college marketplace to see local listings.</p>
      </div>

      <div className="card p-8" style={{ padding: 'var(--space-8)' }}>
        <div className="input-group mb-6">
          <label className="input-label">Search College Name or City</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="e.g. State University..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filteredCampuses.length > 0 ? (
            filteredCampuses.map(campus => (
              <button 
                key={campus.id} 
                className="flex items-center justify-between p-4 border rounded hover:bg-primary-light transition text-left"
                style={{ 
                  padding: 'var(--space-4)', 
                  border: `1px solid ${selectedCampus?.id === campus.id ? 'var(--primary)' : 'var(--border)'}`, 
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: selectedCampus?.id === campus.id ? 'var(--primary-light)' : 'transparent'
                }}
                onClick={() => handleSelect(campus)}
              >
                <div>
                  <h3 className="font-bold text-lg">{campus.name}</h3>
                  <p className="text-sm text-muted">{campus.city}</p>
                </div>
                {selectedCampus?.id === campus.id && (
                  <span className="text-primary font-bold">Selected</span>
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-muted">
              <p>No campuses found. Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
