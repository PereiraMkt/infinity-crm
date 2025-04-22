
import React, { useState, useEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import UnifiedChatButton from "@/components/unified/UnifiedChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import PageTransition from "@/components/ui/page-transition";
import LoadingScreen from "@/components/ui/loading-screen";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    if (isMobileView) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobileView]);

  if (loading) {
    return <LoadingScreen />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Create the sidebar toggle button as a React element
  const sidebarToggleButton = (
    <Button 
      id="sidebar-toggle" 
      variant="ghost" 
      size="icon" 
      className={`transition-all duration-300 ${isMobileView ? 'md:hidden' : ''}`}
      onClick={toggleSidebar}
    >
      <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex dark:bg-gray-900 bg-gray-50 transition-colors duration-300 w-full">
        <Sidebar 
          open={sidebarOpen} 
          setOpen={setSidebarOpen}
        />

        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <TopNav 
            onMenuButtonClick={toggleSidebar}
            isSidebarOpen={sidebarOpen}
            toggleSidebar={sidebarToggleButton}
          />

          <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
            <ErrorBoundary
              fallback={
                <div className="p-6 bg-destructive/10 rounded-lg">
                  <h2 className="text-xl font-bold text-destructive mb-2">
                    Algo deu errado
                  </h2>
                  <p className="mb-4">
                    Ocorreu um erro ao renderizar este componente.
                  </p>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(-1)}
                      className="flex items-center"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      size="sm"
                      variant="default"
                    >
                      Tentar novamente
                    </Button>
                  </div>
                </div>
              }
            >
              <PageTransition />
              <Suspense fallback={<LoadingScreen />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>

        {isMobileView && (
          <MobileNav open={sidebarOpen} setOpen={setSidebarOpen} />
        )}
        
        <UnifiedChatButton />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
