
import { useState, useEffect } from "react";

interface UseFloatingActionProps {
  defaultOpen?: boolean;
}

export function useFloatingAction({ defaultOpen = false }: UseFloatingActionProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [chatHeight, setChatHeight] = useState<number>(600);
  const [chatWidth, setChatWidth] = useState<number>(400);
  const [isResizing, setIsResizing] = useState(false);
  
  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    if (isResizing) {
      const handleMouseUp = () => {
        setIsResizing(false);
      };

      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsFullScreen(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleResizing = () => {
    setIsResizing(true);
  };

  // Adicionando a função setFloatingActionOpen para compatibilidade
  const setFloatingActionOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsFullScreen(false);
    }
  };

  return {
    isOpen,
    isFullScreen,
    activeTab,
    chatHeight,
    chatWidth,
    isResizing,
    setActiveTab,
    toggleOpen,
    toggleFullScreen,
    handleResizing,
    setFloatingActionOpen  // Exportando a nova função
  };
}
