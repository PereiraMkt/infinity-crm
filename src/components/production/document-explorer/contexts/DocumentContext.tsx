
import React, { createContext, useContext, useState, useEffect } from 'react';
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

const initialDocuments: DocumentItem[] = [
  {
    id: "folder-1",
    name: "Projetos",
    type: "folder",
    expanded: true,
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
    expanded: false,
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
    expanded: false,
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

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
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
