"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CampusContext = createContext();

export function CampusProvider({ children }) {
  const [selectedCampus, setSelectedCampus] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selected_campus");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

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
