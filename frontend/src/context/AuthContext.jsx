import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;

    } catch (error) {
      sessionStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(
    sessionStorage.getItem("token") || null
  );


  const login = (userData, userToken) => {

    sessionStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    sessionStorage.setItem(
      "token",
      userToken
    );

    setUser(userData);
    setToken(userToken);
  };


  const logout = () => {

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  const updateUser = (userData) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };


  useEffect(() => {

    const savedUser = sessionStorage.getItem("user");
    const savedToken = sessionStorage.getItem("token");

    if (savedUser && savedToken) {

      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);

      } catch (error) {

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");

        setUser(null);
        setToken(null);
      }
    }

  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => useContext(AuthContext);
