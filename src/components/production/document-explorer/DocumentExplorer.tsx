
import React, { useState } from "react";
import { File, Folder, ChevronDown, ChevronRight, Plus, MoreHorizontal } from "lucide-react";
import { Tree, TreeItem } from "@/components/ui/tree";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import NewItemDialog from "./NewItemDialog";

export interface DocumentItem {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: DocumentItem[];
}

interface DocumentExplorerProps {
  onSelectFile: (file: DocumentItem) => void;
  selectedFile: DocumentItem | null;
}

const initialDocuments: DocumentItem[] = [
  {
    id: "folder-1",
    name: "Projetos",
    type: "folder",
    children: [
      {
        id: "file-1",
        name: "Pipeline de Prospecção BDR/SDR - Infinity",
        type: "file",
        content: "# Pipeline de Prospecção BDR/SDR - Infinity\n\n## Dicas:\n\n\"Estudar é uma forma de estar no controle do seu destino.\"\n\nSe você focar no seu objetivo atual, seja um curso, um livro, estudar para empreender, ou seguir uma carreira, então estude e busque ao máximo para conquistar seus objetivos.\n\nEsse material é exclusivo da Infinity B2B - Especializada em Soluções e Resultados - com intuito de te dar a força e o apoio para alcançar seus resultados, e também será muito útil para sua carreira profissional, com essa experiência e aprendizados vamos crescer juntos e ajudar na realização de novos conquistas!"
      },
      {
        id: "file-2",
        name: "Projeto A",
        type: "file",
        content: "# Projeto A\n\nDescrição do projeto A e seus objetivos principais."
      }
    ]
  },
  {
    id: "folder-2",
    name: "Documentos",
    type: "folder",
    children: [
      {
        id: "file-3",
        name: "Contrato",
        type: "file",
        content: "# Modelo de Contrato\n\nTermos e condições para novos clientes."
      }
    ]
  },
  {
    id: "folder-3",
    name: "Processos",
    type: "folder",
    children: [
      {
        id: "file-4",
        name: "Onboarding",
        type: "file",
        content: "# Processo de Onboarding\n\n1. Reunião inicial\n2. Levantamento de requisitos\n3. Definição de escopo"
      }
    ]
  }
];

const DocumentExplorer: React.FC<DocumentExplorerProps> = ({ onSelectFile, selectedFile }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleAddItem = (parentId: string | null) => {
    setNewItemParentId(parentId);
    setNewItemDialogOpen(true);
  };
  
  const handleCreateItem = (name: string, type: "file" | "folder") => {
    const newItem: DocumentItem = {
      id: `${type}-${Date.now()}`,
      name,
      type,
      content: type === "file" ? "# New Document\n\nStart writing here..." : undefined,
      children: type === "folder" ? [] : undefined,
    };
    
    if (newItemParentId === null) {
      // Add to root
      setDocuments([...documents, newItem]);
    } else {
      // Add to specific folder
      const updatedDocs = addItemToFolder(documents, newItemParentId, newItem);
      setDocuments(updatedDocs);
    }
    
    if (type === "file") {
      onSelectFile(newItem);
    }
  };
  
  const addItemToFolder = (items: DocumentItem[], folderId: string, newItem: DocumentItem): DocumentItem[] => {
    return items.map(item => {
      if (item.id === folderId && item.type === "folder") {
        return {
          ...item,
          children: [...(item.children || []), newItem],
        };
      } else if (item.children) {
        return {
          ...item,
          children: addItemToFolder(item.children, folderId, newItem),
        };
      }
      return item;
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedDocs = deleteItem(documents, itemId);
    setDocuments(updatedDocs);
    
    // If the deleted item was selected, clear selection
    if (selectedFile && selectedFile.id === itemId) {
      onSelectFile(null);
    }
  };
  
  const deleteItem = (items: DocumentItem[], itemId: string): DocumentItem[] => {
    return items.filter(item => {
      if (item.id === itemId) {
        return false;
      }
      
      if (item.children) {
        item.children = deleteItem(item.children, itemId);
      }
      
      return true;
    });
  };

  const renderItems = (items: DocumentItem[], level = 0) => {
    if (!items || items.length === 0) return null;

    const filteredItems = searchQuery ? 
      items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.children && item.children.some(child => 
          child.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      ) : 
      items;

    return filteredItems.map((item) => {
      if (item.type === "folder") {
        return (
          <TreeItem 
            key={item.id}
            icon={<Folder className="h-4 w-4 text-muted-foreground" />}
            label={item.name}
            actions={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => handleAddItem(item.id)}>
                    Add Item
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          >
            {item.children && renderItems(item.children, level + 1)}
          </TreeItem>
        );
      } else {
        return (
          <TreeItem
            key={item.id}
            icon={<File className="h-4 w-4 text-muted-foreground" />}
            label={item.name}
            onClick={() => onSelectFile(item)}
            className={cn(selectedFile?.id === item.id && "bg-primary/10")}
            actions={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />
        );
      }
    });
  };

  return (
    <div className="h-full border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Documentos</h3>
          <Button variant="ghost" size="sm" onClick={() => handleAddItem(null)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Input
          placeholder="Pesquisar..."
          className="text-sm h-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="overflow-auto flex-1 p-2">
        <Tree className="min-h-[200px]">
          {renderItems(documents)}
        </Tree>
      </div>
      
      <NewItemDialog
        open={newItemDialogOpen}
        onOpenChange={setNewItemDialogOpen}
        onCreateItem={handleCreateItem}
      />
    </div>
  );
};

export default DocumentExplorer;
