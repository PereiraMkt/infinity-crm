
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/toaster";
import FloatingActionButton from "@/components/chat/FloatingActionButton";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header openSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      
      <Toaster />
      
      {/* Add floating chat button */}
      <FloatingActionButton />
    </div>
  );
};

export default MainLayout;
