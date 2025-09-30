import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("username"); // Check session value

  // If authenticated, render the route; else, redirect to login
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
