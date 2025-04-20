
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useFloatingAction } from "@/hooks/use-floating-action";
import { UserMenu } from "../auth/UserMenu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const location = useLocation();
  const { setFloatingActionOpen } = useFloatingAction();
  const [hasNotifications, setHasNotifications] = useState(true);

  const notifications = [
    {
      id: 1,
      title: "Nova reunião agendada",
      description: "Reunião com equipe de marketing às 14:00",
      time: "10 minutos atrás",
      read: false
    },
    {
      id: 2,
      title: "Novo lead capturado",
      description: "Lead de campanha de Facebook recebido",
      time: "30 minutos atrás",
      read: false
    },
    {
      id: 3,
      title: "Tarefa atribuída a você",
      description: "Carlos atribuiu uma nova tarefa para você",
      time: "2 horas atrás",
      read: true
    }
  ];

  const markAllAsRead = () => {
    setHasNotifications(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    
    const pageMap: {[key: string]: string} = {
      "/app": "Dashboard",
      "/app/sales-funnel": "Funil de Vendas",
      "/app/clients": "Gestão de Clientes",
      "/app/finance": "Gestão Financeira",
      "/app/products": "Produtos e Serviços",
      "/app/lead-import": "Importação de Leads",
      "/app/production": "Gestão de Produção",
      "/app/team": "Gestão de Equipe",
      "/app/meetings": "Reuniões",
      "/app/settings": "Configurações",
      "/app/user-settings": "Configurações do Usuário",
      "/app/whatsapp": "Integração WhatsApp",
      "/app/ads-integration": "Integração de Anúncios"
    };
    
    return pageMap[path] || "Dashboard";
  };

  const getPageDescription = () => {
    const path = location.pathname;
    
    const descMap: {[key: string]: string} = {
      "/app": "Visualize métricas importantes e atividades recentes.",
      "/app/sales-funnel": "Gerencie leads e acompanhe o processo de vendas.",
      "/app/clients": "Visualize e gerencie seus clientes.",
      "/app/finance": "Controle entradas, saídas e visualize relatórios financeiros.",
      "/app/products": "Gerencie produtos e serviços oferecidos.",
      "/app/lead-import": "Importe leads de diferentes fontes.",
      "/app/production": "Acompanhe projetos e tarefas em andamento.",
      "/app/team": "Gerencie membros da equipe e atribuições.",
      "/app/meetings": "Agende e gerencie reuniões com clientes e equipe.",
      "/app/settings": "Configure seu ambiente de trabalho.",
      "/app/user-settings": "Personalize seu perfil e preferências.",
      "/app/whatsapp": "Integre o WhatsApp Business com seu CRM.",
      "/app/ads-integration": "Configure integração com plataformas de anúncios."
    };
    
    return descMap[path] || "Visualize métricas importantes e atividades recentes.";
  };

  return (
    <header className="border-b sticky top-0 z-30 bg-background/70 backdrop-blur-lg flex h-16 items-center px-4 md:px-6 transition-all duration-200">
      <div className="flex items-center flex-1 gap-2">
        <div className="w-full flex flex-col">
          <h1 className="text-xl font-semibold">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {getPageDescription()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-card dark:bg-gray-900/90 backdrop-blur-md" align="end">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-medium">Notificações</h3>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Marcar todas como lidas
              </Button>
            </div>
            <div className="max-h-[400px] overflow-auto">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 hover:bg-muted/50 ${notification.read ? '' : 'bg-muted/20'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">Não há notificações</p>
                </div>
              )}
            </div>
            <div className="p-2 border-t text-center">
              <Button variant="ghost" size="sm" className="w-full">
                Ver todas as notificações
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
