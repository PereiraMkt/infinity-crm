
import { Bell, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

interface TopNavProps {
  onMenuButtonClick: () => void;
  className?: string;
}

export function TopNav({ onMenuButtonClick, className }: TopNavProps) {
  const { user, profile } = useAuth();
  const location = useLocation();

  // Mostra o nome do módulo no topo (ex: "Produção", "Clientes" etc)
  const getModuleName = () => {
    const path = location.pathname;
    if (path.startsWith("/app/production")) return "Produção";
    if (path.startsWith("/app/clients")) return "Clientes";
    if (path.startsWith("/app/sales-funnel")) return "Funil de Vendas";
    if (path.startsWith("/app/dashboard")) return "Dashboard";
    // ... pode adicionar mais se quiser
    return "Sistema";
  };

  return (
    <header className={`h-16 px-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between sticky top-0 z-30 ${className || ''}`}>
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuButtonClick}
          className="md:hidden"
        >
          <span className="sr-only">Menu</span>
        </Button>
        <div className="ml-2">
          <h1 className="text-xl font-semibold">{getModuleName()}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <Link to="/app/user-settings">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 relative">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="User avatar"
                className="rounded-full"
              />
            ) : (
              <UserCircle className="h-5 w-5" />
            )}
          </Button>
        </Link>
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
