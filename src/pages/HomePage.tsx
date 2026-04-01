import { Link } from "react-router-dom";
import { ShieldCheck, Gauge, Cpu, BarChart3, Users, KeyRound, CheckCircle2 } from "lucide-react";
import PublicNavbar from "@/components/public/PublicNavbar";
import "./HomePage.css";

const pricingPlans = [
  {
    title: "Basic",
    price: "39",
    subtitle: "Pour les petites equipes",
    features: ["Validation API", "Dashboard usage", "Support email"],
  },
  {
    title: "Pro",
    price: "89",
    subtitle: "Pour les SaaS en croissance",
    features: ["Renouvellement automatise", "Audit trail", "Insights IA"],
    highlighted: true,
  },
  {
    title: "Enterprise",
    price: "Sur devis",
    subtitle: "Pour les grandes organisations",
    features: ["SLA dedie", "Multi-tenant avance", "Role-based access"],
  },
];

const appModules = [
  {
    icon: KeyRound,
    title: "Gestion des licences",
    description: "Creation, activation, suspension et suivi du cycle de vie des licences.",
  },
  {
    icon: Users,
    title: "Tenants & utilisateurs",
    description: "Segmentation multi-tenant avec controle des roles admin/client.",
  },
  {
    icon: BarChart3,
    title: "Usage & analytics",
    description: "Suivi des appels API, stockage et performance des clients.",
  },
  {
    icon: Cpu,
    title: "Recommandations IA",
    description: "Insights actionnables pour anticiper renouvellements et upgrades.",
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <PublicNavbar />

      <main>
        <section className="hero-section" id="about">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">Plateforme SaaS de gestion des licences</p>
              <h1>AXESSIA centralise toute la gestion des licences software</h1>
              <p>
                Gere tes clients, licences, renouvellements, limites d&apos;usage et analytics depuis une interface moderne,
                securisee et prete pour la production.
              </p>

              <div className="hero-cta">
                <Link to="/user/login" className="btn btn-solid">
                  Se connecter
                </Link>
                <Link to="/user/register" className="btn btn-ghost hero-secondary">
                  Créer un compte
                </Link>
              </div>

              <ul className="hero-points">
                <li>
                  <CheckCircle2 size={16} /> Gestion complete du cycle de vie des licences
                </li>
                <li>
                  <CheckCircle2 size={16} /> Architecture multi-tenant pour chaque client
                </li>
                <li>
                  <CheckCircle2 size={16} /> Dashboard usage, audit et recommandations IA
                </li>
              </ul>
            </div>

            <aside className="hero-card" aria-label="AXESSIA platform summary">
              <div className="hero-card-head">
                <ShieldCheck size={20} />
                <span>AXESSIA Platform Snapshot</span>
              </div>
              <div className="hero-metrics">
                <article>
                  <h3>99.9%</h3>
                  <p>Disponibilite cible</p>
                </article>
                <article>
                  <h3>24/7</h3>
                  <p>Validation API</p>
                </article>
                <article>
                  <h3>RBAC</h3>
                  <p>Admin / Client</p>
                </article>
                <article>
                  <h3>IA</h3>
                  <p>Insights automatiques</p>
                </article>
              </div>
            </aside>
          </div>
        </section>

        <section className="modules-section" id="features">
          <div className="section-head">
            <p>Fonctionnalites principales</p>
            <h2>Tout ce qu&apos;il faut pour piloter une plateforme de licences</h2>
          </div>

          <div className="module-grid">
            {appModules.map((module) => {
              const Icon = module.icon;
              return (
                <article key={module.title} className="module-card">
                  <span className="module-icon">
                    <Icon size={18} />
                  </span>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="workflow-section">
          <div className="workflow-card">
            <h2>Workflow AXESSIA en 4 etapes</h2>
            <div className="workflow-steps">
              <article>
                <span>1</span>
                <h3>Creation</h3>
                <p>Creer un tenant et ses utilisateurs.</p>
              </article>
              <article>
                <span>2</span>
                <h3>Activation</h3>
                <p>Generer les licences avec plans et limites.</p>
              </article>
              <article>
                <span>3</span>
                <h3>Suivi</h3>
                <p>Analyser usage, audit et signaux IA.</p>
              </article>
              <article>
                <span>4</span>
                <h3>Renewal</h3>
                <p>Traiter les demandes de renouvellement.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="section-head">
            <p>Pricing</p>
            <h2>Des plans adaptes a chaque stade de croissance</h2>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article key={plan.title} className={plan.highlighted ? "price-card highlighted" : "price-card"}>
                <h3>{plan.title}</h3>
                <p className="price-subtitle">{plan.subtitle}</p>
                <p className="price-value">
                  {plan.price === "Sur devis" ? plan.price : `${plan.price} EUR`}<span>{plan.price === "Sur devis" ? "" : "/mois"}</span>
                </p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-card">
            <div>
              <p>Contact</p>
              <h2>Besoin d&apos;une demo AXESSIA pour ton projet?</h2>
              <p className="contact-copy">
                Notre equipe t&apos;accompagne sur l&apos;integration Node.js + React, la modelisation des plans et les bonnes
                pratiques de securite pour la gestion des licences.
              </p>
            </div>
            <div className="contact-actions">
              <a href="mailto:contact@axessia.com" className="btn btn-solid">
                contact@axessia.com
              </a>
              <a href="tel:+21650548028" className="btn btn-ghost">
                +216 50 548 028
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>AXESSIA - License Management Platform</p>
        <p>
          <Gauge size={15} /> React + Node.js + Prisma
        </p>
      </footer>
    </div>
  );
}
