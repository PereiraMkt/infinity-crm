
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
      {/* Mobile Nav Button - Fixed Position */}
      {isMobileView && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all animate-pulse-subtle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      )}

      {/* Sidebar - Responsive */}
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen} 
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <TopNav onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          <ErrorBoundary
            fallback={
              <div className="p-6 bg-destructive/10 rounded-lg">
                <h2 className="text-xl font-bold text-destructive mb-2">
                  Algo deu errado
                </h2>
                <p className="mb-4">
                  Corrigi um erro ao renderizar este componente.
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
    </div>
  );
};

// Add Suspense to be used in the component
const Suspense = React.Suspense;

export default MainLayout;
