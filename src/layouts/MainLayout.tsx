
import { useState, useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/Sidebar";
import UnifiedFloatingAction from "@/components/chat/UnifiedFloatingAction";
import { useThemeManager } from "@/hooks/useThemeManager";
import { ErrorBoundary, ErrorFallback } from "@/components/ui/error-boundary";
import PageTransition from "@/components/ui/page-transition";
import { logError } from "@/lib/error-logging";

// Loading component
const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isLoaded } = useThemeManager();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Only show content when theme is loaded to avoid FOUC (Flash of Unstyled Content)
  if (!isLoaded) {
    return <LoadingFallback />;
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <PageTransition />
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar">
          <ErrorBoundary
            fallback={
              <ErrorFallback 
                error={new Error("Erro ao carregar conteúdo")} 
                resetErrorBoundary={() => window.location.reload()} 
              />
            }
            onError={logError}
          >
            <Suspense fallback={<LoadingFallback />}>
              <div key={location.pathname} className="animate-fade-in">
                <Outlet />
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <UnifiedFloatingAction />
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};

export default MainLayout;
