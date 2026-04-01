import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import avaxiaLogo from "@/assets/axessia-logo.png";
import "./LoginPage.css";

type AuthMode = "login" | "register";

interface LoginPageProps {
  initialMode?: AuthMode;
}

export default function LoginPage({ initialMode = "login" }: LoginPageProps) {
  const brandLogo = avaxiaLogo;
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
    setError("");
  }, [initialMode]);

  const getApiErrorMessage = (err: unknown): string | null => {
    const maybeAxios = err as any;
    return maybeAxios?.response?.data?.error || maybeAxios?.response?.data?.message || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
        });
      }

      // AuthContext.login sets the user, check role from storage
      const stored = localStorage.getItem("accessToken");
      if (stored) {
        // Reload to let App.tsx route correctly after user is set
        navigate("/");
      }
    } catch (err) {
      const apiMessage = getApiErrorMessage(err);
      setError(
        apiMessage ||
          (mode === "login"
            ? "Email ou mot de passe incorrect. Veuillez réessayer."
            : "Inscription impossible. Vérifiez les informations saisies.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="marketing-pane">
        <div className="marketing-overlay" />
        <header className="marketing-header">
          <div className="brand">
            <img src={brandLogo} alt="AVAXIA" />
            <span>AVAXIA</span>
          </div>

          <nav className="marketing-nav" aria-label="Main navigation">
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Pricing</a>
            <a href="#">Contact</a>
          </nav>
        </header>

        <div className="marketing-content">
          <p className="eyebrow">Trusted by modern SaaS teams</p>
          <h1>About the Company</h1>
          <p>
            AVAXIA helps organizations launch secure digital platforms faster
            with reliable licensing, automation, and analytics in one place.
          </p>

          <div className="marketing-illustration" aria-hidden="true">
            <div className="blob blob-one" />
            <div className="blob blob-two" />
            <img src={brandLogo} alt="AVAXIA illustration" />
          </div>
        </div>
      </section>

      <section className="auth-pane">
        <div className="auth-card-shell">
          <div className="auth-card">
            <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={mode === "login" ? "tab active" : "tab"}
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                role="tab"
                aria-selected={mode === "login"}
              >
                Login
              </button>
              <button
                type="button"
                className={mode === "register" ? "tab active" : "tab"}
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                role="tab"
                aria-selected={mode === "register"}
              >
                Register
              </button>
            </div>

            <div key={mode} className="form-transition">
              <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p className="form-subtitle">
                {mode === "login"
                  ? "Log in to access your dashboard."
                  : "Register in seconds and start managing licenses."}
              </p>

              <form onSubmit={handleSubmit} className="auth-form">
                {mode === "register" && (
                  <div className="field-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === "register"}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className="field-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                </div>

                {mode === "register" && (
                  <div className="field-group">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={mode === "register"}
                      autoComplete="new-password"
                    />
                  </div>
                )}

                {error && (
                  <div className="error-box" role="alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      {mode === "login" ? "Login..." : "Register..."}
                    </>
                  ) : mode === "login" ? (
                    "Login"
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>

            <p className="auth-footer">Secure platform access for your team.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
