import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Sync with localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user-login");
    if (stored === "true") {
      setIsLoggedIn(true);
    } else {
      navigate("/");
    }
  }, []);

  const login = () => {
    localStorage.setItem("user-login", "true");
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.setItem("user-login", "false");
    setIsLoggedIn(false);
    window.location.href = "/"; // Redirect to home page after logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
