
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import FormatToolbar from './FormatToolbar';
import EditorContent from './EditorContent';
import PreviewContent from './PreviewContent';

interface DocumentContentProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ 
  initialContent = "# Start writing your document here",
  onContentChange
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [fontFamily, setFontFamily] = useState<string>('"Inter", sans-serif');
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState<string>("#1A1F2C");
  const [textAlignment, setTextAlignment] = useState<string>("left");
  const [lineHeight, setLineHeight] = useState<string>("1.5");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [documentTitle, setDocumentTitle] = useState<string>("Pipeline de Prospecção BDR/SDR - Infinity");
  
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (onContentChange) {
      onContentChange(content);
    }
  }, [content, onContentChange]);

  const handleUpdateContent = (newContent: string) => {
    setContent(newContent);
  };

  const handleUpdateFormatting = (property: string, value: string) => {
    switch (property) {
      case 'fontFamily':
        setFontFamily(value);
        break;
      case 'textColor':
        setTextColor(value);
        break;
      case 'backgroundColor':
        setBackgroundColor(value);
        break;
      case 'textAlignment':
        setTextAlignment(value);
        break;
      case 'lineHeight':
        setLineHeight(value);
        break;
      default:
        break;
    }
  };

  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Conteúdo copiado",
      description: "O documento foi copiado para a área de transferência."
    });
  };

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-[#1A1F2C] dark:bg-[#1A1F2C]">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-gray-800 dark:bg-gray-800">
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          className="bg-transparent border-none font-medium text-lg focus:outline-none focus:ring-0 w-full text-white"
        />
        <div className="flex items-center gap-2">
          <FormatToolbar
            fontFamily={fontFamily}
            textColor={textColor}
            backgroundColor={backgroundColor}
            textAlignment={textAlignment}
            lineHeight={lineHeight}
            onUpdateFormatting={handleUpdateFormatting}
            isPreviewMode={isPreviewMode}
            onTogglePreview={handleTogglePreview}
            onCopy={handleCopy}
          />
        </div>
      </div>

      <div className="flex-grow relative overflow-hidden" style={{ height: 'calc(842px - 140px)' }}>
        {isPreviewMode ? (
          <PreviewContent
            content={content}
            fontFamily={fontFamily}
            textColor={textColor}
            backgroundColor={backgroundColor}
            textAlignment={textAlignment}
            lineHeight={lineHeight}
          />
        ) : (
          <EditorContent
            content={content}
            fontFamily={fontFamily}
            textColor={textColor}
            backgroundColor={backgroundColor}
            textAlignment={textAlignment}
            onUpdateContent={handleUpdateContent}
            ref={contentRef}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentContent;
