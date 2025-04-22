
import { useState } from "react";
import { useDocumentContext } from "../contexts/DocumentContext";
import { DocumentItem } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useDocumentOperations = (
  onSelectFile: (file: DocumentItem) => void,
  onAddDocument?: (document: DocumentItem) => void
) => {
  const { toast } = useToast();
  const { documents, setDocuments, selectedFolder, setSelectedFolder } = useDocumentContext();
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);

  const handleAddItem = (parentId: string | null = null) => {
    setNewItemParentId(parentId);
    setNewItemDialogOpen(true);
  };

  const handleCreateItem = (name: string, type: "file" | "folder") => {
    const newItem: DocumentItem = {
      id: `${type}-${Date.now()}`,
      name,
      type,
    };

    if (type === "folder") {
      newItem.children = [];
    } else {
      newItem.content = "";
    }

    if (newItemParentId) {
      // Add to specific folder
      const updateFolderRecursively = (items: DocumentItem[]): DocumentItem[] => {
        return items.map((item) => {
          if (item.id === newItemParentId) {
            return {
              ...item,
              children: [...(item.children || []), newItem],
            };
          } else if (item.children) {
            return {
              ...item,
              children: updateFolderRecursively(item.children),
            };
          }
          return item;
        });
      };

      setDocuments(updateFolderRecursively(documents));
    } else {
      // Add to root level
      setDocuments([...documents, newItem]);
    }

    toast({
      title: type === "file" ? "Novo documento criado" : "Nova pasta criada",
      description: `"${name}" foi criado com sucesso.`,
    });

    // If it's a file and we have the callback, select it
    if (type === "file") {
      if (onAddDocument) {
        onAddDocument(newItem);
      } else {
        onSelectFile(newItem); 
      }
    }

    setNewItemDialogOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const deleteRecursively = (items: DocumentItem[]): DocumentItem[] => {
      return items.filter((item) => {
        if (item.id === id) return false;
        if (item.children) {
          item.children = deleteRecursively(item.children);
        }
        return true;
      });
    };

    setDocuments(deleteRecursively(documents));
    toast({
      title: "Item excluído",
      description: "O item foi excluído com sucesso.",
    });
  };

  const handleRename = (id: string, newName: string) => {
    if (!newName.trim()) return;

    const updateRecursively = (items: DocumentItem[]): DocumentItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, name: newName };
        } else if (item.children) {
          return { ...item, children: updateRecursively(item.children) };
        }
        return item;
      });
    };

    setDocuments(updateRecursively(documents));
    toast({
      title: "Renomeado",
      description: `Nome alterado para "${newName}".`,
    });
  };

  const handleExportDocument = (doc: DocumentItem) => {
    if (doc.type !== "file" || !doc.content) return;
    
    const blob = new Blob([doc.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.name}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportado",
      description: `Documento "${doc.name}" exportado.`,
    });
  };

  return {
    newItemDialogOpen,
    setNewItemDialogOpen,
    handleAddItem,
    handleCreateItem,
    handleDeleteItem,
    handleRename,
    handleExportDocument,
  };
};
