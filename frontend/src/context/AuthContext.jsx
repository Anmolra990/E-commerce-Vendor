import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const SESSION_DURATION = 10 * 60 * 1000;

export function AuthProvider({ children }) {
  const storedUser = localStorage.getItem("user");

  const [user, setUser] = useState(() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionExpiry");
    setUser(null);
    setToken(null);
  };

  const login = (userData, authToken) => {
    const expiryTime = Date.now() + SESSION_DURATION;

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    localStorage.setItem("sessionExpiry", expiryTime.toString());

    setUser(userData);
    setToken(authToken);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const sessionExpiry = Number(localStorage.getItem("sessionExpiry") || 0);

    if (savedUser && savedToken && Date.now() < sessionExpiry) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    } else {
      logout();
    }
  }, []);

  useEffect(() => {
    if (!user || !token) return;

    const timeout = window.setTimeout(() => {
      logout();
      window.location.href = "/login";
    }, SESSION_DURATION);

    return () => window.clearTimeout(timeout);
  }, [user, token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);