import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuthContext";
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Matches from "./pages/Matches";
import AuthCallback from "./pages/AuthCallback";
import PaymentSuccess from "./pages/PaymentSuccess";
import ViewPost from "./pages/ViewPost";
import EditPost from "./pages/EditPost";
import MainLayout from "./layouts/MainLayout";

function ProtectedRoute({ children }) {
  const { user, activeProfile, loading, profiles } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está logueado pero no tiene NINGÚN perfil,
  // lo mandamos a crear el primero.
  if (profiles.length === 0) {
    return <Navigate to="/select-role" replace />;
  }
  
  // Si tiene perfiles pero por alguna razón no hay uno activo,
  // podría redirigirse a una página para seleccionar perfil.
  // Por ahora, lo mandamos a /select-role también.
  if (!activeProfile) {
    return <Navigate to="/select-role" replace />;
  }

  return children;
}

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando app...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/home" replace />}
        />

        <Route
          path="/select-role"
          element={user ? <SelectRole /> : <Navigate to="/login" replace />}
        />

        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Rutas protegidas con layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/view-post" element={<ViewPost />} />
          <Route path="/my-post" element={<ViewPost />} />
          <Route path="/edit-post" element={<EditPost />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
