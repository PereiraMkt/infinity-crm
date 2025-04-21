
import { useEffect, useRef } from "react";

interface EditorContentProps {
  content: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  textAlignment: string;
  onUpdateContent: (content: string) => void;
}

const EditorContent = ({
  content,
  fontFamily,
  textColor,
  backgroundColor,
  textAlignment,
  onUpdateContent,
}: EditorContentProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Set up the editor on component mount or when content changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content.replace(/\n/g, "<br/>");
    }
  }, [content]);

  // Handle input changes
  const handleInput = () => {
    if (editorRef.current) {
      // Get content and update state
      const newContent = editorRef.current.innerHTML;
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

  // Handle key combinations for formatting
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+B for bold
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      document.execCommand('bold');
    }
    // Ctrl+I for italic
    else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      document.execCommand('italic');
    }
    // Ctrl+U for underline
    else if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      document.execCommand('underline');
    }
  };

  return (
    <div
      className="w-full h-full outline-none overflow-auto"
      contentEditable={true}
      ref={editorRef}
      onInput={handleInput}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      style={{
        fontFamily,
        color: textColor,
        backgroundColor,
        textAlign: textAlignment as "left" | "center" | "right" | "justify",
      }}
      spellCheck
    />
  );
};

export default EditorContent;
