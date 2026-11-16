/**
 * Mock Auth Context for ParkVolt
 * Hashes passwords in the browser using Web Crypto API (SHA-256) for security.
 * Saves authenticated user and user accounts in localStorage.
 */
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Browser-native SHA-256 hash function (BTech viva friendly)
export async function hashPassword(plainTextPassword) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainTextPassword + "parkvolt_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export const AuthProvider = ({ children }) => {
  // Pre-seed demo user if none exists
  useEffect(() => {
    const existingUsers = localStorage.getItem("parkvolt_users");
    if (!existingUsers) {
      hashPassword("password123").then((hashed) => {
        const defaultUsers = [
          {
            id: "user-alex",
            name: "Alex Rivera",
            email: "alex@parkvolt.com",
            phone: "+91 98765 43210",
            passwordHash: hashed,
            vehicleNumber: "DL 01 EV 9876",
            vehicleModel: "Tata Nexon EV Max (40.5 kWh)",
            walletBalance: 1500,
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem("parkvolt_users", JSON.stringify(defaultUsers));
      });
    }
  }, []);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("parkvolt_current_user");
    return saved
      ? JSON.parse(saved)
      : {
          id: "user-alex",
          name: "Alex Rivera",
          email: "alex@parkvolt.com",
          phone: "+91 98765 43210",
          vehicleNumber: "DL 01 EV 9876",
          vehicleModel: "Tata Nexon EV Max (40.5 kWh)",
          walletBalance: 1500
        };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("parkvolt_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("parkvolt_current_user");
    }
  }, [currentUser]);

  // Login handler
  const login = async (email, password) => {
    const users = JSON.parse(localStorage.getItem("parkvolt_users") || "[]");
    const enteredHash = await hashPassword(password);
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === enteredHash
    );

    if (!user) {
      throw new Error("Invalid email or password. (Demo: alex@parkvolt.com / password123)");
    }

    const safeUser = { ...user };
    delete safeUser.passwordHash;
    setCurrentUser(safeUser);
    return safeUser;
  };

  // Register handler
  const register = async ({ name, email, phone, password, vehicleNumber, vehicleModel }) => {
    const users = JSON.parse(localStorage.getItem("parkvolt_users") || "[]");
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      throw new Error("An account with this email already exists. Please log in.");
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      passwordHash,
      vehicleNumber: vehicleNumber.toUpperCase(),
      vehicleModel,
      walletBalance: 500, // Welcome bonus
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("parkvolt_users", JSON.stringify(users));

    const safeUser = { ...newUser };
    delete safeUser.passwordHash;
    setCurrentUser(safeUser);
    return safeUser;
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
  };

  // Update wallet balance
  const updateWalletBalance = (newBalance) => {
    if (!currentUser) return;
    const updated = { ...currentUser, walletBalance: newBalance };
    setCurrentUser(updated);

    // Also update in registered users array
    const users = JSON.parse(localStorage.getItem("parkvolt_users") || "[]");
    const index = users.findIndex((u) => u.id === currentUser.id);
    if (index !== -1) {
      users[index].walletBalance = newBalance;
      localStorage.setItem("parkvolt_users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        register,
        logout,
        updateWalletBalance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
