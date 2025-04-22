
export interface DocumentItem {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: DocumentItem[];
}

export interface SpreadsheetItem extends DocumentItem {
  type: "file";
  sheets?: SpreadsheetSheet[];
  activeSheet?: number;
}

export interface SpreadsheetSheet {
  id: string;
  name: string;
  cells: Record<string, SpreadsheetCell>;
  columns: number;
  rows: number;
}

export interface SpreadsheetCell {
  value?: any;
  formula?: string;
  format?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    backgroundColor?: string;
    alignment?: "left" | "center" | "right";
  };
}

export interface DocumentContextType {
  documents: DocumentItem[];
  selectedFolder: string | null;
  editingItem: { id: string; name: string } | null;
  searchQuery: string;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setSelectedFolder: React.Dispatch<React.SetStateAction<string | null>>;
  setEditingItem: React.Dispatch<React.SetStateAction<{ id: string; name: string } | null>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
