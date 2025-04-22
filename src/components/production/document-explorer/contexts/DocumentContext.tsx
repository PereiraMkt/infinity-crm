
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { DocumentItem, DocumentContextType } from '../types';

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

interface DocumentProviderProps {
  children: ReactNode;
  initialDocuments?: DocumentItem[];
  onDocumentsChange?: (documents: DocumentItem[]) => void;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children, initialDocuments = [], onDocumentsChange }) => {
  const [documents, setDocumentsState] = useState<DocumentItem[]>(initialDocuments);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const setDocuments = (docs: React.SetStateAction<DocumentItem[]>) => {
    const newDocs = typeof docs === 'function' ? docs(documents) : docs;
    setDocumentsState(newDocs);
    if (onDocumentsChange) {
      onDocumentsChange(newDocs);
    }
  };
  
  const value: DocumentContextType = {
    documents,
    setDocuments,
    selectedFolder,
    setSelectedFolder,
    editingItem,
    setEditingItem,
    searchQuery,
    setSearchQuery
  };
  
  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};
