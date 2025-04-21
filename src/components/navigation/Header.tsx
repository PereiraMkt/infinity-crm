
import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/auth/UserMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const moduleNames: Record<string, string> = {
  "/app": "Dashboard",
  "/app/sales-funnel": "Funil de Vendas",
  "/app/clients": "Clientes",
  "/app/finance": "Financeiro",
  "/app/products": "Produtos/Serviços",
  "/app/lead-import": "Importação de Leads",
  "/app/whatsapp": "Integração WhatsApp",
  "/app/ads-integration": "Integração de Anúncios",
  "/app/production": "Gestão de Produção",
  "/app/team": "Gestão de Equipe",
  "/app/meetings": "Reuniões",
  "/app/settings": "Configurações"
};

interface HeaderProps {
  openSidebar: () => void;
}

const Header = ({ openSidebar }: HeaderProps) => {
  const location = useLocation();
  const [moduleName, setModuleName] = useState("");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Find the most specific path match
    const currentPath = Object.keys(moduleNames)
      .filter(path => location.pathname.startsWith(path))
      .sort((a, b) => b.length - a.length)[0];
    
    setModuleName(currentPath ? moduleNames[currentPath] : "");
  }, [location]);
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={openSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}
        
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{moduleName}</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
