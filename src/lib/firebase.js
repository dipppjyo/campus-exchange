import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAoL0-pJbUYAnO62fIvyJYeNyXVVkn-ui0",
  authDomain: "campusswap-28b5b.firebaseapp.com",
  projectId: "campusswap-28b5b",
  storageBucket: "campusswap-28b5b.firebasestorage.app",
  messagingSenderId: "604461258448",
  appId: "1:604461258448:web:c9146dd68bb7c7c5e1b0d5",
  measurementId: "G-5DTN615CYJ"
};

// Initialize Firebase securely (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(console.error);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
