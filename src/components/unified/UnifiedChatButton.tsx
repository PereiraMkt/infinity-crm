
import React from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ChatFullScreenDialog from "../chat/ChatFullScreenDialog";
import FloatingPanel from "../chat/FloatingPanel";
import { useFloatingAction } from "@/hooks/use-floating-action";

interface UnifiedChatButtonProps {
  defaultOpen?: boolean;
}

const UnifiedChatButton = ({ defaultOpen = false }: UnifiedChatButtonProps) => {
  const { toast } = useToast();
  const {
    isOpen,
    isFullScreen,
    activeTab,
    chatHeight,
    chatWidth,
    isResizing,
    setActiveTab,
    toggleOpen,
    toggleFullScreen,
    handleResizing
  } = useFloatingAction({ defaultOpen });

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
