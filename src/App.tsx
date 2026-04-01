import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

// Layouts
import AdminLayout from "@/components/layouts/AdminLayout";
import ClientLayout from "@/components/layouts/ClientLayout";

// Pages
import HomePage from "./pages/HomePage";
import UserLoginPage from "@/pages/user/UserLoginPage";
import UserRegisterPage from "@/pages/user/UserRegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import MyLicensePage from "@/pages/client/MyLicensePage";
import UsagePage from "@/pages/client/UsagePage";
import LicensesPage from "@/pages/admin/LicensesPage";
import CreateLicensePage from "@/pages/admin/CreateLicensePage";
import RenewalRequestsPage from "@/pages/admin/RenewalRequestsPage";
import UsersPage from "@/pages/admin/UsersPage";
import LicenseDetailsPage from "@/pages/admin/LicenseDetailsPage";
import TenantsPage from "@/pages/admin/TenantsPage";
import PlansPage from "@/pages/admin/PlansPage";
import FeaturesLimitsPage from "@/pages/admin/FeaturesLimitsPage";
import ValidationApiPage from "@/pages/admin/ValidationApiPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import AuditPage from "@/pages/admin/AuditPage";
import AiRecommendationsPage from "@/pages/admin/AiRecommendationsPage";
import AiInsightsPage from "@/pages/client/AiInsightsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

// UI Components
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "client";
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/user/login" replace />;
  if (role && user.role !== role) {
    // Redirect to appropriate home for their actual role
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/licenses" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/user/register" element={<UserRegisterPage />} />
        <Route path="/login" element={<Navigate to="/user/login" replace />} />
        <Route path="/register" element={<Navigate to="/user/register" replace />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/licenses" replace />} />
          <Route path="licenses" element={<LicensesPage />} />
          <Route path="licenses/create" element={<CreateLicensePage />} />
          <Route path="renewal-requests" element={<RenewalRequestsPage />} />
          <Route path="licenses/:id" element={<LicenseDetailsPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="features-limits" element={<FeaturesLimitsPage />} />
          <Route path="validation-api" element={<ValidationApiPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="ai" element={<AiRecommendationsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Client routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="client">
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="license" element={<MyLicensePage />} />
          <Route path="usage" element={<UsagePage />} />
          <Route path="ai" element={<AiInsightsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Root redirect */}
        <Route
          path="/app"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin/licenses" : "/dashboard"}
                replace
              />
            ) : (
              <Navigate to="/user/login" replace />
            )
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
