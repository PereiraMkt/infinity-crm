
import React from "react";
import { useToast } from "@/hooks/use-toast";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { KanbanColumnItem } from "@/components/kanban/types";

interface ProductionKanbanProps {
  columns: KanbanColumnItem[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>;
}

const ProductionKanban = ({ columns, setColumns }: ProductionKanbanProps) => {
  const { toast } = useToast();

  return (
    <div className="pb-6">
      <KanbanBoard 
        columns={columns}
        setColumns={setColumns}
        onAddCard={(columnId) => {
          toast({
            title: "Nova Tarefa",
            description: "Função de adicionar tarefas será implementada em breve",
          });
        }}
        onEditCard={(cardId, columnId) => {
          toast({
            title: "Editar Tarefa",
            description: "Função de editar tarefas será implementada em breve",
          });
        }}
        onDeleteCard={(cardId, columnId) => {
          const column = columns.find(col => col.id === columnId);
          if (!column) return;
          
          const card = column.cards.find(card => card.id === cardId);
          if (!card) return;
          
          const newColumns = columns.map(col => {
            if (col.id === columnId) {
              return {
                ...col,
                cards: col.cards.filter(card => card.id !== cardId)
              };
            }
            return col;
          });
          
          setColumns(newColumns);
          
          toast({
            title: "Tarefa removida",
            description: `${card.title} foi removida do quadro`,
          });
        }}
        cardContent={(card) => (
          <div className="flex flex-col gap-1">
            {card.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.description}</p>
            )}
            {card.client && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">Cliente:</span>
                <span>{card.client}</span>
              </div>
            )}
            {card.completion !== undefined && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-green-500 dark:bg-green-600 h-1.5 rounded-full" 
                  style={{ width: `${card.completion}%` }}
                ></div>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ProductionKanban;
