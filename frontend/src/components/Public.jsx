// src/components/PublicRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/auth/check", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(data.isAuthenticated);
        setLoading(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  if (isLoggedIn) return <Navigate to="/gallery" replace />;

  return children;
};

export default PublicRoute;