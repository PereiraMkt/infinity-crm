
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/auth/UserMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useLocation } from "react-router-dom";

interface TopNavProps {
  onMenuButtonClick: () => void;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

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

export function TopNav({ onMenuButtonClick, isSidebarOpen, toggleSidebar }: TopNavProps) {
  const { user, profile } = useAuth();
  const location = useLocation();
  
  // Find the most specific path match
  const getCurrentModuleName = () => {
    const currentPath = Object.keys(moduleNames)
      .filter(path => location.pathname.startsWith(path))
      .sort((a, b) => b.length - a.length)[0];
    
    return currentPath ? moduleNames[currentPath] : "";
  };

  return (
    <header className="h-16 px-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            {isSidebarOpen ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            )}
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{getCurrentModuleName()}</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        
        <ThemeToggle />
        
        <UserMenu />
        
        <Link to="/app/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
