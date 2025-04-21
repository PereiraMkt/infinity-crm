
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

// Import custom animations
import '@/styles/animations.css';

// Lazy-loaded components with shorter timeouts for faster loading
const Dashboard = lazy(() => Promise.race([
  import('@/pages/Dashboard'),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
]));
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

// Configure query client with better caching and retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetch on window focus for better performance
      refetchOnReconnect: true,
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
                  <Route index element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Dashboard />
                    </Suspense>
                  } />
                  <Route path="sales-funnel" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <SalesFunnel />
                    </Suspense>
                  } />
                  <Route path="clients" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ClientManagement />
                    </Suspense>
                  } />
                  <Route path="finance" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <FinanceManagement />
                    </Suspense>
                  } />
                  <Route path="products" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProductsServices />
                    </Suspense>
                  } />
                  <Route path="lead-import" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <LeadImport />
                    </Suspense>
                  } />
                  <Route path="production" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <ProductionManagement />
                    </Suspense>
                  } />
                  <Route path="team" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <TeamManagement />
                    </Suspense>
                  } />
                  <Route path="meetings" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Meetings />
                    </Suspense>
                  } />
                  <Route path="settings" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <Settings />
                    </Suspense>
                  } />
                  <Route path="user-settings" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <UserSettings />
                    </Suspense>
                  } />
                  <Route path="whatsapp" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <WhatsAppIntegration />
                    </Suspense>
                  } />
                  <Route path="ads-integration" element={
                    <Suspense fallback={<LoadingScreen />}>
                      <AdsIntegrationPage />
                    </Suspense>
                  } />
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
