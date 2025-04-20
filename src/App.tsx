
import { useEffect, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "@/layouts/MainLayout";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingScreen from '@/components/ui/loading-screen';
import { useThemeManager } from '@/hooks/useThemeManager';

// Lazy-loaded components
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const SalesFunnel = lazy(() => import('@/pages/SalesFunnel'));
const ClientManagement = lazy(() => import('@/pages/ClientManagement'));
const FinanceManagement = lazy(() => import('@/pages/FinanceManagement'));
const ProductsServices = lazy(() => import('@/pages/ProductsServices'));
const LeadImport = lazy(() => import('@/pages/LeadImport'));
const ProductionManagement = lazy(() => import('@/pages/ProductionManagement'));
const TeamManagement = lazy(() => import('@/pages/TeamManagement'));
const Meetings = lazy(() => import('@/pages/Meetings'));
const Settings = lazy(() => import('@/pages/Settings'));
const UserSettings = lazy(() => import('@/pages/UserSettings'));
const WhatsAppIntegration = lazy(() => import('@/pages/WhatsAppIntegration'));
const AdsIntegrationPage = lazy(() => import('@/pages/AdsIntegrationPage'));
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    }
  }
});

const App = () => {
  // Use our theme manager hook
  const { isLoaded } = useThemeManager();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    // Removed StrictMode for easier debugging
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Routes>
              <Route path="/" element={
                <Suspense fallback={<LoadingScreen />}>
                  <Index />
                </Suspense>
              } />
              <Route path="/login" element={
                <Suspense fallback={<LoadingScreen />}>
                  <Login />
                </Suspense>
              } />
              <Route path="/register" element={
                <Suspense fallback={<LoadingScreen />}>
                  <Register />
                </Suspense>
              } />
              
              {/* Protected routes that require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="sales-funnel" element={<SalesFunnel />} />
                  <Route path="clients" element={<ClientManagement />} />
                  <Route path="finance" element={<FinanceManagement />} />
                  <Route path="products" element={<ProductsServices />} />
                  <Route path="lead-import" element={<LeadImport />} />
                  <Route path="production" element={<ProductionManagement />} />
                  <Route path="team" element={<TeamManagement />} />
                  <Route path="meetings" element={<Meetings />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="user-settings" element={<UserSettings />} />
                  <Route path="whatsapp" element={<WhatsAppIntegration />} />
                  <Route path="ads-integration" element={<AdsIntegrationPage />} />
                </Route>
              </Route>
              
              <Route path="*" element={
                <Suspense fallback={<LoadingScreen />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
