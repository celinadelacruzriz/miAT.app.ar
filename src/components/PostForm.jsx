import { useState } from "react";
import { supabase } from "../lib/supabase";
import { createPostDraft } from "../services/posts.service";
import { CAFECITO_URL } from "../config/payments";

export default function PostForm({ role }) {
  const [form, setForm] = useState({
    zone: "",
    age_range: "",
    diagnosis: [],
    schedule: [],
    experience_years: "",
    specialty: "",
    intent: "",
    modalidad: "",
    celular: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedPost, setSavedPost] = useState(null); // guardamos post completo con id

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const user = supabase.auth.user();
    if (!user) {
      setError("Debés iniciar sesión para crear una publicación");
      setLoading(false);
      return;
    }

    const { data, error } = await createPostDraft({
      role,
      ...form,
      experience_years: role === "at" ? Number(form.experience_years) : null,
    });

    if (error) {
      setError(error.message || "No se pudo guardar la publicación");
      setLoading(false);
      return;
    }

    setSavedPost(data); // guardamos el post creado con su id
    setLoading(false);
  }

  // función para abrir Cafecito + página de éxito que activa el post
  function handlePay(postId) {
    const cafecitoUrl = `${CAFECITO_URL}?ref=post_${postId}`;
    const successUrl = `${window.location.origin}/payment-success?postId=${postId}`;

    // Abrimos Cafecito en otra pestaña
    window.open(cafecitoUrl, "_blank");

    // Abrimos la página de éxito en otra pestaña
    setTimeout(() => {
      window.open(successUrl, "_blank");
    }, 3000); // 3 segundos para simular que el usuario hizo el pago
  }

  if (savedPost) {
    return (
      <div>
        <p>Publicación guardada.</p>
        <p>Para activarla debés realizar el pago (30 días).</p>

        <button
          onClick={() => handlePay(savedPost.id)}
          style={{ marginTop: 12 }}
        >
          Pagar publicación
        </button>

        <p style={{ marginTop: 12 }}>
          Luego del pago se activará automáticamente la publicación.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        Rol: <strong>{role}</strong>
      </p>

      <input
        placeholder="Zona"
        value={form.zone}
        onChange={(e) => updateField("zone", e.target.value)}
        required
      />

      {role === "parent" && (
        <>
          <input
            placeholder="Edad del niño"
            value={form.age_range}
            onChange={(e) => updateField("age_range", e.target.value)}
          />

          <input
            placeholder="Diagnóstico (separado por coma)"
            onChange={(e) =>
              updateField(
                "diagnosis",
                e.target.value.split(",").map((d) => d.trim()),
              )
            }
          />
        </>
      )}

      {role === "at" && (
        <>
          <input
            type="number"
            placeholder="Años de experiencia"
            value={form.experience_years}
            onChange={(e) => updateField("experience_years", e.target.value)}
          />

          <input
            placeholder="Especialidad"
            value={form.specialty}
            onChange={(e) => updateField("specialty", e.target.value)}
          />
        </>
      )}

      <input
        placeholder="Disponibilidad (ej: lun-mañana)"
        onChange={(e) => updateField("schedule", e.target.value.split(","))}
        required
      />

      <input
        placeholder="Modalidad (domicilio / institucion / ambos)"
        value={form.modalidad}
        onChange={(e) => updateField("modalidad", e.target.value)}
      />

      <input
        placeholder="Celular"
        value={form.celular}
        onChange={(e) => updateField("celular", e.target.value)}
      />

      <textarea
        placeholder="Mensaje"
        value={form.intent}
        onChange={(e) => updateField("intent", e.target.value)}
      />

      <br />

      <button disabled={loading}>
        {loading ? "Guardando..." : "Guardar y continuar"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
