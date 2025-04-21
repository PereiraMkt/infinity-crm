
import React from "react";
import { Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ChatContent from "./ChatContent";
import WhatsAppChat from "../whatsapp/WhatsAppChat";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingPanelProps {
  isOpen: boolean;
  chatWidth: number;
  chatHeight: number;
  activeTab: string;
  onTabChange: (value: string) => void;
  onResize: () => void;
  onClose: () => void;
  onFullScreen: () => void;
}

const FloatingPanel = ({
  isOpen,
  chatWidth,
  chatHeight,
  activeTab,
  onTabChange,
  onResize,
  onClose,
  onFullScreen,
}: FloatingPanelProps) => {
  const isMobile = useIsMobile();
  
  if (!isOpen) return null;

  // Reduce size for mobile devices
  const sizeMultiplier = isMobile ? 0.7 : 1;
  const adjustedWidth = Math.round(chatWidth * sizeMultiplier);
  const adjustedHeight = Math.round(chatHeight * sizeMultiplier);

  return (
    <ResizablePanelGroup
      className="mb-4 bg-background border rounded-lg shadow-lg overflow-hidden"
      style={{ width: adjustedWidth, height: adjustedHeight }}
      onResize={onResize}
      direction="vertical"
    >
      <ResizablePanel defaultSize={100} minSize={30}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-medium">Comunicação</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onFullScreen}
                className="h-7 w-7"
              >
                <Maximize2 size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-7 w-7"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="px-2 pt-2 justify-start">
              <TabsTrigger value="chat" className="text-xs px-2 h-8">Interno</TabsTrigger>
              <TabsTrigger value="groups" className="text-xs px-2 h-8">Grupos</TabsTrigger>
              <TabsTrigger value="contacts" className="text-xs px-2 h-8">Contatos</TabsTrigger>
              <TabsTrigger value="whatsapp" className="text-xs px-2 h-8">WhatsApp</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 mt-0 overflow-hidden">
              <ChatContent />
            </TabsContent>
            
            <TabsContent value="groups" className="flex-1 flex flex-col p-0 mt-0 overflow-hidden">
              <div className="p-4 text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                Grupos de conversas com membros da empresa e clientes
              </div>
            </TabsContent>
            
            <TabsContent value="contacts" className="flex-1 flex flex-col p-0 mt-0 overflow-hidden">
              <div className="p-4 text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                Contatos externos (clientes, fornecedores e parceiros)
              </div>
            </TabsContent>
            
            <TabsContent value="whatsapp" className="flex-1 p-0 m-0 overflow-hidden">
              <div className="h-full">
                <WhatsAppChat />
              </div>
            </TabsContent>
          </Tabs>
          
          <ResizableHandle className="h-1 bg-border/60 cursor-row-resize" />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FloatingPanel;
