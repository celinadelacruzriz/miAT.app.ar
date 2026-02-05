import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { activatePost } from "../services/posts.service";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const params = new URLSearchParams(location.search);
  const postId = params.get("postId"); // usamos variable local, no estado

  useEffect(() => {
    if (!postId) return;

    async function handleActivatePost() {
      try {
        const { error } = await activatePost(postId);
        if (error) {
          setError("No se pudo activar la publicación.");
        } else {
          navigate("/view-post", { replace: true });
        }
      } catch (err) {
        if (err instanceof Error) {
          setError("Ocurrió un error: " + err.message);
        } else {
          setError("Ocurrió un error al activar la publicación.");
        }
      }
    }

    handleActivatePost();
  }, [postId, navigate]); // dependencias correctas

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!postId) {
    return <p>No se detectó ningún post. Contactá al soporte.</p>;
  }

  return <p>Confirmando pago del post {postId}...</p>;
}
