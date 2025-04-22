
import React from "react";

interface FloatingChatProps {
  isOpen?: boolean;
  onClose: () => void;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ isOpen = false, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute bottom-20 right-0 w-96 max-w-[calc(100vw-2rem)] bg-background rounded-lg shadow-lg border border-border p-4 max-h-[600px] overflow-auto">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">Chat</h3>
          <button className="text-muted-foreground hover:text-foreground" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            <span className="sr-only">Fechar</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto space-y-4 mb-4">
          <div className="flex flex-col">
            <div className="bg-muted p-3 rounded-lg inline-block max-w-[80%] self-start">
              <p className="text-sm">Olá! Como posso ajudar você hoje?</p>
              <span className="text-xs text-muted-foreground mt-1 block">Atendente • 10:32</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="bg-primary p-3 rounded-lg text-primary-foreground inline-block max-w-[80%] self-end">
              <p className="text-sm">Preciso de ajuda com o envio de documentos.</p>
              <span className="text-xs text-primary-foreground/80 mt-1 block">Você • 10:35</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="bg-muted p-3 rounded-lg inline-block max-w-[80%] self-start">
              <p className="text-sm">Claro! Para enviar documentos, você pode usar a função de upload na seção de documentos ou anexar diretamente aqui no chat.</p>
              <span className="text-xs text-muted-foreground mt-1 block">Atendente • 10:37</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="w-full px-4 py-2 border rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
            <span className="sr-only">Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingChat;
