import { useState } from "react";
import { updateUserRole } from "../services/users.service";
import { useAuth } from "../hooks/useAuth";

export default function SelectRole() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSelectRole(role) {
    setLoading(true);
    setError(null);

    const { error } = await updateUserRole(user.id, role);

    if (error) {
      setError("No se pudo guardar el rol. Intentá nuevamente.");
      setLoading(false);
      return;
    }

    // no redirigimos manualmente:
    // useAuth se vuelve a ejecutar y App.jsx cambia la vista
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>¿Cómo vas a usar MiAT?</h2>

      <p>Elegí una opción para continuar</p>

      <button disabled={loading} onClick={() => handleSelectRole("parent")}>
        Soy padre / madre / tutor
      </button>

      <br />
      <br />

      <button disabled={loading} onClick={() => handleSelectRole("at")}>
        Soy Acompañante Terapéutico
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
