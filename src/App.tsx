import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import LoginPage from "./pages/login/page.tsx";
import DashboardPage from "./pages/dashboard/page.tsx";
import TemplatesPage from "./pages/templates/page.tsx";
import ProjectEditorPage from "./pages/project/page.tsx";
import SettingsPage from "./pages/settings/page.tsx";
import ProductsPage from "./pages/products/page.tsx";
import SolutionsPage from "./pages/solutions/page.tsx";
import ResourcesPage from "./pages/resources/page.tsx";
import PricingPage from "./pages/pricing/page.tsx";
import NotFound from "./pages/NotFound.tsx";

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/project/:projectId" element={<ProjectEditorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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
