import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import "./Leidos.css";

const API_BASE_URL = "https://mymangapp-backend-production-d769.up.railway.app";

export default function Leidos() {
  const [leidos, setLeidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const fetchLeidos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/leidos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los mangas leídos");
      }

      const data = await response.json();
      setLeidos(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeidos();
  }, []);

  const handleRemove = async (malId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leidos/${malId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("Error al eliminar el manga leído");
      }

      setLeidos((prev) => prev.filter((manga) => manga.malId !== malId));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el manga leído");
    }
  };

  return (
    <div className="leidos-container">
      <h2 style={{ color: "red" }}>MANGAS LEÍDOS</h2>
      {loading && <p>Cargando mangas leídos...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && leidos.length === 0 && (
        <p style={{ color: "white", marginTop: "30px" }}>
          Upss... todavía no has leído nada
        </p>
      )}

      <ul className="leidos-list">
        {leidos.map((manga) => (
          <li key={manga.malId} className="leido-item">
            {manga.imageUrl && (
              <img
                src={manga.imageUrl}
                alt={manga.title}
                className="manga-image"
              />
            )}
            <div className="leido-info">
              <h3>{manga.title}</h3>
              <button
                className="button"
                onClick={() => handleRemove(manga.malId)}
              >
                <svg viewBox="0 0 448 512" className="svgIcon">
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
