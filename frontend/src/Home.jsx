import "./Home.css";
import { useState } from "react";
import { useAuth } from "./AuthContext";

const API_BASE_URL = "https://mymangapp-backend-production-d769.up.railway.app";

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedManga, setSelectedManga] = useState(null);

  const { token, isAuthenticated } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/manga?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Error al llamar a la API");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeido = async () => {
    if (!selectedManga) return;

    if (!isAuthenticated) {
      alert("Debes iniciar sesión para marcar como leído.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/leidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedManga),
      });

      if (!response.ok) {
        throw new Error("Error al añadir el manga leído");
      }

      alert("Manga añadido a leídos");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error al añadir el manga leído");
    }
  };

  const handleMangaClick = (manga) => {
    setSelectedManga(manga);
  };

  const closeModal = () => {
    setSelectedManga(null);
  };

  return (
    <>
      <main className="page-container">
        <div className="page-inner">
          <div className="grid"></div>

          <form onSubmit={handleSearch}>
            <div className="manga-search-container">
              <div className="sound-effect left">ドキドキ</div>
              <div className="sound-effect right">キラキラ</div>

              <div className="speech-bubble">
                <div className="emphasis-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <input
                  type="text"
                  className="manga-input"
                  placeholder="Encuentra tu manga..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </form>

          <div className="resultados">
            {loading && (
              <p className="loading-text">Buscando mangas...</p>
            )}

            {error && (
              <p className="error-text">Error: {error}</p>
            )}

            <ul className="results-list">
              {results.map((manga, index) => (
                <li
                  key={manga.malId ?? `${manga.title}-${index}`}
                  className="result-item"
                  onClick={() => handleMangaClick(manga)}
                >
                  {manga.imageUrl && (
                    <img
                      src={manga.imageUrl}
                      alt={manga.title}
                      className="manga-image"
                    />
                  )}
                  <div className="manga-info">
                    <h3>{manga.title}</h3>
                    {manga.score && <p>Rating: {manga.score}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {selectedManga && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>

            <div className="modal-body">
              <div className="modal-left">
                {selectedManga.imageUrl && (
                  <img
                    src={selectedManga.imageUrl}
                    alt={selectedManga.title}
                    className="modal-image"
                  />
                )}

                {selectedManga.genres && selectedManga.genres.length > 0 && (
                  <p className="modal-genres">
                    {selectedManga.genres.join(", ")}
                  </p>
                )}
              </div>

              <div className="modal-right">
                <h1 className="modal-title">{selectedManga.title}</h1>

                {selectedManga.synopsis && (
                  <p className="modal-synopsis">{selectedManga.synopsis}</p>
                )}

                <p className="modal-meta">
                  {selectedManga.author && <span>{selectedManga.author}</span>}
                  {selectedManga.author && selectedManga.year && (
                    <span> · </span>
                  )}
                  {selectedManga.year && <span>{selectedManga.year}</span>}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-fav-button" onClick={handleAddLeido}>
                Leído
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
