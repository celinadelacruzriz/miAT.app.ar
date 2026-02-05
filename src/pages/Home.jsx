import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import { getMyPost } from "../services/posts.service";

export default function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState("");

  useEffect(() => {
    async function loadPost() {
      const { data } = await getMyPost();
      setPost(data);
    }
    loadPost();
  }, []);

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
      {post && !post.active && (
        <div style={{ background: "#fff3cd", padding: 12, marginBottom: 16 }}>
          ⚠️ Tenés una publicación guardada pendiente de pago.
          <br />
          <button onClick={() => navigate("/view-post")}>
            Ver mi publicación
          </button>
        </div>
      )}
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
