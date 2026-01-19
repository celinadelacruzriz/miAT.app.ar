import { useState } from "react";
import { loginWithEmail } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleLogin() {
    if (!email) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await loginWithEmail(email);

    if (error) {
      setError("No se pudo enviar el link. Verificá el email.");
    } else {
      setMessage("Te enviamos un link a tu email para ingresar.");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>MiAT</h2>

      <p>Ingresá tu email para continuar</p>

      <input
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin} disabled={loading || message}>
        {loading ? "Enviando..." : "Ingresar"}
      </button>
      {message && (
        <p style={{ color: "green" }}>
          Revisá tu mail y abrí el link para continuar.
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
