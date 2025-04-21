
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import EditorContent from './EditorContent';
import PreviewContent from './PreviewContent';
import { ChevronsUp, Eye, EyeOff, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentContentProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  documentTitle?: string;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ 
  initialContent = "# Start writing your document here",
  onContentChange,
  documentTitle = "Untitled Document"
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [fontFamily, setFontFamily] = useState<string>('"Inter", sans-serif');
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState<string>("#1A1F2C");
  const [textAlignment, setTextAlignment] = useState<string>("left");
  const [lineHeight, setLineHeight] = useState<string>("1.5");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [showCover, setShowCover] = useState<boolean>(true);
  const [coverImage, setCoverImage] = useState<string>("/placeholder.svg");
  
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

  const handleToggleCover = () => {
    setShowCover(!showCover);
  };

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-[#1A1F2C] dark:bg-[#1A1F2C]">
      {showCover && (
        <div 
          className="relative w-full h-48 bg-cover bg-center flex items-end p-6"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <input
            type="text"
            defaultValue={documentTitle}
            className="relative z-10 bg-transparent border-none font-bold text-2xl focus:outline-none focus:ring-0 w-full text-white"
            placeholder="Untitled Document"
          />
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-black/50 text-white border-white/20 hover:bg-black/70"
              onClick={handleToggleCover}
            >
              <ChevronsUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className={cn("flex items-center justify-end p-2 gap-2", !showCover && "border-b border-gray-700")}>
        {!showCover && (
          <input
            type="text"
            defaultValue={documentTitle}
            className="flex-1 bg-transparent border-none font-medium text-lg focus:outline-none focus:ring-0 text-white"
            placeholder="Untitled Document"
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white"
          onClick={handleTogglePreview}
        >
          {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        {!showCover && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white"
            onClick={handleToggleCover}
          >
            <ChevronsUp className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-grow relative overflow-hidden" style={{ height: showCover ? 'calc(842px - 240px)' : 'calc(842px - 140px)' }}>
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
