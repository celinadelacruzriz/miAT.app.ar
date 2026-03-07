import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserProfile } from "../services/users.service";
import { useAuth } from "../context/useAuthContext";

export default function SelectRole() {
  const { user, refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSelectRole(role) {
    if (!user) {
      setError("Usuario no encontrado, por favor reloguea.");
      return;
    }

    setLoading(true);
    setError(null);
    console.log(
      `Attempting to create profile for user ${user.id} with role ${role}`,
    );

    const { data, error } = await createUserProfile(user.id, user.email, role);

    console.log("Create profile response:", { data, error });

    if (error) {
      if (error.code === "23505") {
        setError("Ya tenés un perfil con este rol.");
      } else {
        setError(`No se pudo crear el perfil. Error: ${error.message}`);
      }
      setLoading(false);
      return;
    }

    console.log("Profile created successfully. Forcing profile refresh...");
    // Forzamos al useAuth a que vuelva a buscar los perfiles de la DB
    await refresh();

    console.log("Profiles refreshed. Navigating to /home");
    navigate("/home", { replace: true });
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>¿Cómo vas a usar MiAT?</h2>

      <p>Elegí una opción para continuar (esto creará un nuevo perfil):</p>

      <button disabled={loading} onClick={() => handleSelectRole("patient")}>
        Crear perfil de Padre / Madre / Tutor
      </button>

      <br />
      <br />

      <button disabled={loading} onClick={() => handleSelectRole("at")}>
        Crear perfil de Acompañante Terapéutico
      </button>

      {loading && <p>Creando perfil...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
