
import React, { useState, useRef } from 'react';
import { Plus, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpreadsheetSheet } from '../document-explorer/types';
import { Input } from '@/components/ui/input';

interface SpreadsheetTabsProps {
  sheets: SpreadsheetSheet[];
  activeIndex: number;
  onSelectSheet: (index: number) => void;
  onAddSheet: () => void;
  onRenameSheet: (index: number, name: string) => void;
  onDeleteSheet: (index: number) => void;
}

const SpreadsheetTabs: React.FC<SpreadsheetTabsProps> = ({ 
  sheets, 
  activeIndex, 
  onSelectSheet,
  onAddSheet,
  onRenameSheet,
  onDeleteSheet
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const startRenaming = (index: number) => {
    setEditingIndex(index);
    setEditName(sheets[index].name);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  
  const finishRenaming = () => {
    if (editingIndex !== null && editName.trim()) {
      onRenameSheet(editingIndex, editName.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div className="border-t flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1 overflow-x-auto">
      {sheets.map((sheet, index) => (
        <div
          key={sheet.id}
          className={`flex items-center gap-1 px-3 py-1 rounded-sm cursor-pointer ${
            activeIndex === index 
              ? 'bg-white dark:bg-gray-700 text-primary-foreground border-b-2 border-primary' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-muted-foreground'
          }`}
          onClick={() => onSelectSheet(index)}
        >
          {editingIndex === index ? (
            <Input
              ref={inputRef}
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') finishRenaming();
                else if (e.key === 'Escape') setEditingIndex(null);
              }}
              onBlur={finishRenaming}
              className="h-6 w-24 px-1 py-0"
            />
          ) : (
            <>
              <span className="text-sm whitespace-nowrap max-w-[100px] truncate">
                {sheet.name}
              </span>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    startRenaming(index);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                {sheets.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 opacity-0 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSheet(index);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2"
        onClick={onAddSheet}
      >
        <Plus className="h-3 w-3 mr-1" />
        <span className="text-xs">Adicionar aba</span>
      </Button>
    </div>
  );
};

export default SpreadsheetTabs;
