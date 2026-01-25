import { useState } from "react";
import { createPostDraft } from "../services/posts.service";

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

export default function PostForm({ role }) {
  const [zone, setZone] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [day, setDay] = useState("");
  const [shift, setShift] = useState("");
  const [diagnosis, setDiagnosis] = useState([]);
  const [ageRange, setAgeRange] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [intent, setIntent] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [obraSocial, setObraSocial] = useState("");
 const [loading, setLoading] = useState(false);

 function addSchedule() {
  if (!day || !shift) return;

  const value = `${day} ${shift}`;

  setSchedule((prev) =>
    prev.includes(value) ? prev : [...prev, value]
  );

  setDay("");
  setShift("");
}

function removeSchedule(value) {
  setSchedule((prev) => prev.filter((s) => s !== value));
}


function toggleDiagnosis(value) {
    setDiagnosis((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await createPostDraft({
      role,
      zone,
      schedule,   
      diagnosis,
      age_range: ageRange,
      experience_years: experienceYears,
      specialty,
      intent,
      celular,
      modalidad: obraSocial,
      email,
    });

    if (error) {
      console.error("Error guardando publicación:", error);
      alert("Error al guardar publicación");
    } else {
      alert("Publicación guardada. Pendiente de pago.");
    }
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
      <input
        type="text"
        value={obraSocial}
        onChange={(e) => setObraSocial(e.target.value)}
      />

      <label>Teléfono</label>
      <input
        type="text"
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
      />

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Guardar publicación</button>
    </form>
  );
}
