import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // ⛔ defensa obligatoria
  if (!profile) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>MiAT</h2>

      <p>
        Bienvenida/o <strong>{profile.name}</strong>
      </p>

      <p>
        Rol: <strong>{profile.role}</strong>
      </p>

      <hr />

      <button onClick={() => navigate("/create-post")}>
        ➕ Crear publicación
      </button>

      <br />
      <br />

      <button onClick={() => navigate("/matches")}>🔍 Ver matches</button>

      <br />
      <br />

      <button onClick={logout}>🚪 Cerrar sesión</button>
    </div>
  );
}
