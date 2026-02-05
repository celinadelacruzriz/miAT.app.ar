import { useEffect, useState } from "react";
import { getMyPost } from "../services/posts.service";
import PostForm from "../components/PostForm";

export default function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await getMyPost();
      setPost(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (!post) return <p>No hay publicación para editar</p>;

  return (
    <>
      <h2>Editar publicación</h2>
      <PostForm initialData={post} isEdit />
    </>
  );
}
