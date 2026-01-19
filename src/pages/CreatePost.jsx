import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { activatePost } from "../services/posts.service";
import PostForm from "../components/PostForm/";
import PostCard from "../components/PostCard/";

export default function CreatePost() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    async function loadPost() {
      const { data } = await activatePost();
      setActivePost(data);
      setLoading(false);
    }

    loadPost();
  }, []);

  if (loading) return <div>Cargando publicación...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Mi publicación</h2>

      {activePost ? (
        <PostCard post={activePost} />
      ) : (
        <PostForm role={profile.role} />
      )}
    </div>
  );
}
