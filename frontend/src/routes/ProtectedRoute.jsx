import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    // Simulate check delay (can be removed if not needed)
    setTimeout(() => {
      if (!token) {
        setIsAuthorized(false);
      } else if (role && userRole !== role) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    }, 100); // Small delay to show smooth transition
  }, [role]);

  if (isLoading) {
    return <div className="loading">Checking authorization...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
