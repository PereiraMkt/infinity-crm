
import React, { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DocumentExplorer, { DocumentItem } from "./document-explorer/DocumentExplorer";
import DocumentContent from "./document-editor/DocumentContent";
import { useToast } from "@/hooks/use-toast";

const DocumentEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentItem | null>(null);
  const { toast } = useToast();
  
  const handleSelectFile = (file: DocumentItem) => {
    if (file.type === "file") {
      setSelectedFile(file);
      toast({
        title: "Documento aberto",
        description: `${file.name} foi aberto com sucesso.`
      });
    }
  };
  
  const handleContentChange = (content: string) => {
    if (selectedFile) {
      selectedFile.content = content;
    }
  };
  
  return (
    <div className="h-full border rounded-lg overflow-hidden" style={{ height: '842px' }}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <DocumentExplorer onSelectFile={handleSelectFile} selectedFile={selectedFile} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel>
          {selectedFile ? (
            <DocumentContent 
              initialContent={selectedFile.content || ""}
              onContentChange={handleContentChange}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <p>Selecione um documento para editar</p>
                <p className="text-sm">ou crie um novo na barra lateral</p>
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DocumentEditor;
