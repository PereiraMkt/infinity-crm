
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarPanelProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  nodeName: string;
  setNodeName: (name: string) => void;
  onAddNode: () => void;
}

const SidebarPanel = ({
  sidebarOpen,
  setSidebarOpen,
  nodeName,
  setNodeName,
  onAddNode
}: SidebarPanelProps) => {
  return (
    <>
      <div
        className={`flex-shrink-0 border-r transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-[240px]" : "w-0 overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="font-medium text-sm">Elementos</h2>
        </div>

        <div className="flex-1 overflow-auto p-2">
          <div className="mb-4">
            <Label htmlFor="node-name" className="text-xs">
              Nome do Nó:
            </Label>
            <div className="flex gap-2">
              <Input
                type="text"
                id="node-name"
                className="text-xs"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
              />
              <Button size="sm" onClick={onAddNode}>
                Adicionar
              </Button>
            </div>
          </div>
          <Separator />
          <ScrollArea className="h-[calc(100%-10rem)] mt-4">
            <div className="flex flex-col gap-2 p-2">
              <Button
                variant="outline"
                className="bg-secondary/50 text-xs w-full"
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/reactflow", "input");
                  event.dataTransfer.effectAllowed = "move";
                }}
                draggable
              >
                Nó de Entrada
              </Button>
              <Button
                variant="outline"
                className="bg-secondary/50 text-xs w-full"
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/reactflow", "default");
                  event.dataTransfer.effectAllowed = "move";
                }}
                draggable
              >
                Nó Padrão
              </Button>
              <Button
                variant="outline"
                className="bg-secondary/50 text-xs w-full"
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/reactflow", "output");
                  event.dataTransfer.effectAllowed = "move";
                }}
                draggable
              >
                Nó de Saída
              </Button>
              <Button
                variant="outline"
                className="bg-secondary/50 text-xs w-full"
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/reactflow", "customNode");
                  event.dataTransfer.effectAllowed = "move";
                }}
                draggable
              >
                Nó Customizado
              </Button>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-0 z-10 h-7 w-7 bg-card shadow-md rounded-r-md rounded-l-none border-l-0"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </>
  );
};

export default SidebarPanel;
