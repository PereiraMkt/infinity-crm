
import { useState } from "react";
import ProductionTabs from "@/components/production/ProductionTabs";
import { KanbanColumnItem } from "@/components/kanban/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Download, Plus, RefreshCw } from "lucide-react";
import { useModuleSync } from "@/services/moduleSyncService";
import { useToast } from "@/hooks/use-toast";

const ProductionManagement = () => {
  // Updated mock data with id field in assignedTo
  const mockTasksKanbanColumns: KanbanColumnItem[] = [
    {
      id: "backlog",
      title: "Backlog",
      color: "bg-gray-200 dark:bg-gray-700",
      cards: [
        {
          id: "task-1",
          title: "Criar landing page",
          description: "Desenvolver nova landing page para campanha de marketing",
          client: "ABC Corp",
          assignedTo: {
            id: "user-1",
            name: "Carlos Silva",
            avatar: "/placeholder.svg"
          },
          priority: "high",
          completion: 0
        },
        {
          id: "task-2",
          title: "Revisar design do app",
          description: "Fazer revisão do design do aplicativo móvel",
          client: "XYZ Ltda",
          assignedTo: {
            id: "user-2",
            name: "Ana Oliveira",
            avatar: "/placeholder.svg"
          },
          priority: "medium",
          completion: 0
        }
      ]
    },
    {
      id: "in-progress",
      title: "Em Progresso",
      color: "bg-blue-200 dark:bg-blue-900",
      cards: [
        {
          id: "task-3",
          title: "Implementar API de pagamentos",
          description: "Integrar gateway de pagamento no sistema de e-commerce",
          client: "Shop Online",
          assignedTo: {
            id: "user-3",
            name: "Miguel Santos",
            avatar: "/placeholder.svg"
          },
          priority: "high",
          completion: 45
        }
      ]
    },
    {
      id: "review",
      title: "Revisão",
      color: "bg-yellow-200 dark:bg-yellow-900",
      cards: [
        {
          id: "task-4",
          title: "Testar funcionalidade de login",
          description: "Realizar testes de usabilidade e segurança no login",
          client: "SecureTech",
          assignedTo: {
            id: "user-4",
            name: "Julia Costa",
            avatar: "/placeholder.svg"
          },
          priority: "medium",
          completion: 85
        }
      ]
    },
    {
      id: "done",
      title: "Concluído",
      color: "bg-green-200 dark:bg-green-900",
      cards: [
        {
          id: "task-5",
          title: "Criar identidade visual",
          description: "Desenvolver logo e identidade visual para novo cliente",
          client: "New Brand",
          assignedTo: {
            id: "user-5",
            name: "Roberto Alves",
            avatar: "/placeholder.svg"
          },
          priority: "low",
          completion: 100
        }
      ]
    }
  ];

  const [columns, setColumns] = useState<KanbanColumnItem[]>(mockTasksKanbanColumns);
  const { syncAllModules, isSyncing } = useModuleSync();
  const { toast } = useToast();

  const handleSyncModules = () => {
    syncAllModules();
    toast({
      title: "Sincronização iniciada",
      description: "Sincronizando dados entre todos os módulos...",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md border border-border/40">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
              <Filter size={14} />
              <span className="text-xs">Filtrar</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
              <Download size={14} />
              <span className="text-xs">Exportar</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 h-8"
              onClick={handleSyncModules}
              disabled={isSyncing}
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              <span className="text-xs">{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
            </Button>
            <Button size="sm" className="flex items-center gap-1 h-8">
              <Plus size={14} />
              <span className="text-xs">Nova Tarefa</span>
            </Button>
          </div>
        </div>
      </Card>
      
      <ProductionTabs columns={columns} setColumns={setColumns} />
    </div>
  );
};

export default ProductionManagement;
