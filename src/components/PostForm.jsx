import { useState } from "react";
import { createPostDraft, editPost } from "../services/posts.service";
import { createPreference } from "../services/payments.service";
import { Wallet } from "@mercadopago/sdk-react";
import { MP_PUBLIC_KEY } from "../config/payments";

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
      const { preferenceId, error: prefError } = await createPreference(
        data.id,
      );
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
    <form onSubmit={handleSubmit}>
      <h3>Nueva publicación</h3>

      {/* ZONA */}
      <label>Zona</label>
      <select value={zone} onChange={(e) => setZone(e.target.value)} required>
        <option value="">Seleccionar zona</option>
        {ZONAS.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </select>

      {/* DISPONIBILIDAD */}
      <hr />

      <label>Disponibilidad</label>

      <div style={{ display: "flex", gap: 8 }}>
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="">Día</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select value={shift} onChange={(e) => setShift(e.target.value)}>
          <option value="">Horario</option>
          {SHIFTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button type="button" onClick={addSchedule}>
          Agregar
        </button>
      </div>

      <ul>
        {schedule.map((s) => (
          <li key={s}>
            {s}{" "}
            <button type="button" onClick={() => removeSchedule(s)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <hr />
      {/* CAMPOS FAMILIA */}

      {role === "family" && (
        <>
          <label>Diagnóstico</label>
          {DIAGNOSTICOS.map((d) => (
            <label key={d}>
              <input
                type="checkbox"
                checked={diagnosis.includes(d)}
                onChange={() => toggleDiagnosis(d)}
              />
              {d}
            </label>
          ))}

          <label>Edad del niño/a</label>
          <input
            type="text"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
          />
        </>
      )}
      {/* MODALIDAD */}
      <label>Modalidad de acompañamiento</label>
      <select value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
        <option value="">Seleccionar</option>
        {MODO.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* CAMPOS PROFESIONALES */}
      {role === "at" && (
        <>
          <label>Especialidad</label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />

          <label>Años de experiencia</label>
          <input
            type="number"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
          />
        </>
      )}

      {/* CAMPOS COMUNES */}
      <label>Mensaje</label>
      <textarea value={intent} onChange={(e) => setIntent(e.target.value)} />

      <label>Obra social</label>
      <select
        value={obra_social}
        onChange={(e) => setObraSocial(e.target.value)}
      >
        <option value="">Seleccionar</option>
        {OBRAS_SOCIALES.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <hr />
      <label>Teléfono</label>
      <input
        type="text"
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
      />
      <br />
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <button type="submit">Guardar publicación</button>
    </form>
  );
}
