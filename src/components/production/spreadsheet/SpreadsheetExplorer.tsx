
import React from "react";
import { DocumentProvider } from "../document-explorer/contexts/DocumentContext";
import DocumentExplorer from "../document-explorer/DocumentExplorer";
import { DocumentItem } from "../document-explorer/types";

interface SpreadsheetExplorerProps {
  onSelectFile: (file: DocumentItem) => void;
  selectedFile: DocumentItem | null;
}

const SpreadsheetExplorer: React.FC<SpreadsheetExplorerProps> = ({ onSelectFile, selectedFile }) => {
  return (
    <DocumentProvider>
      <DocumentExplorer onSelectFile={onSelectFile} selectedFile={selectedFile} />
    </DocumentProvider>
  );
};

export default SpreadsheetExplorer;
