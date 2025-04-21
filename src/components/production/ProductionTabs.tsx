
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionKanban from "./ProductionKanban";
import EmptyTabContent from "./EmptyTabContent";
import { KanbanColumnItem } from "@/components/kanban/types";
import NotionEditor from "./NotionEditor";
import MindMap from "./MindMap";
import DocumentEditor from "./DocumentEditor";
import GanttChart from "./GanttChart";

interface ProductionTabsProps {
  columns: KanbanColumnItem[];
  setColumns: (columns: KanbanColumnItem[]) => void;
}

const ProductionTabs = ({ columns, setColumns }: ProductionTabsProps) => {
  const [activeTab, setActiveTab] = useState("tarefas");
  const [allTasks, setAllTasks] = useState<any[]>([]);

  // Extract all tasks from columns for Gantt Chart
  useEffect(() => {
    const tasks = columns.flatMap(column => column.cards);
    setAllTasks(tasks);
  }, [columns]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleTaskUpdate = (updatedTask: any) => {
    // Find which column contains the task and update it
    const updatedColumns = columns.map(column => {
      const taskIndex = column.cards.findIndex(card => card.id === updatedTask.id);
      if (taskIndex !== -1) {
        // Create a new array with the updated task
        const updatedCards = [...column.cards];
        updatedCards[taskIndex] = updatedTask;
        return { ...column, cards: updatedCards };
      }
      return column;
    });
    
    setColumns(updatedColumns);
  };

  // Determine if we should apply the expanded height class for the document editor
  const isDocumentTab = activeTab === "documentos";

  return (
    <Tabs defaultValue="tarefas" className="w-full h-full" onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-fit mb-6 bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md metallic-item">
        <TabsTrigger value="tarefas" className="text-sm px-4">Tarefas</TabsTrigger>
        <TabsTrigger value="gantt" className="text-sm px-4">Gráfico Gantt</TabsTrigger>
        <TabsTrigger value="documentos" className="text-sm px-4">Documentos</TabsTrigger>
        <TabsTrigger value="mapamental" className="text-sm px-4">Mapa Mental</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tarefas" className="mt-0">
        <ProductionKanban columns={columns} setColumns={setColumns} />
      </TabsContent>
      
      <TabsContent value="gantt" className="mt-0 bg-transparent dark:bg-transparent backdrop-blur-sm shadow-md rounded-lg">
        <GanttChart tasks={allTasks} onTaskUpdate={handleTaskUpdate} />
      </TabsContent>
      
      <TabsContent value="documentos" className={`mt-0 bg-transparent dark:bg-transparent backdrop-blur-sm shadow-md rounded-lg ${isDocumentTab ? 'h-[calc(100vh-13rem)]' : ''}`}>
        <DocumentEditor />
      </TabsContent>
      
      <TabsContent value="mapamental" className="mt-0 bg-transparent dark:bg-transparent backdrop-blur-sm shadow-md rounded-lg">
        <MindMap />
      </TabsContent>
    </Tabs>
  );
};

export default ProductionTabs;
