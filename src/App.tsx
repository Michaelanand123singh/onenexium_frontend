import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import LoginPage from "./pages/login/page.tsx";
import DashboardPage from "./pages/dashboard/page.tsx";
import ProjectsPage from "./pages/dashboard/projects.tsx";
import CreateProjectPage from "./pages/dashboard/create.tsx";
import TemplatesPage from "./pages/templates/page.tsx";
import ProjectEditorPage from "./pages/project/page.tsx";
import SettingsPage from "./pages/settings/page.tsx";
import ProductsPage from "./pages/products/page.tsx";
import SolutionsPage from "./pages/solutions/page.tsx";
import ResourcesPage from "./pages/resources/page.tsx";
import PricingPage from "./pages/pricing/page.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard-layout.tsx";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Skeleton } from "./components/ui/skeleton.tsx";
import { SignInButton } from "./components/ui/signin.tsx";

function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-full max-w-4xl px-6 space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
          <p className="text-foreground/60 text-lg">Please sign in to continue</p>
          <SignInButton
            signInText="Sign In"
            className="text-white"
            style={{ background: "linear-gradient(135deg, #3D4EF0, #23A0FF)" }}
          />
        </div>
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  );
}

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard layout routes (sidebar) */}
          <Route
            element={
              <AuthGate>
                <DashboardLayout />
              </AuthGate>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/projects" element={<ProjectsPage />} />
            <Route path="/dashboard/create" element={<CreateProjectPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Standalone pages (no sidebar) */}
          <Route path="/project/:projectId" element={<ProjectEditorPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
