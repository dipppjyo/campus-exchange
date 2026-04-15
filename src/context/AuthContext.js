"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout: always unblock rendering after 3 seconds
    const safetyTimer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) console.warn("Auth loading timed out, rendering app without user profile.");
        return false;
      });
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch additional data from Firestore with a timeout
          let userData = {};
          try {
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Firestore fetch timed out")), 5000)
            );
            const userDoc = await Promise.race([
              getDoc(doc(db, "users", firebaseUser.uid)),
              timeoutPromise
            ]);
            userData = userDoc.exists() ? userDoc.data() : {};
          } catch (e) {
            console.warn("Could not fetch user profile from Firestore:", e.message);
          }

          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || userData.name || "Campus Student",
            email: firebaseUser.email,
            campus: userData.campus || "State University",
            department: userData.department || "General",
            rating: userData.rating || { average: 5.0, count: 0 },
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Auth state change error:", e);
        setUser(null);
      } finally {
        clearTimeout(safetyTimer);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password, name, campus, department, year) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name: name || "Campus Student",
        email,
        campus: campus || "State University",
        department: department || "General",
        year: year || "1st Year",
        joinedAt: serverTimestamp(),
        rating: { average: 5.0, count: 0 },
        exchanges: 0
      });

      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
