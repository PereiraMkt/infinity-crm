import React, { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DocumentExplorer from "./document-explorer/DocumentExplorer";
import { DocumentItem } from "./document-explorer/types";
import DocumentContent from "./document-editor/DocumentContent";
import { useToast } from "@/hooks/use-toast";

const DocumentEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentItem | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSelectFile = (file: DocumentItem) => {
    if (selectedFile) {
      setDocuments(prev => 
        prev.map(item => {
          if (item.id === selectedFile.id) {
            return selectedFile;
          }
          return item;
        })
      );
    }
    
    if (file.type === "file") {
      setSelectedFile(file);
      toast({
        title: "Documento aberto",
        description: `${file.name} foi aberto com sucesso.`
      });
    } else if (file.type === "folder") {
      setSelectedFolder(file.id);
    }
  };
  
  const handleContentChange = (content: string) => {
    if (selectedFile) {
      setSelectedFile(prevFile => ({
        ...prevFile,
        content: content
      }));
    }
  };

  const handleAddDocument = (newDocument: DocumentItem) => {
    if (newDocument.type === "file" && selectedFolder) {
      setDocuments(prev => 
        prev.map(item => {
          if (item.id === selectedFolder && item.children) {
            return {
              ...item,
              children: [...item.children, newDocument]
            };
          }
          return item;
        })
      );
      
      setSelectedFile(newDocument);
    } else {
      setDocuments(prev => [...prev, newDocument]);
      
      if (newDocument.type === "file") {
        setSelectedFile(newDocument);
      }
    }
  };
  
  return (
    <div className="h-full border rounded-lg overflow-hidden" style={{ height: '842px' }}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <DocumentExplorer 
            onSelectFile={handleSelectFile} 
            selectedFile={selectedFile}
            onAddDocument={handleAddDocument}
            selectedFolder={selectedFolder}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel>
          {selectedFile ? (
            <DocumentContent 
              initialContent={selectedFile.content || ""}
              onContentChange={handleContentChange}
              documentTitle={selectedFile.name}
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
