"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const CampusContext = createContext();

export function CampusProvider({ children }) {
  const { user } = useAuth();
  const [userCampus, setUserCampus] = useState(null);
  const [availableCampuses, setAvailableCampuses] = useState([]);

  // Fetch available campuses from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, "campuses"), orderBy("name", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const camps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailableCampuses(camps);
      }, (err) => {
        console.error("Failed to load campuses from Firestore:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firestore not initialized yet.", e);
    }
  }, []);

  // Automatically set the campus from the logged-in user's profile
  useEffect(() => {
    if (user && user.campus && availableCampuses.length > 0) {
      // user.campus could be an ID (e.g. "c1") or a name (e.g. "State University")
      const match = availableCampuses.find(
        c => c.id === user.campus || c.name === user.campus
      );
      if (match) {
        setUserCampus(match);
      } else {
        // Fallback: create a minimal campus object from the user's profile
        setUserCampus({ id: user.campus, name: user.campus });
      }
    } else if (!user) {
      setUserCampus(null);
    }
  }, [user, availableCampuses]);

  return (
    <CampusContext.Provider value={{ userCampus, availableCampuses }}>
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  return useContext(CampusContext);
}
