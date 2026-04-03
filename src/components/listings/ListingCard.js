import Link from "next/link";

export default function ListingCard({ listing }) {
  // Determine badge color based on listing type
  let badgeClass = "badge-primary";
  if (listing.listingType === "donate") badgeClass = "badge-secondary";
  if (listing.listingType === "rent") badgeClass = "badge-accent";
  if (listing.isUrgent) badgeClass = "badge-danger";

  return (
    <Link href={`/listing/${listing.id}`} className="card flex-col">
      <div style={{ position: "relative", height: "200px", width: "100%", backgroundColor: "var(--border)", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={listing.images?.[0] || "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=No+Image"} 
          alt={listing.title} 
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Image+Not+Found";
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
          {listing.isUrgent && <span className="badge badge-danger">Urgent Sale</span>}
          <span className={`badge ${badgeClass}`} style={{ textTransform: 'capitalize' }}>
            {listing.listingType}
          </span>
        </div>
      </div>
      
      <div className="flex-col justify-between flex-grow" style={{ padding: "var(--space-4)" }}>
        <div>
          <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-2)" }}>
            <span className="text-muted text-sm font-bold">{listing.department}</span>
            <span className="text-muted text-sm capitalize">{listing.condition} condition</span>
          </div>
          <h3 className="text-lg font-bold" style={{ marginBottom: "var(--space-2)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {listing.title}
          </h3>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xl font-bold bg-clip-text text-transparent" style={{ color: "var(--primary)" }}>
            {listing.price === 0 ? "FREE" : `₹${listing.price}`}
            {listing.listingType === "rent" && <span className="text-sm text-muted">/{listing.rentalPeriod}</span>}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>👤 {listing.sellerName?.split(' ')[0] || "User"}</span>
            <span>⭐ {listing.sellerRating || 5.0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
