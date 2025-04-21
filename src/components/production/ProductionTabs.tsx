
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionKanban from "./ProductionKanban";
import { KanbanColumnItem } from "@/components/kanban/types";
import GanttChart from "./GanttChart";
import MindMap from "./MindMap";
import NotionEditor from "./NotionEditor";

/**
 * Componente de tabs ajustado para que o container principal tenha largura A4
 * e removido a barra de filtros/topo das abas Documentos/Gantt/Mapa Mental,
 * ficando só nas abas de tarefas e Gantt.
 */
interface ProductionTabsProps {
  columns: KanbanColumnItem[];
  setColumns: (columns: KanbanColumnItem[]) => void;
}

const ProductionTabs = ({ columns, setColumns }: ProductionTabsProps) => {
  const [activeTab, setActiveTab] = useState("documentos");
  const [allTasks, setAllTasks] = useState<any[]>([]);

  useEffect(() => {
    const tasks = columns.flatMap(column => column.cards);
    setAllTasks(tasks);
  }, [columns]);

  const handleTabChange = (value: string) => setActiveTab(value);

  const handleTaskUpdate = (updatedTask: any) => {
    const updatedColumns = columns.map(column => {
      const taskIndex = column.cards.findIndex(card => card.id === updatedTask.id);
      if (taskIndex !== -1) {
        const updatedCards = [...column.cards];
        updatedCards[taskIndex] = updatedTask;
        return { ...column, cards: updatedCards };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  // Estilo A4 centralizado (21 x 29.7cm ~ 794 x 1123px)
  const contentA4 = "flex justify-center items-start w-full";
  const a4Paper = "w-[794px] min-h-[1123px] max-w-full bg-white border border-gray-200 rounded-lg shadow px-8 py-8 overflow-visible";

  return (
    <Tabs defaultValue="documentos" className="w-full h-full" onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-4 w-full md:w-fit mb-6 bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md metallic-item">
        <TabsTrigger value="documentos" className="text-sm px-4">Documentos</TabsTrigger>
        <TabsTrigger value="kanban" className="text-sm px-4">Kanban</TabsTrigger>
        <TabsTrigger value="gantt" className="text-sm px-4">Gráfico Gantt</TabsTrigger>
        <TabsTrigger value="mapamental" className="text-sm px-4">Mapa Mental</TabsTrigger>
      </TabsList>
      
      <TabsContent value="documentos" className={contentA4}>
        <div className={a4Paper}>
          <NotionEditor />
        </div>
      </TabsContent>
      
      <TabsContent value="kanban" className={contentA4}>
        <div className={a4Paper + " overflow-auto min-h-[400px]"}>
          <ProductionKanban columns={columns} setColumns={setColumns} />
        </div>
      </TabsContent>
      
      <TabsContent value="gantt" className={contentA4}>
        <div className={a4Paper + " overflow-auto min-h-[400px]"}>
          <GanttChart tasks={allTasks} onTaskUpdate={handleTaskUpdate} />
        </div>
      </TabsContent>
      
      <TabsContent value="mapamental" className={contentA4}>
        <div className={a4Paper + " overflow-auto min-h-[400px]"}>
          <MindMap />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductionTabs;
