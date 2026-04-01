import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import brandLogo from "@/assets/axessia-logo.png";

const navigationItems = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function PublicNavbar() {
  const { user } = useAuth();

  return (
    <header className="home-header">
      <div className="header-inner">
        <Link to="/" className="brand-home" aria-label="Axessia home logo">
          <div className="brand-logo-rect" role="img" aria-label="Axessia logo">
            <img src={brandLogo} alt="Axessia" className="brand-logo-image" />
          </div>
        </Link>

        <nav className="home-nav" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="auth-actions">
          {user ? (
            <Link className="btn btn-app" to="/app">
              Mon espace
            </Link>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/user/login">
                Se connecter
              </Link>
              <Link className="btn btn-solid" to="/user/register">
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
