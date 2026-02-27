import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./index.css";


const API_BASE_URL = "https://mymangapp-backend-production-d769.up.railway.app";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim() || (mode === "register" && !username.trim())) {
      setError("Rellena todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" ? { email, password } : { email, password, username };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.token || "Error en la autenticación");
        return;
      }

      if (!data.token) {
        setError("No se recibió token del servidor");
        return;
      }

      login(data.token, email);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .manga-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 9999;
          font-family: 'Play', sans-serif, system-ui;
        }

        .manga-card {
          background: #ffffff;
          width: 90%;
          max-width: 440px;
          padding: 2.5rem;
          border: 5px solid #000;
          box-shadow: 12px 12px 0px #e63946;
          position: relative;
          z-index: 10;
        }

        .manga-accent-stripe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: #e63946;
          border-bottom: 5px solid #000;
        }

        .manga-title-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .manga-title {
          font-size: 2.2rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #000;
          margin: 0;
          position: relative;
          z-index: 2;
          text-shadow: 2px 2px 0px #fff, 4px 4px 0px #e63946;
        }

        .manga-subtitle {
          font-size: 0.9rem;
          font-weight: bold;
          color: #000;
          background: #e63946;
          color: #fff;
          padding: 2px 8px;
          border: 2px solid #000;
          transform: rotate(-3deg);
          margin-top: 5px;
        }

        .manga-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 2rem;
          border: 3px solid #000;
          background: #fff;
        }

        .manga-tab {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          font-weight: 800;
          font-size: 1.1rem;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          color: #000;
          font-family: inherit;
        }

        .manga-tab:first-child {
          border-right: 3px solid #000;
        }

        .manga-tab.active {
          background: #000;
          color: #fff;
        }

        .manga-tab:hover:not(.active) {
          background: #f0f0f0;
        }

        .manga-input-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .manga-label {
          display: inline-block;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 8px;
          color: #000;
          font-size: 0.95rem;
          background: #fff;
          padding: 0 4px;
        }

        .manga-input {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-family: inherit;
          font-weight: bold;
          color: #000;
          background: #fff;
          border: 3px solid #000;
          transition: all 0.2s;
          box-sizing: border-box;
          border-radius: 0;
          box-shadow: 4px 4px 0px #ddd;
        }

        .manga-input:focus {
          outline: none;
          border-color: #000;
          box-shadow: 4px 4px 0px #e63946;
          transform: translate(-2px, -2px);
        }

        .manga-error {
          background: #000;
          color: #fff;
          border: 3px solid #e63946;
          padding: 10px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          font-size: 0.9rem;
          transform: rotate(1deg);
        }

        .manga-submit {
          width: 100%;
          padding: 15px;
          background: #e63946;
          color: #fff;
          border: 4px solid #000;
          font-size: 1.3rem;
          font-weight: 900;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 6px 6px 0px #000;
          position: relative;
          overflow: hidden;
        }

        .manga-submit:active {
          box-shadow: 2px 2px 0px #000;
          transform: translate(4px, 4px);
        }

        .manga-submit.loading {
          background: #ccc;
          color: #666;
          cursor: not-allowed;
          box-shadow: 0 0 0 #000;
          transform: translate(6px, 6px);
        }

        .manga-submit:hover:not(.loading):before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: rgba(255,255,255,0.2);
          transform: skewX(-20deg);
          animation: mangaShine 0.5s forwards;
        }

        @keyframes mangaShine {
          100% { left: 200%; }
        }

        .manga-speech-bubble {
          position: absolute;
          top: -45px;
          right: -30px;
          background: #fff;
          border: 4px solid #000;
          padding: 10px 18px;
          font-weight: 900;
          font-size: 1rem;
          box-shadow: -6px 6px 0px #e63946;
          transform: skew(-5deg) rotate(10deg);
          z-index: 15;
          display: none;
          text-transform: uppercase;
        }

        @media (min-width: 600px) {
          .manga-speech-bubble {
            display: block;
          }
        }

        .manga-speech-bubble::before {
          content: 'ゴゴゴ';
          position: absolute;
          top: -30px;
          right: -20px;
          font-size: 30px;
          color: #e63946;
          text-shadow: 2px 2px 0px #000;
          font-family: 'Chokokutai', system-ui;
          transform: rotate(-15deg);
        }

        .manga-speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 10px;
          border-width: 15px 15px 0 0;
          border-style: solid;
          border-color: #000 transparent transparent transparent;
          display: block;
          width: 0;
          transform: rotate(20deg);
        }
      `}</style>

      <div className="manga-overlay">
        <div className="manga-card">
          <div className="manga-accent-stripe"></div>

          <div className="manga-speech-bubble">
            {mode === "login" ? "¡Hola!" : "¡Únete!"}
          </div>

          <div className="manga-title-container">
            <h1 className="manga-title">
              {mode === "login" ? "Iniciar Sesión" : "Registrarse"}
            </h1>
            <span className="manga-subtitle">MANGA.BIBL</span>
          </div>

          <div className="manga-tabs">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`manga-tab ${mode === "login" ? "active" : ""}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`manga-tab ${mode === "register" ? "active" : ""}`}
            >
              Registro
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="manga-input-group">
              <label className="manga-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="manga-input"
                placeholder="shinji@ikari.com"
              />
            </div>

            {mode === "register" && (
              <div className="manga-input-group">
                <label className="manga-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="manga-input"
                  placeholder="Hero123"
                />
              </div>
            )}

            <div className="manga-input-group">
              <label className="manga-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="manga-input"
                placeholder="********"
              />
            </div>

            {error && <div className="manga-error">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`manga-submit ${loading ? "loading" : ""}`}
            >
              {loading ? "Enviando..." : mode === "login" ? "Entrar" : "Registrarse"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}