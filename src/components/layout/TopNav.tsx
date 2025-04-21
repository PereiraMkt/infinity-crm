
import { Bell, Search, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface TopNavProps {
  onMenuButtonClick: () => void;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

export function TopNav({ onMenuButtonClick, isSidebarOpen, toggleSidebar }: TopNavProps) {
  const { user, profile } = useAuth();

  return (
    <header className="h-16 px-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuButtonClick}
          className="md:hidden"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
        
        <div className="hidden sm:flex items-center gap-2 ml-2">
          <div className="relative rounded-md shadow-sm">
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="pl-9 h-9 md:w-[200px] lg:w-[300px] bg-background"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
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
