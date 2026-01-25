import { useAuth } from "../hooks/useAuth";
import PostForm from "../components/PostForm/";

export default function CreatePost() {
  const { profile } = useAuth();

  if (!profile) return <div>Cargando...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Crear publicación</h2>

      <PostForm role={profile.role} />
    </div>
  );
}
