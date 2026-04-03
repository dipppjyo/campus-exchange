export const mockCampuses = [
  { id: "c1", name: "State University, Main Campus", city: "Metropolis" },
  { id: "c2", name: "Tech Institute of Engineering", city: "Silicon Valley" },
  { id: "c3", name: "City College of Commerce", city: "New York" },
];

export const mockCategories = [
  "Textbooks", "Engineering Tools", "Lab Equipment",
  "Calculators", "Electronics", "Cycles",
  "Hostel Furniture", "Study Notes", "Stationery", "Free Items"
];

export const mockDepartments = [
  "Computer Science", "Civil", "Mechanical", "Electrical", "Architecture", "Business", "Arts"
];

export const mockListings = [
  {
    id: "l1",
    title: "Engineering Mathematics Textbook",
    description: "WhatsApp: +91 98765 43210. Good condition text book, slightly highlighted.",
    price: 25,
    category: "Textbooks",
    department: "Computer Science",
    condition: "used",
    listingType: "sell",
    campus: "c1",
    isUrgent: true,
    seller: { name: "John Doe", id: "u2", rating: 4.5 },
    images: ["https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Textbook"],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "l2",
    title: "Drafting Table & T-Square",
    description: "Telegram: @jane_arch. Full set for architecture drafting. Contains table, T-Square, and set squares.",
    price: 40,
    category: "Engineering Tools",
    department: "Architecture",
    condition: "good",
    listingType: "sell",
    campus: "c1",
    isUrgent: false,
    seller: { name: "Jane Smith", id: "u3", rating: 4.9 },
    images: ["https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Drafting+Tools"],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "l3",
    title: "Casio FX-991EX Scientific Calculator",
    description: "Email: mike.j@gmail.com. Like new Casio calculator, barely used. Perfect for exams.",
    price: 15,
    category: "Calculators",
    department: "Electrical",
    condition: "new",
    listingType: "sell",
    campus: "c1",
    isUrgent: false,
    seller: { name: "Mike Johnson", id: "u4", rating: 3.8 },
    images: ["https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Calculator"],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: "l4",
    title: "First Year CS Notes + Midterm Papers",
    description: "DM on Instagram: @senior_sam. Passing it down to juniors. Very comprehensive notes.",
    price: 0,
    category: "Study Notes",
    department: "Computer Science",
    condition: "used",
    listingType: "donate",
    campus: "c1",
    isUrgent: false,
    seller: { name: "Senior Sam", id: "u5", rating: 5.0 },
    images: ["https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Notes"],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "l5",
    title: "Lab Coat (Medium)",
    description: "Cell: +1 234 567 8900. Needed for chemistry labs. Cleaned and ironed.",
    price: 5,
    rentalPrice: 2,
    rentalPeriod: "semester",
    category: "Lab Equipment",
    department: "Mechanical",
    condition: "good",
    listingType: "rent",
    campus: "c1",
    isUrgent: false,
    seller: { name: "Alice Green", id: "u6", rating: 4.2 },
    images: ["https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Lab+Coat"],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];
