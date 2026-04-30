import { createContext, useContext, useState, useEffect } from "react";

type User = {
  email: string;
  name: string; // Añadimos un nombre para personalizar la UI
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Inicializamos leyendo de localStorage
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("auranova_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Efecto para guardar en localStorage cuando el usuario cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem("auranova_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auranova_user");
    }
  }, [user]);

  const login = (email: string, password: string) => {
    // Simulación (luego será API)
    if (email === "admin@test.com" && password === "123456") {
      setUser({ email, name: "Admin" });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);