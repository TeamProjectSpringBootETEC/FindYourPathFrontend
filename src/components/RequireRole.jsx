import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireRole({ roleId, children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.roleId !== roleId) {
    return <Navigate to="/" replace />;
  }

  return children;
}