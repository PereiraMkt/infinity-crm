
import React, { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DocumentExplorer from "../document-explorer/DocumentExplorer";
import { DocumentItem, SpreadsheetItem } from "../document-explorer/types";
import SpreadsheetContent from "./SpreadsheetContent";
import { useToast } from "@/hooks/use-toast";

const SpreadsheetEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<SpreadsheetItem | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSelectFile = (file: DocumentItem) => {
    if (file.type === "file") {
      // Treat as spreadsheet
      const spreadsheetFile: SpreadsheetItem = {
        ...file,
        type: "file",
        sheets: file.sheets || [
          {
            id: `sheet-${Date.now()}`,
            name: "Sheet 1",
            cells: {},
            columns: 26,
            rows: 100
          }
        ],
        activeSheet: 0
      };
      
      setSelectedFile(spreadsheetFile);
      toast({
        title: "Planilha aberta",
        description: `${file.name} foi aberta com sucesso.`
      });
    } else if (file.type === "folder") {
      setSelectedFolder(file.id);
    }
  };
  
  const handleContentChange = (updatedSpreadsheet: SpreadsheetItem) => {
    setSelectedFile(updatedSpreadsheet);
  };

  const handleAddDocument = (newDocument: DocumentItem) => {
    // Auto-create default spreadsheet content
    if (newDocument.type === "file") {
      const spreadsheetFile: SpreadsheetItem = {
        ...newDocument,
        type: "file",
        sheets: [
          {
            id: `sheet-${Date.now()}`,
            name: "Sheet 1",
            cells: {},
            columns: 26,
            rows: 100
          }
        ],
        activeSheet: 0
      };
      
      setSelectedFile(spreadsheetFile);
    } else if (newDocument.type === "folder") {
      setSelectedFolder(newDocument.id);
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
            <SpreadsheetContent 
              spreadsheet={selectedFile}
              onSpreadsheetChange={handleContentChange}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <p>Selecione uma planilha para editar</p>
                <p className="text-sm">ou crie uma nova na barra lateral</p>
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SpreadsheetEditor;
