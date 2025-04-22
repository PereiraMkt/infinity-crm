
import React from 'react';
import { File, Folder, MoreHorizontal, Pencil, Download, Trash } from 'lucide-react';
import { TreeItem } from '@/components/ui/tree';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';
import { cn } from '@/lib/utils';

interface DocumentTreeItemProps {
  item: DocumentItem;
  onSelect: (file: DocumentItem) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onExport: (item: DocumentItem) => void;
  selectedFile: DocumentItem | null;
}

const DocumentTreeItem: React.FC<DocumentTreeItemProps> = ({
  item,
  onSelect,
  onDelete,
  onRename,
  onExport,
  selectedFile,
}) => {
  const { selectedFolder, setSelectedFolder, editingItem, setEditingItem } = useDocumentContext();
  const isSelected = selectedFile?.id === item.id || selectedFolder === item.id;

  const handleFolderClick = () => {
    setSelectedFolder(selectedFolder === item.id ? null : item.id);
  };

  const startRenaming = () => {
    setEditingItem({ id: item.id, name: item.name });
  };

  if (editingItem?.id === item.id) {
    return (
      <TreeItem
        icon={item.type === "folder" ? <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />}
        label={
          <Input
            size={1}
            className="h-6 py-1 text-xs"
            defaultValue={editingItem.name}
            autoFocus
            onBlur={(e) => onRename(item.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onRename(item.id, e.currentTarget.value);
              } else if (e.key === 'Escape') {
                setEditingItem(null);
              }
            }}
          />
        }
      />
    );
  }

  return (
    <TreeItem
      icon={
        <div className={cn("h-4 w-4", isSelected && "text-primary")}>
          {item.type === "folder" ? <Folder /> : <File />}
        </div>
      }
      label={item.name}
      onClick={item.type === "folder" ? handleFolderClick : () => onSelect(item)}
      className={cn(isSelected && "bg-primary/10")}
      actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={startRenaming}>
              <Pencil className="mr-2 h-4 w-4" /> Renomear
            </DropdownMenuItem>
            {item.type === "file" && (
              <DropdownMenuItem onClick={() => onExport(item)}>
                <Download className="mr-2 h-4 w-4" /> Exportar
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive focus:text-destructive">
              <Trash className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    />
  );
};

export default DocumentTreeItem;
