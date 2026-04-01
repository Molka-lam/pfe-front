import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  Menu as MenuIcon,
  X,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import avaxiaLogo from "@/assets/avaxia-logo.svg";
import { MenuSection, MenuItem as MenuItemType } from "@/config/menu";

interface SidebarProps {
  sections: MenuSection[];
  user?: { name?: string; email?: string; role?: string };
  onLogout: () => void;
  brandName?: string;
  roleLabel?: string;
  expirationInfo?: {
    isExpiringSoon: boolean;
    daysLeft: number;
    hoursLeft: number;
  };
}

export function Sidebar({
  sections,
  user,
  onLogout,
  brandName = "AVAXIA",
  roleLabel,
  expirationInfo,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={toggleMobile}
        />
      )}

      <button
        onClick={toggleMobile}
        className="fixed left-4 top-4 z-50 rounded-lg border border-slate-700 bg-slate-900 p-2 text-white shadow-lg md:hidden"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-dvh min-h-0 flex-col border-r border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-slate-100 shadow-xl transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:relative md:translate-x-0"
        )}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-800/80 px-4">
          <div
            className={cn(
              "flex items-center gap-3 overflow-hidden transition-all duration-300",
              isCollapsed ? "invisible w-0 opacity-0" : "visible w-auto opacity-100"
            )}
          >
            <img
              src={avaxiaLogo}
              alt="Logo"
              className="h-9 w-9 shrink-0 rounded-lg border border-slate-700/70 bg-slate-900/70 p-1 object-contain"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight text-white">{brandName}</p>
              {roleLabel && (
                <p className="truncate text-[10px] uppercase tracking-wider text-slate-400">{roleLabel}</p>
              )}
            </div>
          </div>

          {isCollapsed && (
            <img
              src={avaxiaLogo}
              alt="Logo"
              className="mx-auto h-9 w-9 rounded-lg border border-slate-700/70 bg-slate-900/70 p-1 object-contain transition-all duration-300"
            />
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="absolute right-2 top-6 z-10 hidden h-8 w-8 rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-md hover:bg-slate-800 hover:text-white md:flex"
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>

        <nav className="app-scroll min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && section.title && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <SidebarItem
                    key={itemIdx}
                    item={item}
                    isCollapsed={isCollapsed}
                    activePath={location.pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-800/80 bg-slate-950/85 p-3 backdrop-blur-sm">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-800/60 p-2 transition-all duration-300",
              isCollapsed ? "justify-center px-0" : "px-3"
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                    Session active
                  </p>
                </div>
                <p className="truncate text-xs font-semibold text-white">{user?.name}</p>
                <p className="truncate text-[10px] text-slate-400">{user?.email}</p>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-9 w-9 shrink-0 rounded-lg border border-slate-700/60 text-slate-300 transition-colors hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
              title="Déconnexion"
            >
              <X className="h-4 w-4 shrink-0" />
            </Button>
          </div>

          {!isCollapsed && expirationInfo?.isExpiringSoon && (
            <div className="mb-1 mt-3 rounded-xl border border-orange-500/20 bg-orange-500/10 p-3">
              <div className="flex items-center gap-2 text-orange-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Alerte licence</span>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-300">
                Votre licence expire dans
                <span className="font-bold text-orange-400"> {expirationInfo.daysLeft}j {expirationInfo.hoursLeft}h</span>.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/license")}
                className="mt-2 h-7 border-none bg-orange-500 text-[10px] font-bold text-white hover:bg-orange-600"
              >
                Renouveler
              </Button>
            </div>
          )}

          {isCollapsed && expirationInfo?.isExpiringSoon && (
            <div className="mb-1 mt-3 flex justify-center">
              <button
                onClick={() => navigate("/dashboard/license")}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/20"
                title={`Expire dans ${expirationInfo.daysLeft}j ${expirationInfo.hoursLeft}h`}
              >
                <AlertTriangle className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarItem({
  item,
  isCollapsed,
  activePath,
}: {
  item: MenuItemType;
  isCollapsed: boolean;
  activePath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;
  const hasSubItems = item.items && item.items.length > 0;

  useEffect(() => {
    if (hasSubItems && item.items?.some((sub) => activePath === sub.to)) {
      setIsOpen(true);
    }
  }, [activePath, hasSubItems, item.items]);

  const isActive = item.to
    ? activePath === item.to
    : item.items?.some((sub) => activePath === sub.to);

  if (hasSubItems && !isCollapsed) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-blue-500/15 text-blue-300"
              : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
        </button>

        {isOpen && (
          <div className="ml-5 mt-1 space-y-1 border-l border-slate-800 pl-4">
            {item.items?.map((sub, idx) => (
              <NavLink
                key={idx}
                to={sub.to}
                className={({ isActive: isSubActive }) =>
                  cn(
                    "block rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                    isSubActive
                      ? "bg-blue-500/10 text-blue-300"
                      : "text-slate-500 hover:bg-slate-800/60 hover:text-white"
                  )
                }
              >
                {sub.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to || "#"}
      className={({ isActive: isLinkActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isLinkActive
            ? "bg-blue-500/20 text-blue-200 shadow-lg shadow-blue-900/20"
            : "text-slate-400 hover:bg-slate-800/80 hover:text-white",
          isCollapsed ? "justify-center px-0" : ""
        )
      }
      title={isCollapsed ? item.label : ""}
    >
      <Icon className={cn("h-4 w-4 shrink-0", isCollapsed ? "h-5 w-5" : "")} />
      {!isCollapsed && <span className="truncate">{item.label}</span>}

      {isCollapsed && (
        <div className="pointer-events-none absolute left-full z-[100] ml-3 hidden whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white shadow-xl group-hover:block">
          {item.label}
        </div>
      )}
    </NavLink>
  );
}
