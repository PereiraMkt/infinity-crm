
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface EditorContentProps {
  content: string;
  setContent?: (content: string) => void;
  onUpdateContent?: (content: string) => void;
  fontFamily: string;
  fontSize?: string;
  textColor?: string;
  backgroundColor?: string;
  textAlignment?: string;
  lineHeight?: string;
}

const EditorContent: React.FC<EditorContentProps> = ({ 
  content, 
  setContent,
  onUpdateContent,
  fontFamily, 
  fontSize = '16px',
  textColor = 'black',
  backgroundColor = 'transparent',
  textAlignment = 'left',
  lineHeight = '1.5'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (setContent) {
      setContent(newContent);
    }
    if (onUpdateContent) {
      onUpdateContent(newContent);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <Textarea
          value={content}
          onChange={handleChange}
          className="w-full h-[500px] p-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          placeholder="Comece a escrever seu documento..."
          style={{ 
            fontFamily, 
            fontSize,
            color: textColor !== 'default' ? textColor : undefined,
            backgroundColor: backgroundColor !== 'default' ? backgroundColor : undefined,
            textAlign: textAlignment as any,
            lineHeight
          }}
        />
      </div>
    </ScrollArea>
  );
};

export default EditorContent;
