
import { Bell } from "lucide-react";
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
export function TopNav({
  onMenuButtonClick,
  isSidebarOpen,
  toggleSidebar
}: TopNavProps) {
  const {
    user,
    profile
  } = useAuth();
  const location = useLocation();

  // Find the most specific path match
  const getCurrentModuleName = () => {
    const currentPath = Object.keys(moduleNames).filter(path => location.pathname.startsWith(path)).sort((a, b) => b.length - a.length)[0];
    return currentPath ? moduleNames[currentPath] : "";
  };
  return <header className="h-16 px-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {toggleSidebar}
        
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
      </div>
    </header>;
}
