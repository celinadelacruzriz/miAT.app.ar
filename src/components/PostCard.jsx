import { CAFECITO_URL } from "../config/payments";

export default function PostCard({ post }) {
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
        {post.role === "at" ? "Acompañante Terapéutico" : "Búsqueda de AT"}
      </h3>

      <p>
        <strong>Zona:</strong> {post.zone}
      </p>

      {post.age_range && (
        <p>
          <strong>Edad:</strong> {post.age_range}
        </p>
      )}

      {post.diagnosis?.length > 0 && (
        <p>
          <strong>Diagnóstico:</strong> {post.diagnosis.join(", ")}
        </p>
      )}

      {post.experience_years && (
        <p>
          <strong>Experiencia:</strong> {post.experience_years} años
        </p>
      )}

      {post.specialty && (
        <p>
          <strong>Especialidad:</strong> {post.specialty}
        </p>
      )}

      <p>
        <strong>Disponibilidad:</strong> {post.schedule.join(", ")}
      </p>

      {post.intent && (
        <p>
          <strong>Mensaje:</strong> {post.intent}
        </p>
      )}

      <p>
        <strong>Estado:</strong> {post.active ? "Activo" : "Pendiente de pago"}
      </p>

      {post.expires_at && (
        <p>
          <strong>Vence:</strong>{" "}
          {new Date(post.expires_at).toLocaleDateString()}
        </p>
      )}
      {(!post.active || new Date(post.expires_at) < new Date()) && (
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
