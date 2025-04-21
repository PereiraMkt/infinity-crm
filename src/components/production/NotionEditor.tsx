
import React, { useState, useEffect, useRef } from "react";
import { 
  Folder, 
  ChevronDown, 
  ChevronRight, 
  File, 
  Plus, 
  ChevronLeft, 
  ChevronRight as ChevronRightIcon,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image,
  Link,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Interface para os documentos
interface Document {
  id: string;
  name: string;
  content: string;
  parentId: string | null;
  isFolder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para a seleção de texto
interface TextSelection {
  start: number;
  end: number;
  text: string;
}

const NotionEditor = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "folder-1",
      name: "Projetos",
      content: "",
      parentId: null,
      isFolder: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "doc-1",
      name: "Pipeline de Prospecção BDR/SDR - Infinity",
      content: `
        <h1>Pipeline de Prospecção BDR/SDR - Infinity</h1>
        <p>Dicas:</p>
        <h3>"Estudar é uma forma de estar no controle do seu destino."</h3>
        <p>Se você focar no seu objetivo atual, seja um curso, um livro, estudar para empreender, ou seguir uma carreira, então estude e busque ao máximo para conquistar seus objetivos.</p>
        <p>Esse material é exclusivo da Infinity B2B - Especializada em Soluções e Resultados - com o intuito de te dar a toca e a equipe para alavancar seus resultados.</p>
        <p>Esse plano também será muito útil para sua carreira profissional, com essa experiência e aprendizados vamos crescer juntos e ajudar na realização de novos conquistadores!</p>
      `,
      parentId: "folder-1",
      isFolder: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "doc-2",
      name: "Onboarding de Clientes",
      content: "<h1>Processo de Onboarding</h1><p>1. Reunião inicial</p><p>2. Levantamento de requisitos</p><p>3. Definição de escopo</p>",
      parentId: "folder-1",
      isFolder: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "folder-2",
      name: "Documentos",
      content: "",
      parentId: null,
      isFolder: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "doc-3",
      name: "Contrato Padrão",
      content: "<h1>Modelo de Contrato</h1><p>Termos e condições para novos clientes.</p>",
      parentId: "folder-2",
      isFolder: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "folder-3",
      name: "Processos",
      content: "",
      parentId: null,
      isFolder: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "doc-4",
      name: "Etapas de Desenvolvimento",
      content: "<h1>Etapas de Desenvolvimento</h1><ul><li>Planejamento</li><li>Design</li><li>Implementação</li><li>Testes</li><li>Entrega</li></ul>",
      parentId: "folder-3",
      isFolder: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "folder-1": true,
    "folder-2": false,
    "folder-3": false,
  });
  
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [content, setContent] = useState<string>("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemType, setNewItemType] = useState<string>("document");
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);
  const [isCreatingNewItem, setIsCreatingNewItem] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<TextSelection | null>(null);
  const [showFormatToolbar, setShowFormatToolbar] = useState<boolean>(false);
  const [formatToolbarPosition, setFormatToolbarPosition] = useState({ top: 0, left: 0 });
  
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const formatToolbarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Load initial document
  useEffect(() => {
    if (documents.length > 0 && !selectedDocument) {
      const firstDoc = documents.find(doc => !doc.isFolder);
      if (firstDoc) {
        setSelectedDocument(firstDoc);
        setContent(firstDoc.content);
      }
    }
  }, [documents, selectedDocument]);
  
  // Handle document selection
  const handleSelectDocument = (doc: Document) => {
    if (!doc.isFolder) {
      setSelectedDocument(doc);
      setContent(doc.content);
    }
  };
  
  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Update document content
  const handleContentChange = () => {
    if (contentEditableRef.current && selectedDocument) {
      const newContent = contentEditableRef.current.innerHTML;
      setContent(newContent);
      
      // Update document in the list
      const updatedDocuments = documents.map(doc => 
        doc.id === selectedDocument.id 
          ? { ...doc, content: newContent, updatedAt: new Date() } 
          : doc
      );
      
      setDocuments(updatedDocuments);
    }
  };
  
  // Start creating a new document/folder
  const startCreatingNewItem = (parentId: string | null = null, type: string = "document") => {
    setNewItemParentId(parentId);
    setNewItemType(type);
    setNewItemName("");
    setIsCreatingNewItem(true);
  };
  
  // Create a new document/folder
  const createNewItem = () => {
    if (!newItemName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, forneça um nome para o novo item.",
        variant: "destructive"
      });
      return;
    }
    
    const isFolder = newItemType === "folder";
    const newId = isFolder ? `folder-${Date.now()}` : `doc-${Date.now()}`;
    
    const newItem: Document = {
      id: newId,
      name: newItemName,
      content: isFolder ? "" : "<h1>Novo documento</h1><p>Comece a digitar aqui...</p>",
      parentId: newItemParentId,
      isFolder,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setDocuments([...documents, newItem]);
    
    // If it's a folder, make sure it's expanded
    if (isFolder) {
      setExpandedFolders(prev => ({
        ...prev,
        [newId]: true
      }));
    } else {
      // If it's a document, select it
      setSelectedDocument(newItem);
      setContent(newItem.content);
    }
    
    // Ensure parent folder is expanded
    if (newItemParentId) {
      setExpandedFolders(prev => ({
        ...prev,
        [newItemParentId]: true
      }));
    }
    
    setIsCreatingNewItem(false);
    
    toast({
      title: isFolder ? "Pasta criada" : "Documento criado",
      description: `${isFolder ? 'Pasta' : 'Documento'} "${newItemName}" criado com sucesso.`
    });
  };
  
  // Handle selection of text
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    
    if (selection && selection.rangeCount > 0 && contentEditableRef.current) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText && contentEditableRef.current.contains(range.commonAncestorContainer)) {
        // We have a selection inside our editor
        const rect = range.getBoundingClientRect();
        const editorRect = contentEditableRef.current.getBoundingClientRect();
        
        setSelectedText({
          start: range.startOffset,
          end: range.endOffset,
          text: selectedText
        });
        
        setFormatToolbarPosition({
          top: rect.top - editorRect.top - 40, // Position above the selection
          left: rect.left + (rect.width / 2) - editorRect.left - 150 // Center above selection
        });
        
        setShowFormatToolbar(true);
      } else {
        setShowFormatToolbar(false);
      }
    }
  };
  
  // Apply formatting to selected text
  const applyFormat = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    handleContentChange();
  };
  
  // Organize documents in a hierarchical structure
  const organizeDocuments = () => {
    const rootDocs = documents.filter(doc => doc.parentId === null);
    
    const getChildren = (parentId: string) => {
      return documents.filter(doc => doc.parentId === parentId);
    };
    
    const renderItems = (items: Document[]) => {
      return items.map(item => {
        if (item.isFolder) {
          const isExpanded = expandedFolders[item.id] || false;
          const children = getChildren(item.id);
          
          return (
            <div key={item.id} className="mb-1">
              <div 
                className="flex items-center p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => toggleFolder(item.id)}
              >
                {isExpanded ? 
                  <ChevronDown size={15} className="flex-shrink-0" /> : 
                  <ChevronRight size={15} className="flex-shrink-0" />
                }
                <Folder size={15} className="mx-1.5 text-blue-500 flex-shrink-0" />
                <span className="text-sm truncate">{item.name}</span>
              </div>
              
              {isExpanded && (
                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                  {renderItems(children)}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center p-1 h-7 w-full justify-start text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => startCreatingNewItem(item.id)}
                  >
                    <Plus size={14} className="mr-1" />
                    Novo documento
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center p-1 h-7 w-full justify-start text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => startCreatingNewItem(item.id, "folder")}
                  >
                    <Plus size={14} className="mr-1" />
                    Nova pasta
                  </Button>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div
              key={item.id}
              className={`flex items-center p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                selectedDocument?.id === item.id ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              onClick={() => handleSelectDocument(item)}
            >
              <File size={15} className="mr-2 ml-0.5 text-gray-500" />
              <span className="text-sm truncate">{item.name}</span>
            </div>
          );
        }
      });
    };
    
    return renderItems(rootDocs);
  };
  
  // Document format toolbar (appears when text is selected)
  const FormatToolbar = () => {
    return (
      <div 
        ref={formatToolbarRef}
        className={cn(
          "absolute z-10 flex items-center p-1 bg-white dark:bg-gray-800 rounded-md shadow-md border border-gray-200 dark:border-gray-700",
          showFormatToolbar ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ 
          top: Math.max(10, formatToolbarPosition.top), 
          left: Math.max(10, formatToolbarPosition.left) 
        }}
      >
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('bold')}>
          <Bold size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('italic')}>
          <Italic size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('underline')}>
          <Underline size={15} />
        </Button>
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('formatBlock', '<h1>')}>
          <Heading1 size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('formatBlock', '<h2>')}>
          <Heading2 size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('formatBlock', '<h3>')}>
          <Heading3 size={15} />
        </Button>
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('justifyLeft')}>
          <AlignLeft size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('justifyCenter')}>
          <AlignCenter size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('justifyRight')}>
          <AlignRight size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('justifyFull')}>
          <AlignJustify size={15} />
        </Button>
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('insertUnorderedList')}>
          <List size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('insertOrderedList')}>
          <ListOrdered size={15} />
        </Button>
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link size={15} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Adicionar link</h4>
              <Input placeholder="https://exemplo.com" />
              <div className="flex justify-end gap-2 mt-2">
                <Button size="sm" variant="ghost">
                  Cancelar
                </Button>
                <Button size="sm">
                  Salvar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Image size={15} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('formatBlock', '<pre>')}>
          <Code size={15} />
        </Button>
      </div>
    );
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg overflow-hidden h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center gap-2 bg-muted/20">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar}
          className="flex items-center h-8"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          <span className="ml-1.5">{sidebarCollapsed ? "Mostrar" : "Ocultar"}</span>
        </Button>
        
        {selectedDocument && (
          <>
            <div className="h-5 border-r border-gray-300 mx-1"></div>
            
            <span className="text-sm font-medium flex-1 truncate">
              {selectedDocument.name}
            </span>
            
            <span className="text-xs text-muted-foreground">
              Editado: {new Date(selectedDocument.updatedAt).toLocaleDateString()}
            </span>
          </>
        )}
      </div>
      
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <div 
          className={cn(
            "border-r dark:border-gray-700 flex flex-col transition-all duration-300",
            sidebarCollapsed ? "w-0 overflow-hidden" : "w-64"
          )}
        >
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="font-medium text-sm">Documentos</h3>
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus size={15} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => startCreatingNewItem(null)}
                    >
                      <File size={15} className="mr-2" />
                      Novo documento
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => startCreatingNewItem(null, "folder")}
                    >
                      <Folder size={15} className="mr-2" />
                      Nova pasta
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {organizeDocuments()}
            
            {/* New item creation form */}
            {isCreatingNewItem && (
              <div className="mt-2 p-2 border rounded-md bg-muted/20">
                <Input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={newItemType === "folder" ? "Nome da pasta" : "Nome do documento"}
                  className="mb-2"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setIsCreatingNewItem(false)}
                  >
                    <X size={15} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={createNewItem}
                  >
                    <Check size={15} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Editor */}
        <div className="flex-1 relative">
          <FormatToolbar />
          
          {selectedDocument ? (
            <div 
              ref={contentEditableRef}
              className="p-6 h-full overflow-y-auto prose dark:prose-invert max-w-none"
              contentEditable={true}
              dangerouslySetInnerHTML={{ __html: content }}
              onInput={handleContentChange}
              onMouseUp={handleSelectionChange}
              onKeyUp={handleSelectionChange}
              suppressContentEditableWarning={true}
              spellCheck={true}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              Selecione um documento para editar ou crie um novo
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotionEditor;
