import React, { useState, useEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import UnifiedChatButton from "@/components/chat/UnifiedChatButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    if (isMobileView) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobileView]);
  
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMobileView && sidebarOpen) {
        const sidebar = document.getElementById('main-sidebar');
        const toggleButton = document.getElementById('sidebar-toggle');
        
        if (sidebar && 
            !sidebar.contains(e.target as Node) && 
            toggleButton && 
            !toggleButton.contains(e.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMobileView, sidebarOpen]);

  const sidebarToggleButton = (
    <Button 
      id="sidebar-toggle" 
      variant="ghost" 
      size="icon" 
      className="md:hidden" 
      onClick={toggleSidebar}
    >
      <ChevronLeft className={`h-5 w-5 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
    </Button>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex dark:bg-gray-900 bg-gray-50 transition-colors duration-300 w-full">
        <div id="main-sidebar">
          <Sidebar 
            open={sidebarOpen} 
            setOpen={setSidebarOpen} 
          />
        </div>

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
              <Suspense fallback={<LoadingScreen minimal />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>

        {isMobileView && (
          <MobileNav open={sidebarOpen} setOpen={setSidebarOpen} />
        )}
        
        <UnifiedChatButton />

        {isMobileView && (
          <div className={cn(
            "fixed z-40 transition-all duration-300",
            sidebarOpen ? "left-[16.5rem]" : "left-4",
            "top-[calc(100vh-7rem)]"
          )}>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full h-9 w-9 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(130,80,223,0.4)]"
              onClick={() => {
                console.log('Install app clicked');
              }}
              aria-label="Instalar Aplicativo"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </Button>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
