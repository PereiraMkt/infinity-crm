
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

  // Set up the editor on component mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content.replace(/\n/g, "<br/>");
      editorRef.current.focus();
    }
  }, []);

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

  return (
    <div
      className="w-full h-full p-8 outline-none overflow-auto"
      contentEditable={true}
      ref={editorRef}
      onInput={handleInput}
      onPaste={handlePaste}
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
