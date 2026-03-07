import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuthContext";
import { logout } from "../services/auth";

const ROLE_LABELS = {
  at: "Acompañante Terapéutico",
  patient: "Padre / Madre / Tutor",
};

export default function Header() {
  const { profiles, activeProfile, switchProfile } = useAuth();
  const navigate = useNavigate();

  // Obtenemos perfiles únicos por tipo para evitar duplicados en el selector
  const uniqueProfiles = profiles.reduce((acc, current) => {
    const x = acc.find((item) => item.type === current.type);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  // Determinamos qué rol falta por crear
  const hasAt = profiles.some((p) => p.type === "at");
  const hasPatient = profiles.some((p) => p.type === "patient");

  return (
    <header
      style={{
        borderBottom: "1px solid #ddd",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <Link
          to="/home"
          style={{
            fontWeight: "bold",
            fontSize: "1.4rem",
            textDecoration: "none",
            color: "#007bff",
          }}
        >
          MiAT
        </Link>

        <nav style={{ display: "flex", gap: "20px" }}>
          <button
            onClick={() => navigate("/home")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#333",
              fontSize: "1rem",
            }}
          >
            Inicio
          </button>
          <button
            onClick={() => navigate("/create-post")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#333",
              fontSize: "1rem",
            }}
          >
            Publicar
          </button>
          <button
            onClick={() => navigate("/matches")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#333",
              fontSize: "1rem",
            }}
          >
            Matches
          </button>
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Selector de perfil: Solo mostramos perfiles únicos por tipo */}
        {uniqueProfiles.length > 1 && (
          <select
            value={activeProfile?.id}
            onChange={(e) => switchProfile(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            {uniqueProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                Ver como: {ROLE_LABELS[p.type]}
              </option>
            ))}
          </select>
        )}

        {/* Mostrar el rol actual si solo hay uno */}
        {uniqueProfiles.length === 1 && (
          <span style={{ fontSize: "0.95rem", color: "#444" }}>
            Rol:{" "}
            <strong style={{ color: "#007bff" }}>
              {ROLE_LABELS[activeProfile?.type]}
            </strong>
          </span>
        )}

        {/* Botón para añadir el rol que falta */}
        {!hasAt || !hasPatient ? (
          <button
            onClick={() => navigate("/select-role")}
            style={{
              padding: "6px 12px",
              fontSize: "0.85rem",
              cursor: "pointer",
              borderRadius: "6px",
              border: "1px solid #007bff",
              color: "#007bff",
              backgroundColor: "transparent",
            }}
          >
            + Añadir perfil de {!hasAt ? "AT" : "Padre/Madre"}
          </button>
        ) : null}

        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}
