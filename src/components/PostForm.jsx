import { useState } from "react";
import { createPostDraft, editPost } from "../services/posts.service";
import { createMercadoPagoPreference } from "../services/payments.service";
import { Wallet } from "@mercadopago/sdk-react";

const ZONAS = [
  "Abasto",
  "Altos de San Lorenzo",
  "Barrio Hipódromo",
  "Barrio Norte",
  "Casco Urbano (Centro)",
  "City Bell",
  "El Mondongo",
  "Gonnet",
  "Los Hornos",
  "Melchor Romero",
  "Meridiano V",
  "Olmos",
  "Ringuelet",
  "Tolosa",
  "Villa Elvira",
  "Villa Elisa",
];

const DIAGNOSTICOS = [
  "ASPERGER",
  "RETRASO MADURATIVO",
  "SINDROME DE DOWN",
  "TEA",
  "TDAH",
  "TGD",
  "OTROS",
];
const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const SHIFTS = ["Mañana", "Tarde", "Noche"];
const OBRAS_SOCIALES = ["IOMA", "OSDE", "OSPE", "OTRA"];
const MODO = [
  { value: "domicilio", label: "Domicilio" },
  { value: "institucion", label: "Institución Educativa" },
  { value: "ambos", label: "Ambos" },
];

export default function PostForm({ role, initialData, isEdit }) {
  const [day, setDay] = useState("");
  const [shift, setShift] = useState("");
  const [zone, setZone] = useState(initialData?.zone ?? "");
  const [schedule, setSchedule] = useState(initialData?.schedule ?? []);
  const [diagnosis, setDiagnosis] = useState(initialData?.diagnosis ?? []);
  const [ageRange, setAgeRange] = useState(initialData?.age_range ?? "");
  const [experienceYears, setExperienceYears] = useState(
    initialData?.experience_years ?? "",
  );
  const [specialty, setSpecialty] = useState(initialData?.specialty ?? "");
  const [intent, setIntent] = useState(initialData?.intent ?? "");
  const [celular, setCelular] = useState(initialData?.celular ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [obra_social, setObraSocial] = useState(initialData?.obra_social ?? "");
  const [modalidad, setModalidad] = useState(initialData?.modalidad ?? "");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);

  function addSchedule() {
    if (!day || !shift) return;

    const value = `${day} ${shift}`;

    setSchedule((prev) => (prev.includes(value) ? prev : [...prev, value]));

    setDay("");
    setShift("");
  }

  function removeSchedule(value) {
    setSchedule((prev) => prev.filter((s) => s !== value));
  }

  function toggleDiagnosis(value) {
    setDiagnosis((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value],
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      role,
      zone,
      schedule,
      diagnosis,
      age_range: ageRange || null,
      experience_years: experienceYears !== "" ? Number(experienceYears) : null,
      specialty: specialty || null,
      intent: intent || null,
      celular: celular || null,
      modalidad: modalidad || null,
      obra_social: obra_social || null,
      email: email || null,
    };

    let result;
    if (isEdit) {
      result = await editPost(initialData.id, payload);
    } else {
      result = await createPostDraft(payload);
    }

    const { data, error } = result;

    if (error) {
      console.error("Error guardando publicación:", error);
      alert("Error al guardar publicación");
      return;
    }

    // Si es edición, quizás no necesitamos cobrar de nuevo, depende de la lógica.
    // Asumiremos que si es nuevo post, cobramos.
    if (!isEdit) {
      setLoadingPayment(true);
      const { preferenceId, error: prefError } =
        await createMercadoPagoPreference(data.id);
      setLoadingPayment(false);

      if (prefError) {
        alert(
          "Publicación guardada, pero hubo un error generando el pago. Intenta más tarde.",
        );
      } else if (preferenceId) {
        setPreferenceId(preferenceId);
      }
    } else {
      alert("Publicación actualizada correctamente.");
    }
  }

  if (preferenceId) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <h3>¡Publicación creada!</h3>
        <p>Para activarla, por favor completá el pago.</p>
        <div id="wallet_container">
          <Wallet initialization={{ preferenceId }} />
        </div>
        <button type="button" disabled={loadingPayment}>
          {loadingPayment ? "Procesando pago..." : "Pagar publicación"}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <h3
          style={{
            marginBottom: "20px",
            color: "#333",
            borderBottom: "2px solid #007bff",
            paddingBottom: "10px",
          }}
        >
          {isEdit ? "Editar publicación" : "Nueva publicación"}
        </h3>

        {/* ZONA */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Zona
          </label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Seleccionar zona</option>
            {ZONAS.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        {/* DISPONIBILIDAD */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Disponibilidad horaria
          </label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Día</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Horario</option>
              {SHIFTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={addSchedule}
              style={{
                padding: "8px 15px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Agregar
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {schedule.map((s) => (
              <span
                key={s}
                style={{
                  backgroundColor: "#e9ecef",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSchedule(s)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc3545",
                    cursor: "pointer",
                    fontWeight: "bold",
                    padding: "0 2px",
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <hr
          style={{ border: "0", borderTop: "1px solid #eee", margin: "20px 0" }}
        />
        {/* CAMPOS FAMILIA */}

        {role === "patient" && (
          <>
            <label>Diagnóstico</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                margin: "10px 0",
              }}
            >
              {DIAGNOSTICOS.map((d) => (
                <label
                  key={d}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={diagnosis.includes(d)}
                    onChange={() => toggleDiagnosis(d)}
                  />
                  {d}
                </label>
              ))}
            </div>

            <label>Edad del niño/a</label>
            <input
              type="text"
              placeholder="Ej: 8 años"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              style={{ width: "100%", padding: "8px", margin: "10px 0" }}
            />
          </>
        )}
        {/* MODALIDAD */}
        <label>Modalidad de acompañamiento</label>
        <select
          value={modalidad}
          onChange={(e) => setModalidad(e.target.value)}
        >
          <option value="">Seleccionar</option>
          {MODO.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* CAMPOS PROFESIONALES */}
        {role === "at" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              margin: "10px 0",
            }}
          >
            <label>Especialidad</label>
            <input
              type="text"
              placeholder="Ej: Estimulación temprana, Autismo..."
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />

            <label>Años de experiencia</label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        )}

        {/* CAMPOS COMUNES */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            margin: "10px 0",
          }}
        >
          <label>Mensaje / Descripción</label>
          <textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Contanos un poco más sobre lo que buscás o lo que ofrecés..."
            style={{ width: "100%", padding: "8px", minHeight: "100px" }}
          />

          <label>Obra social</label>
          <select
            value={obra_social}
            onChange={(e) => setObraSocial(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Seleccionar</option>
            {OBRAS_SOCIALES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>Teléfono de contacto</label>
          <input
            type="text"
            placeholder="Ej: 221 1234567"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Email de contacto</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <br />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Guardar publicación
        </button>
      </form>
    </div>
  );
}
