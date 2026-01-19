import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Matches from "./pages/Matches";
import AuthCallback from "./pages/AuthCallback";
import PaymentSuccess from "./pages/PaymentSuccess";

function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!profile) return <div>Cargando perfil...</div>;

  if (profile.role === null) return <Navigate to="/select-role" replace />;

  return children;
}

export default function AppRouter() {
  const { user, profile } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" replace />}
        />

        <Route
          path="/select-role"
          element={
            user && profile?.role === null ? (
              <SelectRole />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}
