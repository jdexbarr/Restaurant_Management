import { createContext, useState, useEffect } from "react";

// Creamos el contexto
export const AuthContext = createContext();

// Componente proveedor (va a envolver toda la app)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);          // Guardar info de usuario
  const [token, setToken] = useState(null);         // Guardar el token
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Saber si está logueado

  useEffect(() => {
    // Cuando recargan la página, revisar si hay token y usuario guardados
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData, tokenData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(tokenData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
