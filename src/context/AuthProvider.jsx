import { AuthContext } from "./authContext";
import { useAuth as useAuthHook } from "../hooks/useAuth";

export function AuthProvider({ children }) {
  const auth = useAuthHook();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
