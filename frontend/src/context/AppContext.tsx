import React, { createContext, useContext, useState, useEffect } from "react";
import { Doctor, Patient, getDoctor, getPatients, saveDoctor, clearDoctor, initializeDemoData } from "@/services/storage";

interface AppContextType {
  doctor: Doctor | null;
  patients: Patient[];
  isDarkMode: boolean;
  isAuthenticated: boolean;
  login: (doctor: Doctor) => void;
  logout: () => void;
  toggleTheme: () => void;
  refreshPatients: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize app
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Load doctor from localStorage
    const savedDoctor = getDoctor();
    if (savedDoctor) {
      setDoctor(savedDoctor);
    }

    // Initialize demo data
    initializeDemoData();
    
    // Load patients
    setPatients(getPatients());
  }, []);

  const login = (newDoctor: Doctor) => {
    setDoctor(newDoctor);
    saveDoctor(newDoctor);
  };

  const logout = () => {
    setDoctor(null);
    clearDoctor();
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  const refreshPatients = () => {
    setPatients(getPatients());
  };

  return (
    <AppContext.Provider
      value={{
        doctor,
        patients,
        isDarkMode,
        isAuthenticated: !!doctor,
        login,
        logout,
        toggleTheme,
        refreshPatients,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
