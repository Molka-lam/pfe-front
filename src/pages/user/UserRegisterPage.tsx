import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import brandLogo from "@/assets/axessia-logo.png";
import "./UserAuth.css";

export default function UserRegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [name, companyName, email, password, confirmPassword]);

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

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name,
        companyName: companyName || undefined,
        email,
        password,
      });
      navigate("/app", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err) || "Inscription impossible. Vérifie les informations saisies.");
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
          <h1>Créer un compte</h1>
          <p>Crée ton compte Axessia pour piloter les licences, les renouvellements et les analyses de ton SaaS.</p>
        </header>

        <form className="user-auth-form" onSubmit={handleSubmit}>
          <div className="user-auth-field">
            <label htmlFor="name">Nom complet</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              autoComplete="name"
              required
            />
          </div>

          <div className="user-auth-field">
            <label htmlFor="company">Entreprise (optionnel)</label>
            <input
              id="company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nom de votre entreprise"
              autoComplete="organization"
            />
          </div>

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
              autoComplete="new-password"
              required
            />
          </div>

          <div className="user-auth-field">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
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
                <Loader2 size={16} className="spin" /> Création...
              </>
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>

        <footer className="user-auth-footer">
          <span>Tu as déjà un compte ?</span>
          <Link to="/user/login">Se connecter</Link>
        </footer>

        <Link className="user-auth-back" to="/">
          Retour a l'accueil
        </Link>
      </section>
    </div>
  );
}
