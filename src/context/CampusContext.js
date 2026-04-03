"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const CampusContext = createContext();

export function CampusProvider({ children }) {
  const [selectedCampus, setSelectedCampus] = useState(null);
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

  useEffect(() => {
    const saved = localStorage.getItem("selected_campus");
    if (saved) {
      try {
        setSelectedCampus(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse campus from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCampus) {
      localStorage.setItem("selected_campus", JSON.stringify(selectedCampus));
    }
  }, [selectedCampus]);

  return (
    <CampusContext.Provider value={{ selectedCampus, setSelectedCampus, availableCampuses }}>
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  return useContext(CampusContext);
}
