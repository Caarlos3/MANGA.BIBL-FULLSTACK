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
    <div className="modal-overlay">
      <div className="modal-content auth-container">
        <h1 className="modal-title auth-title" style={{ fontFamily: "Play, sans-serif" }}>
          {mode === "login" ? "Iniciar Sesión" : "Registrarse"}
        </h1>

        <div className="auth-mode-buttons">
          <button
            onClick={() => setMode("login")}
            className={`modal-fav-button auth-mode-button ${mode === "login" ? "active" : ""}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`modal-fav-button auth-mode-button ${mode === "register" ? "active" : ""}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ fontFamily: "Play, sans-serif" }}>
          <div className="auth-input-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          {mode === "register" && (
            <div className="auth-input-group">
              <label className="auth-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
              />
            </div>
          )}

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`modal-fav-button auth-submit ${loading ? "loading" : ""}`}
          >
            {loading ? "Enviando..." : mode === "login" ? "Entrar" : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}