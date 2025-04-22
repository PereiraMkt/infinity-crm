
import React, { createContext, useContext, useState } from 'react';
import { DocumentItem } from '../types';

interface DocumentContextType {
  documents: DocumentItem[];
  setDocuments: (docs: DocumentItem[]) => void;
  selectedFolder: string | null;
  setSelectedFolder: (id: string | null) => void;
  editingItem: { id: string; name: string } | null;
  setEditingItem: (item: { id: string; name: string } | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DocumentContext.Provider 
      value={{
        documents,
        setDocuments,
        selectedFolder,
        setSelectedFolder,
        editingItem,
        setEditingItem,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
