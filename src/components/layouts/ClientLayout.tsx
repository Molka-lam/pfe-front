import { Sidebar } from "@/components/layouts/Sidebar";
import { CLIENT_MENU } from "@/config/menu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMyLicense } from "@/hooks/useLicense";
import { getLicenseExpirationStatus } from "@/lib/license-utils";
import { useEffect, useRef } from "react";

// Menu items moved to config/menu.ts

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);
  const { data: license } = useMyLicense();

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const expiration = license ? getLicenseExpirationStatus(license.expires_at) : null;

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-50 md:h-dvh md:overflow-hidden">
      <Sidebar 
        sections={CLIENT_MENU}
        user={user ?? undefined}
        onLogout={handleLogout}
        brandName="AVAXIA"
        roleLabel="Espace Client"
        expirationInfo={expiration ? {
          isExpiringSoon: expiration.isExpiringSoon && license?.status === "active",
          daysLeft: expiration.daysLeft,
          hoursLeft: expiration.hoursLeft
        } : undefined}
      />

      <main
        ref={mainRef}
        className="app-scroll min-h-0 flex-1 overflow-visible px-4 pb-4 pt-16 md:overflow-y-auto md:px-8 md:pb-8 md:pt-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
