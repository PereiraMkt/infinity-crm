
import { useState } from "react";
import ProductionTabs from "@/components/production/ProductionTabs";
import { KanbanColumnItem, KanbanCardItem } from "@/components/kanban/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Download, Plus, RefreshCw } from "lucide-react";
import { useModuleSync } from "@/services/moduleSyncService";
import { useToast } from "@/hooks/use-toast";
import TaskForm from "./TaskForm";

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
          completion: 0,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
          completion: 0,
          startDate: new Date(),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
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
          completion: 45,
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
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
          completion: 85,
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
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
          completion: 100,
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    }
  ];

  const [columns, setColumns] = useState<KanbanColumnItem[]>(mockTasksKanbanColumns);
  const { syncAllModules, isSyncing } = useModuleSync();
  const { toast } = useToast();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const handleSyncModules = () => {
    syncAllModules();
    toast({
      title: "Sincronização iniciada",
      description: "Sincronizando dados entre todos os módulos...",
    });
  };

  const handleAddTask = (newTask: KanbanCardItem) => {
    // Find column based on status
    const targetColumnId = newTask.completion === 100 ? 'done' : 
                          newTask.completion > 0 ? 'in-progress' : 'backlog';
    
    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === targetColumnId
          ? { ...column, cards: [...column.cards, newTask] }
          : column
      )
    );
  };

  const toggleFilter = () => {
    setFilterActive(!filterActive);
    
    if (!filterActive) {
      toast({
        title: "Filtro ativado",
        description: "Mostrando apenas tarefas de alta prioridade",
      });
      
      // Filter to show only high priority tasks
      setColumns(prevColumns => 
        prevColumns.map(column => ({
          ...column,
          cards: column.cards.filter(card => card.priority === "high")
        }))
      );
    } else {
      // Reset to all tasks
      setColumns(mockTasksKanbanColumns);
    }
  };

  const handleExport = () => {
    // Prepare data for export
    const exportData = {
      title: "Relatório de Produção",
      date: new Date().toISOString(),
      columns: columns.map(column => ({
        title: column.title,
        cards: column.cards.map(card => ({
          title: card.title,
          description: card.description,
          assignedTo: card.assignedTo?.name,
          priority: card.priority,
          completion: card.completion,
          client: card.client
        }))
      }))
    };
    
    // Convert to JSON
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    // Create link and trigger download
    const link = document.createElement('a');
    link.href = href;
    link.download = `production-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Exportação concluída",
      description: "Relatório de produção exportado com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md border border-border/40">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button 
              variant={filterActive ? "default" : "outline"} 
              size="sm" 
              className="flex items-center gap-1 h-8"
              onClick={toggleFilter}
            >
              <Filter size={14} />
              <span className="text-xs">Filtrar</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 h-8"
              onClick={handleExport}
            >
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
            <Button 
              size="sm" 
              className="flex items-center gap-1 h-8"
              onClick={() => setIsTaskFormOpen(true)}
            >
              <Plus size={14} />
              <span className="text-xs">Nova Tarefa</span>
            </Button>
          </div>
        </div>
      </Card>
      
      <ProductionTabs columns={columns} setColumns={setColumns} />
      
      <TaskForm 
        isOpen={isTaskFormOpen} 
        onClose={() => setIsTaskFormOpen(false)} 
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default ProductionManagement;
