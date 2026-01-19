import { useEffect, useState } from "react";
import { activatePost } from "../services/posts.service";
import { getMatches } from "../services/matches.service";
import PostCard from "../components/PostCard/";

export default function Matches() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMatches() {
      const { data: myPost } = await activatePost();

      if (!myPost) {
        setError("Necesitás una publicación activa para ver matches.");
        setLoading(false);
        return;
      }

      const { data, error } = await getMatches(myPost);

      if (error) {
        setError("No se pudieron cargar los matches.");
      } else {
        setMatches(data);
      }

      setLoading(false);
    }

    loadMatches();
  }, []);

  if (loading) return <div>Cargando matches...</div>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (matches.length === 0) {
    return <p>No hay matches disponibles en este momento.</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Matches disponibles</h2>

      {matches.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
