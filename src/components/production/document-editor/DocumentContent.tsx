
import React, { useState, useEffect, useRef } from 'react';
import FloatingFormatToolbar from './toolbar/FloatingFormatToolbar';
import { useDocumentContext } from '../document-explorer/contexts/DocumentContext';
import { DocumentItem } from '../document-explorer/types';

interface DocumentContentProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  documentId: string;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ initialContent, onContentChange, documentId }) => {
  const [content, setContent] = useState(initialContent);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, documentId]);

  // Setup autosave
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      onContentChange(content);
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, onContentChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        onContentChange(content);
      }
    };
  }, []);

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    
    if (selection && !selection.isCollapsed && editorRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      
      setToolbarPosition({
        top: rect.top - editorRect.top - 40,
        left: rect.left + (rect.width / 2) - editorRect.left
      });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  const handleFormatAction = (action: string, value?: string) => {
    document.execCommand(action, false, value);
    
    // Update content state after formatting
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background p-4">
      {showToolbar && (
        <FloatingFormatToolbar 
          position={toolbarPosition} 
          onFormatAction={handleFormatAction} 
        />
      )}
      <div
        ref={editorRef}
        className="prose prose-lg dark:prose-invert max-w-none flex-1 p-4 overflow-auto focus:outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default DocumentContent;
