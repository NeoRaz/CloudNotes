import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem("access_token"); 

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }

  return children;
};
