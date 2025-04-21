
import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatFullScreenDialog from "@/components/chat/ChatFullScreenDialog";
import FloatingPanel from "@/components/chat/FloatingPanel";

interface UnifiedChatButtonProps {
  defaultOpen?: boolean;
}

const UnifiedChatButton = ({ defaultOpen = false }: UnifiedChatButtonProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatHeight, setChatHeight] = useState(500);
  const [chatWidth, setChatWidth] = useState(350);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isFullScreen) {
      setIsFullScreen(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setIsOpen(false);
    }
  };

  const handleResizing = () => {
    // Função para lidar com o redimensionamento do painel
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <ChatFullScreenDialog
        isOpen={isFullScreen}
        onClose={() => toggleFullScreen()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <FloatingPanel
        isOpen={isOpen && !isFullScreen}
        chatWidth={chatWidth}
        chatHeight={chatHeight}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onResize={handleResizing}
        onClose={toggleOpen}
        onFullScreen={toggleFullScreen}
      />
      
      <Button
        size="icon"
        onClick={toggleOpen}
        className={`rounded-full h-12 w-12 shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
      >
        {isOpen ? <X /> : <MessageSquare />}
      </Button>
    </div>
  );
};

export default UnifiedChatButton;
