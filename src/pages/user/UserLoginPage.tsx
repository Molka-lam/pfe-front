import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import brandLogo from "@/assets/axessia-logo.png";
import "./UserAuth.css";

export default function UserLoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [email, password]);

  if (user) {
    return <Navigate to="/app" replace />;
  }

  const getApiErrorMessage = (err: unknown): string | null => {
    const maybeAxios = err as any;
    return maybeAxios?.response?.data?.error || maybeAxios?.response?.data?.message || null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err) || "Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-auth-page">
      <section className="user-auth-card">
        <Link className="user-auth-brand" to="/">
          <img src={brandLogo} alt="Axessia" />
          <span>AXESSIA</span>
        </Link>

        <header className="user-auth-head">
          <h1>Se connecter</h1>
          <p>Connecte-toi a ton espace Axessia pour gerer tes licences et suivre ton usage en temps reel.</p>
        </header>

        <form className="user-auth-form" onSubmit={handleSubmit}>
          <div className="user-auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="user-auth-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="user-auth-error" role="alert">
              <AlertCircle size={16} /> {error}
            </p>
          )}

          <button type="submit" className="user-auth-submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={16} className="spin" /> Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <footer className="user-auth-footer">
          <span>Pas encore de compte ?</span>
          <Link to="/user/register">Créer un compte</Link>
        </footer>

        <Link className="user-auth-back" to="/">
          Retour a l'accueil
        </Link>
      </section>
    </div>
  );
}
