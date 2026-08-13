import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ role, children }) {
  const { user } = useAuth();


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "vendor") {
      return <Navigate to="/vendor" replace />;
    }

    if (user.role === "buyer") {
      return <Navigate to="/buyer" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  
  return children;
}

export default RoleRoute;