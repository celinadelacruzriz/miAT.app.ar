import { useEffect, useState } from "react";
import { getMyPost } from "../services/posts.service";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import { CAFECITO_URL } from "../config/payments";

export default function ViewPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const { data } = await getMyPost();
      setPost(data);
      setLoading(false);
    }
    load();
  }, []);

  function handlePayment(postId) {
    window.open(`${CAFECITO_URL}?ref=post_${postId}`, "_blank");
  }

  if (loading) return <p>Cargando publicación...</p>;

  if (!post) {
    return (
      <>
        <p>No tenés publicaciones aún.</p>
        <button onClick={() => navigate("/create-post")}>
          Crear publicación
        </button>
      </>
    );
  }

  return (
    <>
      <h2>Mi publicación</h2>

      {!post.active && (
        <div style={{ background: "#fff3cd", padding: 12, marginBottom: 16 }}>
          ⚠️ Publicación pendiente de pago. No es visible para otros usuarios.
        </div>
      )}

      <PostCard post={post} />
      <button onClick={() => handlePayment(post.id)}>
        💳 Pagar publicación
      </button>

      <br />
      <button onClick={() => navigate("/edit-post")}>
        ✏️ Editar publicación
      </button>
    </>
  );
}
