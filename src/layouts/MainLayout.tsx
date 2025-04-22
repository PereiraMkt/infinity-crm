
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
      
      // Auto-close sidebar on small screens when resizing
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobileView) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobileView]);
  
  // Close sidebar if user clicks outside of it
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // Only apply this on mobile
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  // Define toggleSidebar function
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // Create the sidebar toggle button as a React element
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex dark:bg-gray-900 bg-gray-50 transition-colors duration-300 w-full">
        {/* Sidebar - Responsive */}
        <div id="main-sidebar">
          <Sidebar 
            open={sidebarOpen} 
            setOpen={setSidebarOpen} 
          />
        </div>

        {/* Main content area */}
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
              <Suspense fallback={<div className="p-4">Carregando conteúdo...</div>}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>

        {/* Mobile Navigation - Overlay */}
        {isMobileView && (
          <MobileNav open={sidebarOpen} setOpen={setSidebarOpen} />
        )}
        
        {/* Unified Chat Button */}
        <UnifiedChatButton />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
