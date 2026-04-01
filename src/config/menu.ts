import { 
  Home, 
  Building2, 
  Key, 
  Layers, 
  Gauge, 
  ShieldCheck, 
  BarChart3, 
  BrainCircuit, 
  ScrollText, 
  Users, 
  Settings, 
  CreditCard,
  Bell,
  LucideIcon
} from "lucide-react";

export interface MenuItem {
  label: string;
  to?: string;
  icon: LucideIcon;
  items?: { label: string; to: string }[];
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export const ADMIN_MENU: MenuSection[] = [
  {
    items: [
      { label: "Tableau de bord", to: "/admin/analytics", icon: Home },
    ]
  },
  {
    title: "Gestion",
    items: [
      { label: "Clients (Tenants)", to: "/admin/tenants", icon: Building2 },
      { label: "Utilisateurs", to: "/admin/users", icon: Users },
    ]
  },
  {
    title: "Licences",
    items: [
      { 
        label: "Licences", 
        icon: Key,
        items: [
          { label: "Toutes les licences", to: "/admin/licenses" },
          { label: "Nouvelle licence", to: "/admin/licenses/create" },
        ]
      },
      { label: "Demandes", to: "/admin/renewal-requests", icon: Bell },
      { label: "Plans", to: "/admin/plans", icon: Layers },
      { label: "Features & Limites", to: "/admin/features-limits", icon: Gauge },
    ]
  },
  {
    title: "Système",
    items: [
      { label: "Logs d'audit", to: "/admin/audit", icon: ScrollText },
      { label: "IA Insights", icon: BrainCircuit, to: "/admin/ai" },
      { label: "Paramètres", to: "/admin/settings", icon: Settings },
    ]
  }
];

export const CLIENT_MENU: MenuSection[] = [
  {
    items: [
      { label: "Tableau de bord", to: "/dashboard", icon: Home },
    ]
  },
  {
    title: "Ma Licence",
    items: [
      { label: "Ma Licence", to: "/dashboard/license", icon: CreditCard },
      { label: "Consommation", to: "/dashboard/usage", icon: BarChart3 },
    ]
  },
  {
    title: "Services",
    items: [
      { label: "IA & Recommandations", to: "/dashboard/ai", icon: BrainCircuit },
    ]
  },
  {
    title: "Compte",
    items: [
      { label: "Paramètres", to: "/dashboard/settings", icon: Settings },
    ]
  }
];
