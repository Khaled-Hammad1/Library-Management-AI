import { useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [id, setID] = useState(null);

  function login(newToken,newRole,newId) {
    setToken(newToken);
    setRole(newRole);
    setID(newId);
  }

  function logout() {
    setToken(null);
    setRole(null);
    setID(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}