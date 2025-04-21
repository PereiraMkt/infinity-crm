
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionKanban from "./ProductionKanban";
import EmptyTabContent from "./EmptyTabContent";
import { KanbanColumnItem } from "@/components/kanban/types";
import NotionEditor from "./NotionEditor";
import MindMap from "./MindMap";
import DocumentEditor from "./DocumentEditor";

interface ProductionTabsProps {
  columns: KanbanColumnItem[];
  setColumns: (columns: KanbanColumnItem[]) => void;
}

const ProductionTabs = ({ columns, setColumns }: ProductionTabsProps) => {
  const [activeTab, setActiveTab] = useState("tarefas");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue="tarefas" className="w-full" onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-fit mb-6 bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md metallic-item">
        <TabsTrigger value="tarefas" className="text-sm px-4">Tarefas</TabsTrigger>
        <TabsTrigger value="processos" className="text-sm px-4">Processos</TabsTrigger>
        <TabsTrigger value="documentos" className="text-sm px-4">Documentos</TabsTrigger>
        <TabsTrigger value="mapamental" className="text-sm px-4">Mapa Mental</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tarefas" className="mt-0">
        <ProductionKanban columns={columns} setColumns={setColumns} />
      </TabsContent>
      
      <TabsContent value="processos" className="mt-0 bg-transparent dark:bg-transparent backdrop-blur-sm shadow-md rounded-lg">
        <EmptyTabContent
          heading="Processos"
          description="Configure e monitore os processos de produção."
          buttonText="Configurar Processos"
        />
      </TabsContent>
      
      <TabsContent value="documentos" className="mt-0 bg-transparent dark:bg-transparent backdrop-blur-sm shadow-md rounded-lg">
        <DocumentEditor />
      </TabsContent>
      
      <TabsContent value="mapamental" className="mt-0 bg-transparent dark:bg-transparent backdrop-blur-sm shadow-md rounded-lg">
        <MindMap />
      </TabsContent>
    </Tabs>
  );
};

export default ProductionTabs;
