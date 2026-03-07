import { useAuth } from "../context/useAuthContext";
import PostForm from "../components/PostForm";

export default function CreatePost() {
  const { activeProfile, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!activeProfile) return <div>No se encontró un perfil activo.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Crear publicación</h2>

      <PostForm role={activeProfile.type} />
    </div>
  );
}
