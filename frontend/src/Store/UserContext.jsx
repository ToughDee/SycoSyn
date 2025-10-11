import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Guest",
    email: "",
    avatar: "./assets/images/user-prof.webp",
  });

  // Load current user once when app starts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/user/current-user", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        const currentUser = data.data;
        setUser({
          name: currentUser.fullname || "Guest",
          email: currentUser.email || "",
          avatar: currentUser.avatar || "./assets/images/user-prof.webp",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};