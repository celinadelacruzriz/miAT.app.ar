import { useEffect, useState } from "react";
import { getMyPost } from "../services/posts.service";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import { createMercadoPagoPreference } from "../services/payments.service";
import { Wallet } from "@mercadopago/sdk-react";

export default function ViewPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const { data } = await getMyPost();
      setPost(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handlePayment() {
    if (!post?.id) return;
    
    setLoadingPayment(true);
    const { preferenceId, error } = await createMercadoPagoPreference(post.id);
    setLoadingPayment(false);

    if (error) {
      alert("Error al generar el pago. Por favor, intentá más tarde.");
      return;
    }

    if (preferenceId) {
      setPreferenceId(preferenceId);
    }
  }

  if (loading) return <p>Cargando publicación...</p>;

  if (!post) {
    return (
      <div style={{ padding: 24 }}>
        <p>No tenés publicaciones aún.</p>
        <button onClick={() => navigate("/create-post")}>
          Crear publicación
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: "600px", margin: "0 auto" }}>
      <h2>Mi publicación</h2>

      {!post.active && (
        <div style={{ background: "#fff3cd", padding: 12, marginBottom: 16, borderRadius: "8px" }}>
          ⚠️ Publicación pendiente de pago. No es visible para otros usuarios.
        </div>
      )}

      <PostCard post={post} />

      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {!post.active && !preferenceId && (
          <button 
            onClick={handlePayment} 
            disabled={loadingPayment}
            style={{ 
              padding: "12px", 
              backgroundColor: "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: "6px", 
              fontWeight: "bold", 
              cursor: "pointer" 
            }}
          >
            {loadingPayment ? "Generando pago..." : "💳 Pagar publicación"}
          </button>
        )}

        {preferenceId && (
          <div style={{ marginTop: "10px" }}>
            <p style={{ textAlign: "center", fontWeight: "bold" }}>Completá el pago para activar tu aviso:</p>
            <div id="wallet_container">
              <Wallet initialization={{ preferenceId }} />
            </div>
          </div>
        )}

        <button 
          onClick={() => navigate("/edit-post")}
          style={{ 
            padding: "10px", 
            backgroundColor: "transparent", 
            color: "#007bff", 
            border: "1px solid #007bff", 
            borderRadius: "6px", 
            cursor: "pointer" 
          }}
        >
          ✏️ Editar publicación
        </button>
      </div>
    </div>
  );
}
