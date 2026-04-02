"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CampusContext = createContext();

export function CampusProvider({ children }) {
  const [selectedCampus, setSelectedCampus] = useState(null);

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
    <CampusContext.Provider value={{ selectedCampus, setSelectedCampus }}>
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  return useContext(CampusContext);
}
