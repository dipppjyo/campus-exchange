"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Mock data for admin
const mockUsers = [
  { id: "u2", name: "John Doe", email: "john@college.edu", status: "Verified", date: "2026-03-15" },
  { id: "u3", name: "Jane Smith", email: "jane@college.edu", status: "Verified", date: "2026-03-10" },
  { id: "u4", name: "Mike Johnson", email: "mike@college.edu", status: "Pending", date: "2026-04-01" },
];

const mockReports = [
  { id: "r1", listingId: "l1", reason: "Inappropriate Content", reportedBy: "Jane Smith", date: "Today" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // In a real app we'd verify user.isAdmin securely on the server
  if (!user || user.name !== "Alex Doe") { 
    // Mocking Alex Doe as admin for demo
    // return (
    //   <div className="container py-16 text-center">
    //     <h2 className="text-2xl font-bold text-danger">Access Denied</h2>
    //     <p className="text-muted">You do not have administrative privileges.</p>
    //   </div>
    // );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="badge badge-primary">Superadmin</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 border-l-4" style={{ borderColor: 'var(--primary)', borderLeftWidth: '4px' }}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Total Users</h3>
          <div className="text-3xl font-bold">1,245</div>
        </div>
        <div className="card p-6 border-l-4" style={{ borderColor: 'var(--secondary)', borderLeftWidth: '4px' }}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Active Listings</h3>
          <div className="text-3xl font-bold">342</div>
        </div>
        <div className="card p-6 border-l-4" style={{ borderColor: 'var(--accent)', borderLeftWidth: '4px' }}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Total Exchanges</h3>
          <div className="text-3xl font-bold">890</div>
        </div>
        <div className="card p-6 border-l-4" style={{ borderColor: 'var(--danger)', borderLeftWidth: '4px' }}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Reports</h3>
          <div className="text-3xl font-bold">12</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Management */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b bg-surface flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-bold">Recent Users</h2>
            <button className="text-sm text-primary">View All</button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-muted text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                <th className="p-4 py-3 font-medium">Name</th>
                <th className="p-4 py-3 font-medium">Email</th>
                <th className="p-4 py-3 font-medium">Status</th>
                <th className="p-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="p-4 py-3 font-medium">{u.name}</td>
                  <td className="p-4 py-3 text-muted text-sm">{u.email}</td>
                  <td className="p-4 py-3">
                    <span className={`badge ${u.status === 'Verified' ? 'badge-secondary' : 'badge-accent'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 py-3">
                    <button className="text-primary text-sm font-bold">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reports / Moderation */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b bg-surface flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-bold">Listing Reports</h2>
            <button className="text-sm text-primary">View All</button>
          </div>
          <div className="p-4">
            {mockReports.map(r => (
              <div key={r.id} className="border rounded-lg p-4 mb-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-danger">⚠️ {r.reason}</span>
                  <span className="text-xs text-muted">{r.date}</span>
                </div>
                <p className="text-sm mb-3">Reported by: {r.reportedBy}</p>
                <div className="flex gap-2">
                  <button className="btn btn-outline py-1 px-3 text-sm">View Listing</button>
                  <button className="btn btn-primary py-1 px-3 text-sm bg-danger border-danger">Remove Listing</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
