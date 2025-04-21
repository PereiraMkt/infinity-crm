
import React, { useState, useEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import UnifiedFloatingAction from "@/components/chat/UnifiedFloatingAction";
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
      if (mobile && sidebarOpen) setSidebarOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    if (isMobileView) setSidebarOpen(false);
  }, [location.pathname, isMobileView]);

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex dark:bg-gray-900 bg-gray-50 transition-colors duration-300 w-full">
        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
          <div className="h-full overflow-y-auto no-scrollbar">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          </div>
        </aside>
        <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Fixed Top Nav */}
          <TopNav onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-0 z-30 w-full bg-background/80 backdrop-blur-sm shadow-sm border-b" />
          <main className="flex-1 overflow-auto bg-background p-4 md:p-6 mt-16">
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
        {isMobileView && <MobileNav open={sidebarOpen} setOpen={setSidebarOpen} />}
        {/* Floating Chat Button */}
        <UnifiedFloatingAction />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
