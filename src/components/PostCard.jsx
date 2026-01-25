import { CAFECITO_URL } from "../config/payments";

export default function PostCard({ post }) {
  if (!post) return null;

  const isExpired =
    post.expires_at && new Date(post.expires_at) < new Date();

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
      }}
    >
      <h3>
        {post.role === "at"
          ? "Acompañante Terapéutico"
          : "Búsqueda de AT"}
      </h3>

      {/* ZONA */}
      <p>
        <strong>Zona:</strong> {post.zone || "No especificada"}
      </p>

      {/* EDAD */}
      {post.age_range && (
        <p>
          <strong>Edad:</strong> {post.age_range}
        </p>
      )}

      {/* DIAGNÓSTICO */}
      {Array.isArray(post.diagnosis) && post.diagnosis.length > 0 && (
        <p>
          <strong>Diagnóstico:</strong>{" "}
          {post.diagnosis.join(", ")}
        </p>
      )}

      {/* EXPERIENCIA */}
      {post.experience_years && (
        <p>
          <strong>Experiencia:</strong>{" "}
          {post.experience_years} años
        </p>
      )}

      {/* ESPECIALIDAD */}
      {post.specialty && (
        <p>
          <strong>Especialidad:</strong> {post.specialty}
        </p>
      )}

      {/* DISPONIBILIDAD */}
      {Array.isArray(post.schedule) && post.schedule.length > 0 && (
        <p>
          <strong>Disponibilidad:</strong>{" "}
          {post.schedule.join(", ")}
        </p>
      )}

      {/* MENSAJE */}
      {post.intent && (
        <p>
          <strong>Mensaje:</strong> {post.intent}
        </p>
      )}

      {/* ESTADO */}
      <p>
        <strong>Estado:</strong>{" "}
        {post.active ? "Activo" : "Pendiente de pago"}
      </p>

      {/* VENCIMIENTO */}
      {post.expires_at && (
        <p>
          <strong>Vence:</strong>{" "}
          {new Date(post.expires_at).toLocaleDateString()}
        </p>
      )}

      {/* RENOVAR / CAFECITO */}
      {(!post.active || isExpired) && (
        <a
          href={`${CAFECITO_URL}?ref=post_${post.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>Renovar publicación (30 días)</button>
        </a>
      )}
    </div>
  );
}
