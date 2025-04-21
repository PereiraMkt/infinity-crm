
import React, { useEffect, forwardRef, useRef, useState } from "react";
import FloatingFormatToolbar from "./toolbar/FloatingFormatToolbar";

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
  const [selectedText, setSelectedText] = useState("");
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [formatToolbarPosition, setFormatToolbarPosition] = useState({ top: 0, left: 0 });
  const [collaborators, setCollaborators] = useState<{id: string, name: string, color: string, position: {x: number, y: number}}[]>([
    { id: 'user1', name: 'Ana Silva', color: '#FF5733', position: { x: 150, y: 80 } },
    { id: 'user2', name: 'Carlos Mendes', color: '#33FF57', position: { x: 300, y: 120 } }
  ]);
  
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
  
  // Handle selection changes to show format toolbar
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && selection.toString() && isFocused) {
      setSelectedText(selection.toString());
      
      // Calculate position for the toolbar
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      if (rect.width > 0) {
        // Position above the selection with slight offset
        setFormatToolbarPosition({
          top: Math.max(rect.top - 50, 10), // Ensure toolbar doesn't go off-screen
          left: rect.left + (rect.width / 2) // Center horizontally
        });
        setShowFormatToolbar(true);
      }
    } else {
      setSelectedText("");
      setShowFormatToolbar(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [isFocused]);

  // Simulate collaborative editing - in real app this would use WebSockets
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(user => ({
        ...user,
        position: {
          x: Math.min(Math.max(user.position.x + (Math.random() * 40 - 20), 50), 700),
          y: Math.min(Math.max(user.position.y + (Math.random() * 40 - 20), 50), 400)
        }
      })));
    }, 3000);
    
    return () => clearInterval(interval);
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

  const handleFormatAction = (action: string, value?: string) => {
    document.execCommand(action, false, value);
  };

  return (
    <div className="relative w-full h-full">
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
        onBlur={() => {
          setIsFocused(false);
          // Delay hiding the toolbar to allow clicking on it
          setTimeout(() => {
            if (!document.activeElement?.closest('.floating-format-toolbar')) {
              setShowFormatToolbar(false);
            }
          }, 100);
        }}
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
      
      {showFormatToolbar && (
        <FloatingFormatToolbar 
          position={formatToolbarPosition}
          onFormatAction={handleFormatAction}
        />
      )}

      {/* Collaborative cursors */}
      {collaborators.map(user => (
        <div 
          key={user.id}
          className="absolute pointer-events-none transition-all duration-500 ease-in-out z-20"
          style={{
            left: `${user.position.x}px`,
            top: `${user.position.y}px`
          }}
        >
          <div 
            className="h-5 w-0.5 -translate-x-1/2"
            style={{ backgroundColor: user.color }}
          ></div>
          <div 
            className="text-xs px-2 py-0.5 rounded-md -translate-x-1/2 whitespace-nowrap"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </div>
        </div>
      ))}
    </div>
  );
});

EditorContent.displayName = "EditorContent";

export default EditorContent;
