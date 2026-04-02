import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CampusProvider } from "@/context/CampusContext";

export const metadata = {
  title: "CampusSwap | Student Marketplace",
  description: "Buy, sell, exchange, donate, or rent used items within your college campus.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CampusProvider>
            <div className="app-wrapper flex-col">
              <Navbar />
              <main className="main-content flex-grow" style={{ minHeight: 'calc(100vh - 70px)' }}>
                {children}
              </main>
              {/* Simple Footer directly in layout for now */}
              <footer style={{ backgroundColor: 'var(--surface)', padding: 'var(--space-8) 0', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                <div className="container text-center">
                  <p className="text-muted">© 2026 CampusSwap. Built for students.</p>
                </div>
              </footer>
            </div>
          </CampusProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
