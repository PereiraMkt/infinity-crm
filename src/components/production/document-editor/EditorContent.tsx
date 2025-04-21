
import React, { useEffect, forwardRef, useRef, useState } from "react";

interface EditorContentProps {
  content: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  textAlignment: string;
  onUpdateContent: (content: string) => void;
}

const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(({
  content,
  fontFamily,
  textColor,
  backgroundColor,
  textAlignment,
  onUpdateContent,
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // Set up the editor on component mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content.replace(/\n/g, "<br/>");
      
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);
  
  // Handle mouse events for cursor
  const handleMouseDown = (e: React.MouseEvent) => {
    if (editorRef.current && e.currentTarget === e.target) {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      editorRef.current.focus();
    }
  };

  // Handle input changes
  const handleInput = () => {
    if (editorRef.current) {
      // Get content and update state
      const newContent = editorRef.current.innerHTML.replace(/<br>/g, "\n");
      onUpdateContent(newContent);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    // Get text only from clipboard to avoid pasted HTML formatting
    const text = e.clipboardData.getData("text/plain");
    // Insert at cursor position
    document.execCommand("insertText", false, text);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Handle file drops if needed
      console.log("File dropped:", files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="w-full h-full p-8 outline-none overflow-auto notion-content"
      contentEditable={true}
      ref={(node) => {
        // Merge refs
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        editorRef.current = node;
      }}
      onInput={handleInput}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseDown={handleMouseDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        fontFamily,
        color: textColor,
        backgroundColor,
        textAlign: textAlignment as "left" | "center" | "right" | "justify",
        position: "relative",
        minHeight: "100%",
      }}
      suppressContentEditableWarning
      spellCheck
    />
  );
});

EditorContent.displayName = "EditorContent";

export default EditorContent;
